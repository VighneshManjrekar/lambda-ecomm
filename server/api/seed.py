from fastapi import APIRouter
from faker import Faker
from random import choice, uniform

from db.mongodb import products_collection
from db.elasticsearch_client import es

router = APIRouter(
    prefix="/api/seed",
    tags=["Seed"]
)

fake = Faker()

BRANDS = [
    "Apple",
    "Samsung",
    "Sony",
    "LG",
    "Dell",
    "HP",
    "Nike",
    "Adidas",
    "Puma",
    "Philips"
]

CATEGORIES = [
    "Electronics",
    "Fashion",
    "Home & Kitchen",
    "Sports",
    "Computers"
]


@router.get("/products")
def seed_products():

    products_collection.delete_many({})

    products = []

    for product_id in range(1, 201):

        category = choice(CATEGORIES)

        product = {
            "id": product_id,
            "title": fake.catch_phrase(),
            "brand": choice(BRANDS),
            "category": category,
            "price": round(uniform(10, 2000), 2),
            "description": fake.text(max_nb_chars=150)
        }

        products.append(product)

    products_collection.insert_many(products)

    return {
        "success": True,
        "seededCount": len(products)
    }

@router.get("/reindex")
def reindex_products():

    products = list(
        products_collection.find({}, {"_id": 0})
    )

    indexed = 0

    for product in products:

        es.index(
            index="products",
            id=product["id"],
            document=product
        )

        indexed += 1

    return {
        "success": True,
        "indexedCount": indexed
    }