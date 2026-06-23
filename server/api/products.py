from fastapi import APIRouter, HTTPException

from db.mongodb import products_collection
from db.elasticsearch_client import es

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

    price_stats = list(products_collection.aggregate([
        {"$group": {"_id": None, "minPrice": {"$min": "$price"}, "maxPrice": {"$max": "$price"}}}
    ]))

    min_price = price_stats[0]["minPrice"] if price_stats else 0
    max_price = price_stats[0]["maxPrice"] if price_stats else 0

    return {
        "brands": sorted(brands),
        "categories": sorted(categories),
        "minPrice": min_price,
        "maxPrice": max_price
    }

@router.get("/search")
def search_products(
    q: str | None = None,
    minPrice: float | None = None,
    maxPrice: float | None = None,
    page: int = 1,
    pageSize: int = 10
):
    must = []
    filters = []

    # Text search
    if q:
        must.append({
            "multi_match": {
                "query": q,
                "fields": [
                    "title",
                    "brand",
                    "category",
                    "description"
                ]
            }
        })

    # Price filters
    if minPrice is not None or maxPrice is not None:
        price_filter = {"range": {"price": {}}}

        if minPrice is not None:
            price_filter["range"]["price"]["gte"] = minPrice

        if maxPrice is not None:
            price_filter["range"]["price"]["lte"] = maxPrice

        filters.append(price_filter)

    # Build query
    query = {
        "bool": {
            "must": must if must else [{"match_all": {}}],
            "filter": filters
        }
    }

    response = es.search(
        index="products",
        query=query,
        from_=(page - 1) * pageSize,
        size=pageSize
    )

    products = [hit["_source"] for hit in response["hits"]["hits"]]

    return {
        "items": products,
        "total": response["hits"]["total"]["value"],
        "page": page,
        "pageSize": pageSize
    }
# @router.get("/search")
# def search_products(q: str):
    
#     print(q)
#     response = es.search(
#     index="products",
#     query={
#         "multi_match": {
#             "query": q,
#             "fields": [
#                 "title",
#                 "brand",
#                 "category",
#                 "description"
#             ]
#         }
#     })
#     products = []

#     for hit in response["hits"]["hits"]:
#         products.append(hit["_source"])

#     return {
#         "items": products,
#         "total": response["hits"]["total"]["value"]
#     }


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

