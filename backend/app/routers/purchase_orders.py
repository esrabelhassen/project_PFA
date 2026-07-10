from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from app.database import get_db
from app.models.purchase_order import PurchaseOrder
from app.models.bom import BomItem
from app.models.product import Product
from app.schemas.purchase_order import PurchaseOrderOut, PurchaseOrderUpdateStatus
from typing import List

router = APIRouter(tags=["Purchase Orders"])

@router.get("/purchase-orders", response_model=List[PurchaseOrderOut])
def list_purchase_orders(db: Session = Depends(get_db)):
    return db.query(PurchaseOrder).all()

@router.post("/purchase-orders/generate/{product_id}", response_model=PurchaseOrderOut, status_code=201)
def generate_purchase_order(product_id: UUID, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Count BOM lines
    bom_lines = db.query(BomItem).filter(BomItem.parent_product_id == product_id).count()
    if bom_lines == 0:
        raise HTTPException(status_code=400, detail="Product has no BOM items to order")

    order = PurchaseOrder(
        product_id=product_id,
        status="draft",
        total_lines=bom_lines,
    )
    db.add(order)
    db.commit()
    db.refresh(order)
    return order

@router.put("/purchase-orders/{id}/status", response_model=PurchaseOrderOut)
def update_status(id: UUID, data: PurchaseOrderUpdateStatus, db: Session = Depends(get_db)):
    order = db.query(PurchaseOrder).filter(PurchaseOrder.id == id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Purchase order not found")
    allowed = ["draft", "sent", "received"]
    if data.status not in allowed:
        raise HTTPException(status_code=400, detail=f"Status must be one of {allowed}")
    order.status = data.status
    db.commit()
    db.refresh(order)
    return order