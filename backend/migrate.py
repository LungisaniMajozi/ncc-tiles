from sqlalchemy import text
from database import engine

columns = [
    "ALTER TABLE products ADD COLUMN code VARCHAR",
    "ALTER TABLE products ADD COLUMN inStock BOOLEAN DEFAULT TRUE",
    "ALTER TABLE products ADD COLUMN slipResistant BOOLEAN DEFAULT FALSE",
    "ALTER TABLE products ADD COLUMN colors JSON",
    "ALTER TABLE products ADD COLUMN sizes JSON"
]

with engine.begin() as conn:
    for col in columns:
        try:
            conn.execute(text(col))
            print("Successfully executed:", col)
        except Exception as e:
            print(f"Skipped {col}: {e}")
