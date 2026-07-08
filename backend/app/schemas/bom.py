from pydantic import BaseModel
from typing import Optional
from uuid import UUID

class BomItemBase(BaseModel):
    child_product_id: UUID
    quantity: float
    unit: str

class BomItemCreate(BomItemBase):
    pass

class BomItemUpdate(BaseModel):
    quantity: float
    unit: str

class BomItemOut(BomItemBase):
    id: UUID
    parent_product_id: UUID

    class Config:
        from_attributes = True