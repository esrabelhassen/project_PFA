from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from app.database import get_db
from app.models.bom import BomItem
from app.models.product import Product
from app.schemas.bom import BomItemCreate, BomItemUpdate, BomItemOut
from typing import List

router = APIRouter(tags=["BOM"])

@router.get("/products/{id}/bom", response_model=List[BomItemOut])
def get_bom(id: UUID, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return db.query(BomItem).filter(BomItem.parent_product_id == id).all()

@router.post("/products/{id}/bom", response_model=BomItemOut, status_code=201)
def add_bom_item(id: UUID, data: BomItemCreate, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    item = BomItem(parent_product_id=id, **data.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@router.put("/bom-items/{id}", response_model=BomItemOut)
def update_bom_item(id: UUID, data: BomItemUpdate, db: Session = Depends(get_db)):
    item = db.query(BomItem).filter(BomItem.id == id).first()
    if not item:
        raise HTTPException(status_code=404, detail="BOM item not found")
    for key, value in data.model_dump().items():
        setattr(item, key, value)
    db.commit()
    db.refresh(item)
    return item

@router.delete("/bom-items/{id}", status_code=204)
def delete_bom_item(id: UUID, db: Session = Depends(get_db)):
    item = db.query(BomItem).filter(BomItem.id == id).first()
    if not item:
        raise HTTPException(status_code=404, detail="BOM item not found")
    db.delete(item)
    db.commit()