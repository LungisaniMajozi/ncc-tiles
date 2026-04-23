from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ProductBase(BaseModel):
    name: str
    description: str
    price: float
    image: str
    category: str
    code: Optional[str] = ""
    inStock: bool = True
    slipResistant: bool = False
    colors: Optional[List[str]] = []
    sizes: Optional[List[str]] = []

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int
    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    role: str = "customer"

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None

class PasswordResetRequest(BaseModel):
    email: str

class PasswordResetConfirm(BaseModel):
    reset_token: str
    new_password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    class Config:
        from_attributes = True

class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int
    price: float

class OrderCreate(BaseModel):
    orderNumber: Optional[str] = None
    customerName: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    postalCode: Optional[str] = None
    deliveryNote: Optional[str] = None
    paymentMethod: Optional[str] = None
    pdfBase64: Optional[str] = None
    emailSent: Optional[bool] = False
    status: Optional[str] = "Pending"
    delivery_fee: Optional[float] = 0.0
    items: List[OrderItemCreate]

class OrderItemResponse(BaseModel):
    id: int
    product_id: Optional[int] = None
    quantity: int
    price: float
    product: Optional[Product] = None
    class Config:
        from_attributes = True

class OrderResponse(BaseModel):
    id: int
    user_id: int
    total_amount: float
    status: str
    created_at: datetime
    orderNumber: Optional[str] = None
    customerName: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    postalCode: Optional[str] = None
    deliveryNote: Optional[str] = None
    paymentMethod: Optional[str] = None
    pdfBase64: Optional[str] = None
    emailSent: Optional[bool] = False
    delivery_fee: Optional[float] = 0.0
    items: List[OrderItemResponse]
    class Config:
        from_attributes = True

class SubscriberCreate(BaseModel):
    email: str

class SubscriberResponse(BaseModel):
    id: int
    email: str
    created_at: datetime
    class Config:
        from_attributes = True

class DeliveryLocationBase(BaseModel):
    town: str
    price: float

class DeliveryLocationCreate(DeliveryLocationBase):
    pass

class DeliveryLocationResponse(DeliveryLocationBase):
    id: int
    class Config:
        from_attributes = True
