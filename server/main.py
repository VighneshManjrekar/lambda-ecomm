from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.products import router as products_router
from api.seed import router as seed_router
from api.events import router as events_router

app = FastAPI(
    title="Hybrid Analytics System",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # allowing all since user might not use vs code live server for hosting index.html
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(seed_router) # /api/seed
app.include_router(products_router) # /api/products
app.include_router(events_router) # /api/events


@app.get("/")
def home():
    return {
        "message": "Hybrid Analytics System API Running"
    }