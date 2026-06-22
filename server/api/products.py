from fastapi import APIRouter, HTTPException

from db.mongodb import products_collection

router = APIRouter(
    prefix="/api/products",
    tags=["Products"]
)


@router.get("")
def get_products(
    page: int = 1,
    pageSize: int = 10,
    brand: str | None = None,
    category: str | None = None,
    minPrice: float | None = None,
maxPrice: float | None = None,
):
    query = {}

    if brand:
        query["brand"] = brand

    if category:
        query["category"] = category

    if minPrice is not None or maxPrice is not None:
        query["price"] = {}

        if minPrice is not None:
            query["price"]["$gte"] = minPrice

        if maxPrice is not None:
            query["price"]["$lte"] = maxPrice
            
    skip = (page - 1) * pageSize

    products = list(
        products_collection.find(
            query,
            {"_id": 0}
        )
        .skip(skip)
        .limit(pageSize)
    )

    total = products_collection.count_documents(query)

    return {
        "items": products,
        "total": total
    }

@router.get("/filter-options")
def get_filter_options():

    brands = products_collection.distinct("brand")

    categories = products_collection.distinct("category")

    return {
        "brands": sorted(brands),
        "categories": sorted(categories)
    }

@router.get("/{product_id}")
def get_product(product_id: int):

    product = products_collection.find_one(
        {"id": product_id},
        {"_id": 0}
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    return product