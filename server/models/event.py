from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, Dict


class Event(BaseModel):
    product_id: int
    event_time: datetime = Field(default_factory=datetime.utcnow)
    metadata: Optional[Dict] = None