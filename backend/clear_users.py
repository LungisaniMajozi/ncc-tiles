import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from backend.database import SessionLocal
from backend.models import User, Order

def clear_users():
    db = SessionLocal()
    try:
        # Check if there are orders referencing users. If so we might need to clear them or set user_id to None
        db.query(Order).update({Order.user_id: None})
        num_deleted = db.query(User).delete()
        db.commit()
        print(f"Successfully deleted {num_deleted} users.")
    except Exception as e:
        db.rollback()
        print(f"Failed to delete users: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    clear_users()
