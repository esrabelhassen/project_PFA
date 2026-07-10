from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime

class PurchaseOrderOut(BaseModel):
    id: UUID
    product_id: UUID
    status: str
    total_lines: int
    created_at: datetime

    class Config:
        from_attributes = True

class PurchaseOrderUpdateStatus(BaseModel):
    status: str