from backend.database import Base, engine
from backend import models

def reset_database():
    print("Dropping all tables...")
    Base.metadata.drop_all(bind=engine)
    print("Recreating all tables...")
    Base.metadata.create_all(bind=engine)
    print("Done! Database is empty and fresh.")

if __name__ == "__main__":
    reset_database()
