from backend.database import SessionLocal, engine, Base
from backend import models
import bcrypt

def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    if not db.query(models.User).filter_by(email="admin@ncc.co.za").first():
        admin = models.User(
            name="Admin",
            email="admin@ncc.co.za",
            role="admin",
            password_hash=bcrypt.hashpw("admin123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        )
        db.add(admin)
        db.commit()

    if db.query(models.Product).count() == 0:
        default_products = [
            {
                "name": "Classic Concrete Roof Tile",
                "description": "Durable concrete roof tiles with excellent weather resistance.",
                "price": 15.99,
                "image": "/assets/hero-bg.webp",
                "category": "Roof Tiles"
            },
            {
                "name": "Terracotta Clay Tile",
                "description": "Traditional terracotta tiles that provide a timeless aesthetic.",
                "price": 22.50,
                "image": "/assets/about-us.webp",
                "category": "Roof Tiles"
            },
            {
                "name": "Porcelain Floor Tile",
                "description": "High-quality porcelain tiles for modern living spaces.",
                "price": 35.00,
                "image": "/assets/slide3.webp",
                "category": "Floor Tiles"
            }
        ]
        for p in default_products:
            prod = models.Product(**p)
            db.add(prod)
        db.commit()
    
    db.close()
    print("Database seeded!")

if __name__ == "__main__":
    seed()
