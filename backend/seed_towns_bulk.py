from database import SessionLocal
import models
from sqlalchemy.exc import IntegrityError

print("Starting bulk seed script...")

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

try:
    db = SessionLocal()
    print("Connected to database")
    
    # Prepare all locations
    locations = [models.DeliveryLocation(town=town, price=0.0) for town in gautengTowns]
    
    # Add all at once
    print(f"Adding {len(locations)} towns...")
    db.add_all(locations)
    
    print("Committing...")
    db.commit()
    print(f"✓ Successfully seeded {len(gautengTowns)} delivery locations.")
    
except IntegrityError as e:
    print(f"Some towns already exist, continuing...")
    db.rollback()
    # Add one by one, skipping duplicates
    count = 0
    for town in gautengTowns:
        try:
            loc = models.DeliveryLocation(town=town, price=0.0)
            db.add(loc)
            db.commit()
            count += 1
        except IntegrityError:
            db.rollback()
    print(f"✓ Added {count} new locations (some already existed)")
    
except Exception as e:
    print(f"✗ Error: {type(e).__name__}: {e}")
    db.rollback()
finally:
    db.close()
    print("Done.")
