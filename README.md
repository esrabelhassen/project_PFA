## Sprint 1 — Fixes & API Testing Guide

---

### Problems Fixed (Code Review — 27 June 2026)

#### B1 — Empty `requirements.txt`
Added all backend dependencies with pinned versions.
```
fastapi==0.110.0
uvicorn==0.29.0
sqlalchemy==2.0.29
alembic==1.13.1
psycopg2-binary==2.9.9
pydantic==2.6.4
python-dotenv==1.0.1
```

#### B2 — App crashed without environment config
- Added `.env.example` with placeholder values
- Added a clear error message in `database.py` when `DATABASE_URL` is missing
- Updated `.gitignore` to ignore `.env` but commit `.env.example`

#### B3 — No database migrations committed
- Fixed `alembic/env.py` to load `DATABASE_URL` from `.env`
- Generated and committed initial migration for the `products` table
- `alembic upgrade head` now creates the table on a clean clone

#### B4 — Frontend loaded wrong component
- Fixed `main.jsx` to import the real `App.jsx`
- Removed leftover Vite boilerplate

#### B5 — Frontend dependencies missing from `npm install`
- Added all required dependencies to `frontend/package.json`
- A clean `npm install` now pulls everything automatically

---

### How to Run the Project

#### 1 — Clone and configure
```
git clone <repo-url>
cd project_PFA
```

Create your `.env` file from the example:
```
cp backend/.env.example backend/.env
```

Edit `backend/.env` and fill in your values:
```
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/erp_db
OPENAI_API_KEY=sk-...
```

#### 2 — Create the database (once)
Open pgAdmin or psql and run:
```sql
CREATE DATABASE erp_db;
```

#### 3 — Set up the backend
```
cd backend
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload
```

Backend runs at:
```
http://localhost:8000
```

#### 4 — Set up the frontend
```
cd frontend
npm install
npm run dev
```

Frontend runs at:
```
http://localhost:5173
```

---

### How to Test the APIs

Open Swagger UI at:
```
http://localhost:8000/docs
```

#### POST /products/ — Create a product
- Click **Try it out**
- Use this body:
```json
{
  "reference": "PRD-0001",
  "name": "Table en bois",
  "description": "Table de bureau",
  "type": "finished",
  "category": "Mobilier"
}
```
- Expected response: `201 Created` + product with UUID

#### GET /products/ — List all products
- Click **Try it out** → **Execute**
- Expected response: `200 OK` + list of products

#### GET /products/{id} — Get one product
- Paste the UUID from the POST response
- Expected response: `200 OK` + product details

#### PUT /products/{id} — Update a product
- Paste the UUID
- Send the full updated object
- Expected response: `200 OK` + updated product

#### DELETE /products/{id} — Delete a product
- Paste the UUID
- Expected response: `204 No Content`

---

### API Response Codes

| Code | Meaning |
|------|---------|
| 200 | Success — GET, PUT |
| 201 | Created — POST |
| 204 | Deleted — DELETE |
| 404 | Product not found |
| 422 | Validation error — check request body |