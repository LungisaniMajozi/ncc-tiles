import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

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

    # Clear old dummy products
    db.query(models.Product).delete()
    db.commit()

    real_products = [
        # ROOF TILES
        {"name": "Double Roman Concrete Roof Tile - Slate Grey", "description": "Classic profiled concrete roof tile providing a timeless aesthetic and excellent weather resistance. Coverage: 10.5 tiles per sq/m.", "price": 12.50, "image": "https://images.unsplash.com/photo-1585253818318-6bb6c12ec585?w=500&q=80", "category": "Roof Tiles"},
        {"name": "Double Roman Concrete Roof Tile - Terracotta", "description": "Traditional terracotta colored concrete roof tile. High durability and fade resistant.", "price": 12.50, "image": "https://images.unsplash.com/photo-1585253818318-6bb6c12ec585?w=500&q=80", "category": "Roof Tiles"},
        {"name": "Double Roman Concrete Roof Tile - Farmhouse Brown", "description": "Blended brown tones for a rustic farmhouse look.", "price": 14.50, "image": "https://images.unsplash.com/photo-1585253818318-6bb6c12ec585?w=500&q=80", "category": "Roof Tiles"},
        {"name": "Renown Profile Roof Tile - Antique Red", "description": "Neat, low-profile concrete tile suited for contemporary architecture.", "price": 13.99, "image": "https://images.unsplash.com/photo-1585253818318-6bb6c12ec585?w=500&q=80", "category": "Roof Tiles"},
        {"name": "Renown Profile Roof Tile - Charcoal", "description": "Modern charcoal low-profile root tile. 10.5 tiles per sq/m.", "price": 13.99, "image": "https://images.unsplash.com/photo-1585253818318-6bb6c12ec585?w=500&q=80", "category": "Roof Tiles"},
        {"name": "Tudor Concrete Roof Tile - Black", "description": "Slate-like appearance without the high cost of natural slate.", "price": 16.50, "image": "https://images.unsplash.com/photo-1585253818318-6bb6c12ec585?w=500&q=80", "category": "Roof Tiles"},
        {"name": "Tudor Concrete Roof Tile - Greyish Blue", "description": "Elegant premium look for modern upscale homes.", "price": 16.50, "image": "https://images.unsplash.com/photo-1585253818318-6bb6c12ec585?w=500&q=80", "category": "Roof Tiles"},
        {"name": "Clay Roof Tile - Natural Red", "description": "Imported genuine baked clay roof tiles. Exceptional longevity.", "price": 24.00, "image": "https://images.unsplash.com/photo-1585253818318-6bb6c12ec585?w=500&q=80", "category": "Roof Tiles"},
        {"name": "Interlocking Clay Tile - Slate", "description": "Engineered clay tiles that interlock for perfect weather sealing.", "price": 28.50, "image": "https://images.unsplash.com/photo-1585253818318-6bb6c12ec585?w=500&q=80", "category": "Roof Tiles"},
        {"name": "Galvanized Roof Ridging 2m", "description": "Metal ridges for securing roof apexes.", "price": 85.00, "image": "https://images.unsplash.com/photo-1585253818318-6bb6c12ec585?w=500&q=80", "category": "Roof Tiles"},
        
        # FLOOR TILES (PORCELAIN)
        {"name": "Calacatta White Gloss Porcelain Tile 600x600", "description": "Stunning glossy marble-look porcelain tile. Perfect for living areas. 1.44 sq/m per box.", "price": 249.90, "image": "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=500&q=80", "category": "Floor Tiles"},
        {"name": "Carrara Premium Matt Porcelain 600x600", "description": "Subtle grey veins on a soft white matt finish. Ideal for modern bathrooms.", "price": 269.00, "image": "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=500&q=80", "category": "Floor Tiles"},
        {"name": "Cement Screed Look Porcelain 800x800", "description": "Large format industrial concrete-look tiles. Highly durable.", "price": 315.50, "image": "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=500&q=80", "category": "Floor Tiles"},
        {"name": "Dark Charcoal Matt Porcelain 600x600", "description": "Bold, dark, and sophisticated. Excellent slip resistance.", "price": 225.00, "image": "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=500&q=80", "category": "Floor Tiles"},
        {"name": "Travertine Beige Gloss Porcelain 600x600", "description": "Warm beige tones mimicking natural travertine stone.", "price": 195.00, "image": "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=500&q=80", "category": "Floor Tiles"},
        {"name": "Wood-Look Porcelain Plank 200x1200 - Oak", "description": "The warmth of wood with the durability of porcelain. Highly realistic grain.", "price": 289.00, "image": "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=500&q=80", "category": "Floor Tiles"},
        {"name": "Wood-Look Porcelain Plank 200x1200 - Ash Grey", "description": "Modern grey stained wood aesthetic. Perfect for contemporary spaces.", "price": 289.00, "image": "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=500&q=80", "category": "Floor Tiles"},
        {"name": "Terrazzo Style Porcelain 600x600", "description": "Playful speckled terrazzo pattern. High traffic commercial grade.", "price": 340.00, "image": "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=500&q=80", "category": "Floor Tiles"},
        {"name": "Onyx Polished Porcelain Gold 800x800", "description": "Ultra-glossy luxury finish with dramatic golden veins.", "price": 410.00, "image": "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=500&q=80", "category": "Floor Tiles"},
        {"name": "Sandstone Outdoor Anti-Slip Porcelain 600x600", "description": "Textured surface for outdoor patios and pool surrounds.", "price": 275.00, "image": "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=500&q=80", "category": "Floor Tiles"},

        # FLOOR TILES (CERAMIC)
        {"name": "Basic White Matt Ceramic Floor Tile 400x400", "description": "Economical standard white floor tile.", "price": 99.00, "image": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&q=80", "category": "Floor Tiles"},
        {"name": "Ivory Textured Ceramic Floor Tile 500x500", "description": "Subtle texture providing grip for hallways and kitchens.", "price": 139.90, "image": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&q=80", "category": "Floor Tiles"},
        {"name": "Slate-Look Ceramic Floor Tile 430x430", "description": "Rustic slate appearance without maintenance.", "price": 149.00, "image": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&q=80", "category": "Floor Tiles"},
        {"name": "Terracotta Look Ceramic 400x400", "description": "Warm, sunny Mediterranean feel for patios and sunrooms.", "price": 120.00, "image": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&q=80", "category": "Floor Tiles"},

        # WALL TILES & MOSAICS
        {"name": "Subway Gloss White Wall Tile 100x200", "description": "Classic beveled white subway tile for kitchens and bathrooms.", "price": 189.00, "image": "https://images.unsplash.com/photo-1501683416434-7ad92b23617b?w=500&q=80", "category": "Wall Tiles"},
        {"name": "Subway Gloss Black Wall Tile 100x200", "description": "Bold black subway tile for striking contrast feature walls.", "price": 199.00, "image": "https://images.unsplash.com/photo-1501683416434-7ad92b23617b?w=500&q=80", "category": "Wall Tiles"},
        {"name": "Hexagon Matt Grey Mosaic Sheet 300x300", "description": "Modern hexagon mosaic on mesh backing for easy installation.", "price": 145.00, "image": "https://images.unsplash.com/photo-1501683416434-7ad92b23617b?w=500&q=80", "category": "Wall Tiles"},
        {"name": "Carrara Hexagon Marble Mosaic Sheet", "description": "Real marble mosaic pieces for luxury shower floors.", "price": 285.00, "image": "https://images.unsplash.com/photo-1501683416434-7ad92b23617b?w=500&q=80", "category": "Wall Tiles"},
        {"name": "Glass Blend Blue Pool Mosaic Sheet", "description": "Iridescent glass mosaic pieces ideal for pools and water features.", "price": 95.00, "image": "https://images.unsplash.com/photo-1501683416434-7ad92b23617b?w=500&q=80", "category": "Wall Tiles"},
        {"name": "Decorative Floral Ceramic Wall Tile 200x200", "description": "Intricate traditional floral patterns for splashbacks.", "price": 220.00, "image": "https://images.unsplash.com/photo-1501683416434-7ad92b23617b?w=500&q=80", "category": "Wall Tiles"},

        # ADHESIVES, GROUT & ACCESSORIES
        {"name": "NCC Standard Tile Adhesive 20kg", "description": "High quality cement-based adhesive for ceramic floor and wall tiles.", "price": 65.00, "image": "https://images.unsplash.com/photo-1585223385750-f8f260173e35?w=500&q=80", "category": "Accessories"},
        {"name": "NCC Porcelain Premium Adhesive 20kg", "description": "Polymer modified adhesive specifically for low-porosity porcelain tiles.", "price": 115.00, "image": "https://images.unsplash.com/photo-1585223385750-f8f260173e35?w=500&q=80", "category": "Accessories"},
        {"name": "NCC Flex Bond Flexible Adhesive 20kg", "description": "Highly flexible adhesive for areas with movement or underfloor heating.", "price": 185.00, "image": "https://images.unsplash.com/photo-1585223385750-f8f260173e35?w=500&q=80", "category": "Accessories"},
        {"name": "Wall Tile Grip Paste Ready-Mix 5kg", "description": "Ready-mixed bucket adhesive for quick wall tile repairs.", "price": 95.00, "image": "https://images.unsplash.com/photo-1585223385750-f8f260173e35?w=500&q=80", "category": "Accessories"},
        {"name": "Light Grey Waterproof Grout 5kg", "description": "Anti-fungal, water-resistant grout suitable for showers and patios.", "price": 85.00, "image": "https://images.unsplash.com/photo-1585223385750-f8f260173e35?w=500&q=80", "category": "Accessories"},
        {"name": "Charcoal Black Waterproof Grout 5kg", "description": "Dark grout to seamlessly blend with dark tiles and hide dirt.", "price": 85.00, "image": "https://images.unsplash.com/photo-1585223385750-f8f260173e35?w=500&q=80", "category": "Accessories"},
        {"name": "Pure White Antimicrobial Grout 5kg", "description": "Dazzling white grout formulated to resist mould.", "price": 90.00, "image": "https://images.unsplash.com/photo-1585223385750-f8f260173e35?w=500&q=80", "category": "Accessories"},
        {"name": "Tile Spacers 2mm (Pack of 500)", "description": "Ensures perfectly even 2mm grout lines.", "price": 35.00, "image": "https://images.unsplash.com/photo-1585223385750-f8f260173e35?w=500&q=80", "category": "Accessories"},
        {"name": "Tile Spacers 5mm (Pack of 250)", "description": "Standard 5mm spacers for outdoor and rustic tiles.", "price": 35.00, "image": "https://images.unsplash.com/photo-1585223385750-f8f260173e35?w=500&q=80", "category": "Accessories"},
        {"name": "Notched Trowel 10mm", "description": "Professional grade steel trowel with 10mm square notches.", "price": 145.00, "image": "https://images.unsplash.com/photo-1585223385750-f8f260173e35?w=500&q=80", "category": "Accessories"},
    ]

    for p in real_products:
        prod = models.Product(**p)
        db.add(prod)
    
    db.commit()
    db.close()
    print("Database incredibly seeded with 40 realistic products!")

if __name__ == "__main__":
    seed()
