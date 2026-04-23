from sqlalchemy import text
from database import engine, SessionLocal
import models

gautengTowns = [
    "Alberton", "Arcadia", "Atteridgeville", "Auckland Park", "Benoni", "Berea", "Blairgowrie",
    "Boksburg", "Braamfontein", "Brakpan", "Bronkhorstspruit", "Brooklyn", "Bryanston",
    "Carletonville", "Centurion", "Clayville", "Clubview", "Constantia Park", "Coronationville",
    "Craighall", "Craighall Park", "Cullinan", "De Deur", "Doringkloof", "Edenvale",
    "Eldorado Park", "Eldoraigne", "Ennerdale", "Faerie Glen", "Ferndale", "Fordsburg",
    "Fourways", "Ga-Rankuwa", "Garsfontein", "Germiston", "Greenside", "Hammanskraal",
    "Hatfield", "Heidelberg", "Hillbrow", "Houghton", "Irene", "Johannesburg", "Joubert Park",
    "Kempton Park", "Killarney", "Krugersdorp", "Lenasia", "Lone Hill", "Lyttelton", "Lynnwood",
    "Mabopane", "Mamelodi", "Mayfair", "Menlyn", "Menlo Park", "Midrand", "Midvaal", "Melville",
    "Meyerton", "Moreleta Park", "Newclare", "Newlands", "Newtown", "Nigel", "Norwood",
    "Orange Farm", "Parkhurst", "Parktown", "Paulshof", "Pretoria", "Pretoria Central",
    "Pretoria East", "Pretoria North", "Pretoria West", "Proclamation Hill", "Randburg",
    "Randfontein", "Rivonia", "Riverlea", "Roodepoort", "Rosebank", "Sandton", "Silver Lakes",
    "Sophiatown", "Soshanguve", "Soweto", "Springs", "Sunnyside", "Temba", "The Reeds",
    "Vanderbijlpark", "Vereeniging", "Waterkloof", "Westbury", "Westcliff", "Westonaria",
    "Woodmead", "Yeoville", "Zwartkop"
]

def migrate():
    with engine.begin() as conn:
        try:
            conn.execute(text("ALTER TABLE orders ADD COLUMN delivery_fee FLOAT DEFAULT 0.0"))
            print("Successfully added delivery_fee to orders")
        except Exception as e:
            print(f"Skipped altering orders table: {e}")
            
    db = SessionLocal()
    try:
        count = 0
        for town in gautengTowns:
            existing = db.query(models.DeliveryLocation).filter(models.DeliveryLocation.town == town).first()
            if not existing:
                loc = models.DeliveryLocation(town=town, price=0.0)
                db.add(loc)
                count += 1
        db.commit()
        print(f"Successfully seeded {count} new delivery locations.")
    finally:
        db.close()

if __name__ == "__main__":
    migrate()
