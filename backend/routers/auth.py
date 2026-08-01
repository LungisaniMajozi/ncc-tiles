from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from .. import models, schemas, database
import bcrypt
from jose import JWTError, jwt
from datetime import datetime, timedelta
from fastapi.security import OAuth2PasswordBearer
import os
import requests

router = APIRouter(prefix="/api/auth", tags=["auth"])

SECRET_KEY = "supersecretkey_change_in_production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 # 1 day

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        if isinstance(hashed_password, str):
            hashed_password = hashed_password.encode('utf-8')
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password)
    except Exception:
        return False

def get_password_hash(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(database.get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        print(f"[AUTH] Attempting to decode token: {token[:20]}...")
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print(f"[AUTH] Token decoded successfully. Payload: {payload}")
        email: str = payload.get("sub")
        print(f"[AUTH] Extracted email from token: {email}")
        if email is None:
            print(f"[AUTH] No email in token payload")
            raise credentials_exception
    except JWTError as e:
        print(f"[AUTH] JWTError: {e}")
        raise credentials_exception
    except Exception as e:
        print(f"[AUTH] Unexpected error during decode: {e}")
        raise credentials_exception
    
    user = db.query(models.User).filter(models.User.email == email).first()
    print(f"[AUTH] User lookup result: {user.email if user else 'NOT FOUND'}")
    if user is None:
        raise credentials_exception
    return user

def get_current_admin(current_user: models.User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user doesn't have enough privileges"
        )
    return current_user

@router.post("/register", response_model=schemas.UserResponse)
def register(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    email = user.email.strip().lower()
    db_user = db.query(models.User).filter(models.User.email == email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    # Force role to customer for public registration
    new_user = models.User(name=user.name, email=email, password_hash=hashed_password, role="customer")
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/admin", response_model=schemas.UserResponse)
def create_admin(user: schemas.UserCreate, db: Session = Depends(database.get_db), current_admin: models.User = Depends(get_current_admin)):
    email = user.email.strip().lower()
    db_user = db.query(models.User).filter(models.User.email == email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    new_user = models.User(name=user.name, email=email, password_hash=hashed_password, role="admin")
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(database.get_db)):
    email = user.email.strip().lower()
    print(f"[LOGIN] Attempting login for: {email}")
    db_user = db.query(models.User).filter(models.User.email == email).first()
    if not db_user or not verify_password(user.password, db_user.password_hash):
        print(f"[LOGIN] Login failed for {email}")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    
    print(f"[LOGIN] Login successful for {email}, role: {db_user.role}")
    access_token = create_access_token(data={"sub": db_user.email, "role": db_user.role, "id": db_user.id})
    print(f"[LOGIN] Token created: {access_token[:20]}...")
    return {
        "access_token": access_token, 
        "token_type": "bearer", 
        "user": {
            "id": db_user.id, 
            "name": db_user.name, 
            "email": db_user.email, 
            "role": db_user.role
        }
    }

@router.get("/me", response_model=schemas.UserResponse)
def get_user_me(current_user: models.User = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=schemas.UserResponse)
def update_user_me(user_update: schemas.UserUpdate, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    if user_update.name:
        current_user.name = user_update.name
    if user_update.email:
        # Check if email is taken
        existing = db.query(models.User).filter(models.User.email == user_update.email).first()
        if existing and existing.id != current_user.id:
            raise HTTPException(status_code=400, detail="Email already in use")
        current_user.email = user_update.email
    db.commit()
    db.refresh(current_user)
    return current_user

@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
def delete_user_me(db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    # Check constraints: user can only be deleted if all their orders are completed or cancelled
    orders = db.query(models.Order).filter(models.Order.user_id == current_user.id).all()
    for order in orders:
        if order.status.lower() not in ["completed", "cancelled"]:
            raise HTTPException(
                status_code=400, 
                detail="Cannot delete account with active or pending orders. Please wait for them to complete or cancel them."
            )
            
    # Safe to delete - unlink historical orders
    for order in orders:
        order.user_id = None
        
    db.delete(current_user)
    db.commit()
    return None

import uuid

def send_reset_email(to_email: str, token: str):
    service_id = os.getenv("VITE_EMAILJS_SERVICE_ID")
    template_id = "template_jn8ykx4"
    user_id = os.getenv("VITE_EMAILJS_PUBLIC_KEY")
    
    if not all([service_id, template_id, user_id]):
        print(f"[EmailJS] Missing credentials. Generated Token: {token}")
        return
        
    url = "https://api.emailjs.com/api/v1.0/email/send"
    payload = {
        "service_id": service_id,
        "template_id": template_id,
        "user_id": user_id,
        "template_params": {
            "to_email": to_email,
            "reset_token": token
        }
    }
    
    try:
        response = requests.post(url, json=payload, headers={"Content-Type": "application/json"})
        if response.status_code == 200:
            print(f"Sent password reset email to {to_email} via EmailJS")
        else:
            print(f"[EmailJS Error] Failed to send email. Code: {response.status_code}. Response: {response.text}. Token: {token}")
    except Exception as e:
        print(f"[EmailJS Exception] Could not send email. Error: {e}. Token: {token}")

@router.post("/forgot-password")
def forgot_password(request: schemas.PasswordResetRequest, background_tasks: BackgroundTasks, db: Session = Depends(database.get_db)):
    email = request.email.strip().lower()
    user = db.query(models.User).filter(models.User.email == email).first()
    if user:
        reset_token = str(uuid.uuid4())
        user.reset_token = reset_token
        db.commit()
        # Fire email off in the background so UI doesn't hang
        background_tasks.add_task(send_reset_email, user.email, reset_token)
        return {"message": "Reset link sent to your email."}
    raise HTTPException(status_code=404, detail="This email is not registered in our system.")

@router.post("/reset-password")
def reset_password(request: schemas.PasswordResetConfirm, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.reset_token == request.reset_token).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token.")
    
    user.password_hash = get_password_hash(request.new_password)
    user.reset_token = None
    db.commit()
    return {"message": "Password successfully reset."}
