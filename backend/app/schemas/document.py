from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime

class DocumentOut(BaseModel):
    id: UUID
    product_id: UUID
    filename: str
    file_type: str
    file_url: str
    version: int
    uploaded_at: datetime

    class Config:
        from_attributes = True