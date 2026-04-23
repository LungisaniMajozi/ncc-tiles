import sys
import os

# Ensure backend directory is in path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal, engine
from models import User
from routers.auth import get_password_hash
import database

def seed_admins():
    db = SessionLocal()
    try:
        admins = [
            {"name": "Admin One", "email": "admin1@ncctiles.co.za", "password": "Admin@123"},
            {"name": "Admin Two", "email": "admin2@ncctiles.co.za", "password": "Admin@123"},
            {"name": "Admin Three", "email": "admin3@ncctiles.co.za", "password": "Admin@123"}
        ]

        print("Seeding admin users to the live database...")
        for admin_data in admins:
            # Check if admin already exists
            existing_user = db.query(User).filter(User.email == admin_data["email"]).first()
            if existing_user:
                print(f"User {admin_data['email']} already exists. Updating password and role to ensure admin access...")
                existing_user.password_hash = get_password_hash(admin_data["password"])
                existing_user.role = "admin"
            else:
                new_admin = User(
                    name=admin_data["name"],
                    email=admin_data["email"],
                    password_hash=get_password_hash(admin_data["password"]),
                    role="admin"
                )
                db.add(new_admin)
                print(f"Created new admin: {admin_data['email']}")
        
        db.commit()
        print("Successfully seeded all admin users!")
        
    except Exception as e:
        print(f"An error occurred: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_admins()
