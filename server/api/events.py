from fastapi import APIRouter
from models.event import Event
from utils.event_utils import record_event

router = APIRouter(
    prefix="/api/events",
    tags=["Events"]
)



@router.get("/{product_id}/view")
def view_product(product_id: int):
 record_event(
product_id,
        "view"
    )

@router.get("/{product_id}/favorite")
def favorite_product(
    product_id: int
):
    return record_event(
        product_id,
        "favorite"
    )

@router.get("/{product_id}/buy")
def buy_product(
    product_id: int
):
    return record_event(
        product_id,
        "buy"
    )

