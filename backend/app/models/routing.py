import uuid
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base

class RoutingStep(Base):
    __tablename__ = "routing_steps"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    step_order = Column(Integer, nullable=False)
    name = Column(String, nullable=False)
    machine = Column(String)
    standard_time_minutes = Column(Integer)