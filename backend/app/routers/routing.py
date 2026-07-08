from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from app.database import get_db
from app.models.routing import RoutingStep
from app.models.product import Product
from app.schemas.routing import RoutingStepCreate, RoutingStepUpdate, RoutingStepOut
from typing import List

router = APIRouter(tags=["Routing"])

@router.get("/products/{id}/routing", response_model=List[RoutingStepOut])
def get_routing(id: UUID, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return db.query(RoutingStep).filter(RoutingStep.product_id == id).order_by(RoutingStep.step_order).all()

@router.post("/products/{id}/routing", response_model=RoutingStepOut, status_code=201)
def add_routing_step(id: UUID, data: RoutingStepCreate, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    step = RoutingStep(product_id=id, **data.model_dump())
    db.add(step)
    db.commit()
    db.refresh(step)
    return step

@router.put("/routing-steps/{id}", response_model=RoutingStepOut)
def update_routing_step(id: UUID, data: RoutingStepUpdate, db: Session = Depends(get_db)):
    step = db.query(RoutingStep).filter(RoutingStep.id == id).first()
    if not step:
        raise HTTPException(status_code=404, detail="Routing step not found")
    for key, value in data.model_dump().items():
        setattr(step, key, value)
    db.commit()
    db.refresh(step)
    return step

@router.delete("/routing-steps/{id}", status_code=204)
def delete_routing_step(id: UUID, db: Session = Depends(get_db)):
    step = db.query(RoutingStep).filter(RoutingStep.id == id).first()
    if not step:
        raise HTTPException(status_code=404, detail="Routing step not found")
    db.delete(step)
    db.commit()