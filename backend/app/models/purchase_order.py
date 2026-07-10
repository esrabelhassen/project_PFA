import uuid
from sqlalchemy import Column, Integer, ForeignKey, DateTime, Enum
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
from app.database import Base

class PurchaseOrder(Base):
    __tablename__ = "purchase_orders"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    status = Column(Enum("draft", "sent", "received", name="purchase_order_status"), default="draft")
    total_lines = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)