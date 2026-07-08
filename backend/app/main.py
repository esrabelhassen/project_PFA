from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import products, bom, routing

app = FastAPI(title="ERP Module Produit")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router)
app.include_router(bom.router)
app.include_router(routing.router)