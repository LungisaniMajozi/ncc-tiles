from sqlalchemy import text
from database import engine

def clean_database():
    with engine.connect() as conn:
        try:
            # 1. Clear tables safely
            conn.execute(text("TRUNCATE TABLE order_items RESTART IDENTITY CASCADE"))
            conn.execute(text("TRUNCATE TABLE orders RESTART IDENTITY CASCADE"))
            conn.execute(text("TRUNCATE TABLE products RESTART IDENTITY CASCADE"))
            
            # Delete non-admin users
            conn.execute(text("DELETE FROM users WHERE role != 'admin'"))
            
            # 2. Fix the constraint for OrderItem product_id
            conn.execute(text("ALTER TABLE order_items DROP CONSTRAINT IF EXISTS order_items_product_id_fkey"))
            conn.execute(text("ALTER TABLE order_items ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE SET NULL"))
            
            conn.commit()
            print("Successfully cleaned Database and updated Foreign Keys!")
        except Exception as e:
            print(f"Error during cleanup: {e}")

if __name__ == "__main__":
    clean_database()
