from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, Dict


class Event(BaseModel):
    product_id: int
    event_type: str  # view, favorite, buy

    event_time: datetime = Field(default_factory=datetime.utcnow)

    user_id: Optional[str] = "guest"

    metadata: Optional[Dict] = None