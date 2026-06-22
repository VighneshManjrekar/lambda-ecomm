from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class Product(BaseModel):
    id: int
    title: str
    brand: str
    category: str
    price: float
    description: str

    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = Field(default_factory=datetime.utcnow)