from fastapi import FastAPI
from api.products import router as products_router
from api.seed import router as seed_router

app = FastAPI(
    title="Hybrid Analytics System",
    version="1.0.0"
)

app.include_router(seed_router) # /api/seed
app.include_router(products_router) # /api/products



@app.get("/")
def home():
    return {
        "message": "Hybrid Analytics System API Running"
    }

