from pydantic import BaseModel
from typing import Optional
from uuid import UUID

class RoutingStepBase(BaseModel):
    step_order: int
    name: str
    machine: Optional[str] = None
    standard_time_minutes: Optional[int] = None

class RoutingStepCreate(RoutingStepBase):
    pass

class RoutingStepUpdate(RoutingStepBase):
    pass

class RoutingStepOut(RoutingStepBase):
    id: UUID
    product_id: UUID

    class Config:
        from_attributes = True