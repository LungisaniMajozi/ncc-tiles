from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    role = Column(String, default="customer")
    reset_token = Column(String, nullable=True)
    orders = relationship("Order", back_populates="user")

from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean, JSON

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    price = Column(Float)
    image = Column(String)
    category = Column(String)
    code = Column(String, nullable=True)
    inStock = Column("instock", Boolean, default=True)
    slipResistant = Column("slipresistant", Boolean, default=False)
    colors = Column(JSON, nullable=True)
    sizes = Column(JSON, nullable=True)

class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    total_amount = Column(Float)
    status = Column(String, default="Pending")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    orderNumber = Column("ordernumber", String, nullable=True)
    customerName = Column("customername", String, nullable=True)
    phone = Column(String, nullable=True)
    email = Column(String, nullable=True)
    address = Column(String, nullable=True)
    city = Column(String, nullable=True)
    postalCode = Column("postalcode", String, nullable=True)
    deliveryNote = Column("deliverynote", String, nullable=True)
    paymentMethod = Column("paymentmethod", String, nullable=True)
    pdfBase64 = Column("pdfbase64", String, nullable=True)
    emailSent = Column("emailsent", Boolean, default=False)
    delivery_fee = Column(Float, default=0.0)
    
    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order")

class OrderItem(Base):
    __tablename__ = "order_items"
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    product_id = Column(Integer, ForeignKey("products.id", ondelete="SET NULL"), nullable=True)
    quantity = Column(Integer)
    price = Column(Float)
    
    order = relationship("Order", back_populates="items")
    product = relationship("Product")

class Subscriber(Base):
    __tablename__ = "subscribers"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class DeliveryLocation(Base):
    __tablename__ = "delivery_locations"
    id = Column(Integer, primary_key=True, index=True)
    town = Column(String, unique=True, index=True)
    price = Column(Float, default=0.0)
