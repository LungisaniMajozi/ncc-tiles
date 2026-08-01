from backend.database import SessionLocal, engine
from backend import models
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
        updated = 0
        print(f"Starting to process {len(gautengTowns)} towns with tiered pricing...")
        for i, town in enumerate(gautengTowns):
            # Realistic Tiered Pricing Logic from HQ in Clayville
            if town == "Clayville": 
                price = 150.0
            elif town in ["Midrand", "Irene", "Kempton Park"]: 
                price = 250.0
            elif town in ["Centurion", "Edenvale", "Boksburg", "Benoni", "Pretoria", "Pretoria East", "Pretoria Central", "Mamelodi", "Waterkloof", "Menlyn", "Menlo Park", "Lynnwood", "Brooklyn", "Hatfield", "Sunnyside", "Arcadia", "Faerie Glen", "Garsfontein", "Moreleta Park"]: 
                price = 450.0
            elif town in ["Johannesburg", "Sandton", "Rosebank", "Randburg", "Fourways", "Bryanston", "Springs", "Brakpan", "Germiston", "Alberton", "Woodmead", "Rivonia", "Lone Hill", "Paulshof", "Ferndale", "Blairgowrie", "Craighall", "Craighall Park", "Parkhurst", "Parktown", "Houghton", "Killarney", "Norwood", "Auckland Park", "Melville", "Braamfontein", "Hillbrow", "Berea", "Yeoville", "Joubert Park", "Newtown", "Fordsburg", "Mayfair"]: 
                price = 650.0
            elif town in ["Soweto", "Roodepoort", "Krugersdorp", "Randfontein", "Meyerton", "Vanderbijlpark", "Vereeniging", "Nigel", "Bronkhorstspruit", "Heidelberg", "Midvaal", "Carletonville", "Westonaria", "De Deur", "Ennerdale", "Orange Farm", "Eldorado Park", "Lenasia"]: 
                price = 950.0
            else: 
                price = 550.0
                
            existing = db.query(models.DeliveryLocation).filter(models.DeliveryLocation.town == town).first()
            if not existing:
                loc = models.DeliveryLocation(town=town, price=price)
                db.add(loc)
                count += 1
            else:
                existing.price = price
                updated += 1
        
        print(f"Committing {count} new locations and {updated} updated locations...")
        db.commit()
        print(f"Successfully processed pricing for delivery locations.")
    except Exception as e:
        print(f"Error: {type(e).__name__}: {e}")
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
