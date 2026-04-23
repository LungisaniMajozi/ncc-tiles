from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List
from .. import models, schemas, database
from .auth import get_current_admin

router = APIRouter(prefix="/api/products", tags=["products"])

@router.get("/", response_model=List[schemas.Product])
def get_products(db: Session = Depends(database.get_db)):
    products = db.query(models.Product).all()
    return products

@router.get("/{product_id}", response_model=schemas.Product)
def get_product(product_id: int, db: Session = Depends(database.get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.post("/", response_model=schemas.Product)
def create_product(product: schemas.ProductCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_admin)):
    new_product = models.Product(**product.model_dump())
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product

@router.put("/{product_id}", response_model=schemas.Product)
def update_product(product_id: int, product: schemas.ProductCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_admin)):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    for key, value in product.model_dump().items():
        setattr(db_product, key, value)
    db.commit()
    db.refresh(db_product)
    return db_product

@router.delete("/{product_id}")
def delete_product(product_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_admin)):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
        
    # Check if tied to active orders
    active_orders = db.query(models.Order).join(models.OrderItem).filter(
        models.OrderItem.product_id == product_id,
        models.Order.status.in_(["pending", "processing"])
    ).first()
    
    if active_orders:
        raise HTTPException(
            status_code=400, 
            detail="Cannot delete this product because it is legally bound to an active (Pending/Processing) customer order. Mark the order as Completed or Cancelled first, or toggle 'Out of Stock'."
        )
        
    try:
        db.delete(db_product)
        db.commit()
        return {"detail": "Product deleted"}
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Database constraints prevented deletion.")
