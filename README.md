## Sprint 1 — Backend (Steps 1–7)

### What was built
- Configured environment variables (`.env`) for database and OpenAI credentials
- Connected FastAPI to PostgreSQL via SQLAlchemy (`database.py`)
- Defined the `Product` database model (`models/product.py`)
- Defined Pydantic schemas for data validation (`schemas/product.py`)
- Implemented full CRUD API for products (`routers/products.py`)
- Registered router and configured CORS (`main.py`)
- Created and applied first Alembic migration — `products` table now exists in DB

### Testing
All endpoints are testable via Swagger UI at: