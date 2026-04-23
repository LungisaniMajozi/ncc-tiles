from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
import models, schemas, database
from .auth import get_current_admin

router = APIRouter(prefix="/api/delivery", tags=["delivery"])

@router.get("/", response_model=List[schemas.DeliveryLocationResponse])
def get_locations(db: Session = Depends(database.get_db)):
    return db.query(models.DeliveryLocation).order_by(models.DeliveryLocation.town.asc()).all()

@router.post("/", response_model=schemas.DeliveryLocationResponse)
def add_location(location: schemas.DeliveryLocationCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_admin)):
    existing = db.query(models.DeliveryLocation).filter(models.DeliveryLocation.town == location.town).first()
    if existing:
        raise HTTPException(status_code=400, detail="Town already exists")
    new_loc = models.DeliveryLocation(**location.model_dump())
    db.add(new_loc)
    db.commit()
    db.refresh(new_loc)
    return new_loc

@router.put("/{location_id}", response_model=schemas.DeliveryLocationResponse)
def update_location(location_id: int, location: schemas.DeliveryLocationCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_admin)):
    db_loc = db.query(models.DeliveryLocation).filter(models.DeliveryLocation.id == location_id).first()
    if not db_loc:
        raise HTTPException(status_code=404, detail="Location not found")
    
    # Check if another location has the same name
    if location.town != db_loc.town:
        existing = db.query(models.DeliveryLocation).filter(models.DeliveryLocation.town == location.town).first()
        if existing:
            raise HTTPException(status_code=400, detail="Town already exists")
            
    db_loc.town = location.town
    db_loc.price = location.price
    db.commit()
    db.refresh(db_loc)
    return db_loc

@router.delete("/{location_id}")
def delete_location(location_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_admin)):
    db_loc = db.query(models.DeliveryLocation).filter(models.DeliveryLocation.id == location_id).first()
    if not db_loc:
        raise HTTPException(status_code=404, detail="Location not found")
    db.delete(db_loc)
    db.commit()
    return {"message": "Location deleted successfully"}
