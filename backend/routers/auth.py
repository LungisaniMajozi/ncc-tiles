from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
import models, schemas, database
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from fastapi.security import OAuth2PasswordBearer
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

router = APIRouter(prefix="/api/auth", tags=["auth"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = "supersecretkey_change_in_production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 # 1 day

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

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

import uuid

def send_reset_email(to_email: str, token: str):
    smtp_server = "smtp.gmail.com"
    smtp_port = 587
    sender_email = os.getenv("SMTP_EMAIL", "your_email@gmail.com")
    sender_password = os.getenv("SMTP_PASSWORD", "your_app_password_here")
    
    msg = MIMEMultipart("alternative")
    msg["Subject"] = "NCC Tiles - Password Reset Token"
    msg["From"] = sender_email
    msg["To"] = to_email
    
    html_content = f"""
    <html>
      <body style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #1a56db;">NCC Tiles</h2>
        <p>You requested a password reset. Please copy the token below and enter it on the website:</p>
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; font-family: monospace; font-size: 16px; font-weight: bold; margin: 20px 0; color: #1f2937;">
            {token}
        </div>
        <p>If you did not request this, please ignore this email.</p>
      </body>
    </html>
    """
    msg.attach(MIMEText(html_content, "html"))
    
    try:
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, to_email, msg.as_string())
        server.quit()
        print(f"Sent password reset email to {to_email}")
    except Exception as e:
        print(f"[SMTP Warning] Could not send email due to invalid credentials. Token: {token}. Error: {e}")

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
