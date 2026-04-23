from database import SessionLocal, engine
import models
import sys

print("Starting seed script...")
print(f"Python executable: {sys.executable}")

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

def seed():
    print("Attempting to connect to database...")
    try:
        db = SessionLocal()
        print("Connected to database successfully")
        
        count = 0
        print(f"Starting to add {len(gautengTowns)} towns...")
        for i, town in enumerate(gautengTowns):
            if i % 10 == 0:
                print(f"  Processing town {i+1}/{len(gautengTowns)}: {town}")
            existing = db.query(models.DeliveryLocation).filter(models.DeliveryLocation.town == town).first()
            if not existing:
                loc = models.DeliveryLocation(town=town, price=0.0)
                db.add(loc)
                count += 1
        
        print(f"Committing {count} new locations...")
        db.commit()
        print(f"✓ Successfully seeded {count} new delivery locations.")
    except Exception as e:
        print(f"✗ Error: {type(e).__name__}: {e}")
        try:
            db.rollback()
        except:
            pass
    finally:
        try:
            db.close()
        except:
            pass
        print("Script completed.")

if __name__ == "__main__":
    seed()
