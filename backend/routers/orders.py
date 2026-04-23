from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from .. import models, schemas, database
from .auth import get_current_user, get_current_admin
import requests, hashlib
from urllib.parse import urlencode
from dotenv import load_dotenv
import os

load_dotenv()

router = APIRouter(prefix="/api/orders", tags=["orders"])

# PayFast Configuration
PAYFAST_MERCHANT_ID = os.getenv("PAYFAST_MERCHANT_ID", "10000100")
PAYFAST_MERCHANT_KEY = os.getenv("PAYFAST_MERCHANT_KEY", "46f0cd694581a")
PAYFAST_PASSPHRASE = os.getenv("PAYFAST_PASSPHRASE", "jt7NOE43FZPn")
PAYFAST_MODE = os.getenv("PAYFAST_MODE", "sandbox")
PAYFAST_RETURN_URL = "https://www.sandbox.payfast.co.za" if PAYFAST_MODE == "sandbox" else "https://www.payfast.co.za"
PAYFAST_ONSITE_URL = f"{PAYFAST_RETURN_URL}/onsite/process"

class OrderStatusUpdate(BaseModel):
    status: str

class PaymentInitRequest(BaseModel):
    order_number: str
    customer_name: str
    email: str
    phone: str
    address: str
    city: str
    postal_code: str
    delivery_fee: float
    subtotal: float
    items: List[dict]
    delivery_note: Optional[str] = ""

def generate_signature(data: dict, passphrase: str) -> str:
    """Generate PayFast signature"""
    if 'signature' in data:
        del data['signature']
    param_string = ""
    for key in sorted(data.keys()):
        if data[key] is not None and str(data[key]) != "":
            param_string += f"{key}={data[key]}&"
    param_string = param_string.rstrip('&')
    param_string += f"&passphrase={passphrase}"
    return hashlib.md5(param_string.encode()).hexdigest()

@router.post("/", response_model=schemas.OrderResponse)
def create_order(order: schemas.OrderCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    total_amount = sum(item.price * item.quantity for item in order.items) + (order.delivery_fee or 0.0)
    order_data = order.model_dump(exclude={"items"})
    new_order = models.Order(user_id=current_user.id, total_amount=total_amount, **order_data)
    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    
    for item in order.items:
        db_item = models.OrderItem(order_id=new_order.id, product_id=item.product_id, quantity=item.quantity, price=item.price)
        db.add(db_item)
    db.commit()
    db.refresh(new_order)
    return new_order

@router.get("/my", response_model=List[schemas.OrderResponse])
def get_my_orders(db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    orders = db.query(models.Order).filter(models.Order.user_id == current_user.id).all()
    return orders

@router.get("/", response_model=List[schemas.OrderResponse])
def get_all_orders(db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_admin)):
    orders = db.query(models.Order).all()
    return orders

@router.put("/{order_id}/status", response_model=schemas.OrderResponse)
def update_order_status(order_id: int, status_update: OrderStatusUpdate, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_admin)):
    db_order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
    db_order.status = status_update.status
    db.commit()
    db.refresh(db_order)
    return db_order

class PaymentInitRequest(BaseModel):
    order_number: str
    customer_name: str
    email: str
    phone: str
    address: str
    city: str
    postal_code: str
    delivery_fee: float
    subtotal: float
    items: List[dict]
    delivery_note: Optional[str] = ""

@router.post("/initiate-payfast-payment")
def initiate_payfast_payment(
    payment_req: PaymentInitRequest,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Initiate PayFast payment and return redirect URL"""
    try:
        total_amount = payment_req.subtotal + payment_req.delivery_fee

        # Create order in database first
        order_data = {
            "order_number": payment_req.order_number,
            "phone": payment_req.phone,
            "email": payment_req.email,
            "address": payment_req.address,
            "city": payment_req.city,
            "postal_code": payment_req.postal_code,
            "delivery_note": payment_req.delivery_note,
            "delivery_fee": payment_req.delivery_fee,
            "status": "pending_payment"
        }
        new_order = models.Order(user_id=current_user.id, total_amount=total_amount, **order_data)
        db.add(new_order)
        db.commit()
        db.refresh(new_order)

        # Add order items
        for item in payment_req.items:
            db_item = models.OrderItem(
                order_id=new_order.id,
                product_id=item["product_id"],
                quantity=item["quantity"],
                price=item["price"]
            )
            db.add(db_item)
        db.commit()

        # Prepare PayFast data
        payfast_data = {
            "merchant_id": PAYFAST_MERCHANT_ID,
            "merchant_key": PAYFAST_MERCHANT_KEY,
            "return_url": f"{os.getenv('FRONTEND_URL', 'http://localhost:5173')}/payment-success",
            "cancel_url": f"{os.getenv('FRONTEND_URL', 'http://localhost:5173')}/checkout",
            "notify_url": f"{os.getenv('API_URL', 'http://localhost:8000')}/api/orders/payfast-webhook",
            "name_first": payment_req.customer_name.split()[0] if payment_req.customer_name else "",
            "name_last": " ".join(payment_req.customer_name.split()[1:]) if len(payment_req.customer_name.split()) > 1 else "",
            "email_address": payment_req.email,
            "cell_number": payment_req.phone,
            "m_payment_id": payment_req.order_number,
            "amount": f"{total_amount:.2f}",
            "item_name": f"NCC Tiles Order",
            "item_description": payment_req.order_number
        }

        # Generate signature
        payfast_data["signature"] = generate_signature(payfast_data.copy(), PAYFAST_PASSPHRASE)

        # Send request to PayFast to get UUID for onsite payment
        response = requests.post(PAYFAST_ONSITE_URL, data=payfast_data)
        if response.status_code == 200:
            result_data = response.json()
            if "uuid" in result_data:
                return {
                    "success": True,
                    "uuid": result_data["uuid"],
                    "engine_url": f"{PAYFAST_RETURN_URL}/onsite/engine.js"
                }
            else:
                raise Exception("Failed to get UUID from PayFast")
        else:
            raise Exception(f"PayFast API Error: {response.text}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/payfast-webhook")
async def payfast_webhook(request: Request, db: Session = Depends(database.get_db)):
    """PayFast webhook handler for payment confirmation"""
    try:
        form_data = await request.form()
        data_dict = dict(form_data)
        
        # Verify PayFast signature
        received_signature = data_dict.get("signature")
        if not received_signature:
            return {"status": "error", "message": "No signature provided"}
        
        # Generate expected signature
        expected_signature = generate_signature(data_dict, PAYFAST_PASSPHRASE)
        
        if received_signature != expected_signature:
            return {"status": "error", "message": "Invalid signature"}
        
        # Check payment status
        payment_status = data_dict.get("payment_status")
        order_number = data_dict.get("m_payment_id")
        
        if payment_status == "COMPLETE" and order_number:
            # Update order status
            order = db.query(models.Order).filter(models.Order.order_number == order_number).first()
            if order:
                order.status = "paid"
                db.commit()
                return {"status": "success"}
        
        return {"status": "error", "message": "Payment not complete or order not found"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@router.post("/verify-payment/{payment_id}")
def verify_payment(
    payment_id: str, 
    request: dict, 
    db: Session = Depends(database.get_db)
):
    """Verify PayFast payment and update order status"""
    try:
        # Find order by payment_id (order_number)
        order = db.query(models.Order).filter(models.Order.order_number == payment_id).first()
        
        if not order:
            return {"status": "error", "message": "Order not found"}
        
        # Verify signature if provided
        received_signature = request.get("signature")
        if received_signature:
            expected_signature = generate_signature(request, PAYFAST_PASSPHRASE)
            if received_signature != expected_signature:
                return {"status": "error", "message": "Invalid signature"}
        
        # Check payment status
        payment_status = request.get("payment_status")
        if payment_status == "COMPLETE":
            # Update order status to paid
            order.status = "paid"
            db.commit()
            return {"status": "success", "order": {
                "id": order.id,
                "order_number": order.order_number,
                "status": order.status,
                "total_amount": order.total_amount
            }}
        else:
            return {"status": "error", "message": "Payment not complete"}
            
    except Exception as e:
        return {"status": "error", "message": str(e)}



