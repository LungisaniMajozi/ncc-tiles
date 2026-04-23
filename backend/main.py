from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import models, schemas
from database import engine, Base, get_db
from routers import auth, products, orders, delivery
from dotenv import load_dotenv

load_dotenv()

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(products.router)
app.include_router(orders.router)
app.include_router(delivery.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to NCC Tiles API"}

@app.post("/api/subscribe", response_model=schemas.SubscriberResponse)
def subscribe(subscriber: schemas.SubscriberCreate, db: Session = Depends(get_db)):
    # Check if already subscribed
    existing = db.query(models.Subscriber).filter(models.Subscriber.email == subscriber.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email is already subscribed")
    
    new_sub = models.Subscriber(email=subscriber.email)
    db.add(new_sub)
    db.commit()
    db.refresh(new_sub)
    return new_sub
