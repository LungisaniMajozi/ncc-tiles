from sqlalchemy import text
from database import engine

def migrate():
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE orders ADD COLUMN ordernumber VARCHAR"))
            conn.execute(text("ALTER TABLE orders ADD COLUMN customername VARCHAR"))
            conn.execute(text("ALTER TABLE orders ADD COLUMN phone VARCHAR"))
            conn.execute(text("ALTER TABLE orders ADD COLUMN email VARCHAR"))
            conn.execute(text("ALTER TABLE orders ADD COLUMN address VARCHAR"))
            conn.execute(text("ALTER TABLE orders ADD COLUMN city VARCHAR"))
            conn.execute(text("ALTER TABLE orders ADD COLUMN postalcode VARCHAR"))
            conn.execute(text("ALTER TABLE orders ADD COLUMN deliverynote VARCHAR"))
            conn.execute(text("ALTER TABLE orders ADD COLUMN paymentmethod VARCHAR"))
            conn.execute(text("ALTER TABLE orders ADD COLUMN pdfbase64 TEXT"))
            conn.execute(text("ALTER TABLE orders ADD COLUMN emailsent BOOLEAN DEFAULT FALSE"))
            conn.commit()
            print("Successfully migrated orders table!")
        except Exception as e:
            print(f"Error during migration: {e}")

if __name__ == "__main__":
    migrate()
