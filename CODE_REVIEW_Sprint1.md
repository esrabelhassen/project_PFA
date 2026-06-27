# Code Review — PFA "Module Produit" (Sprint 1)

**Reviewer:** Esra (Supervisor)
**Date:** 27 June 2026
**Commit reviewed:** `465edcd` — *feat(sprint-1-frontend): implemented product list, add/edit form, and API integration*
**Scope:** FastAPI backend (product CRUD + Alembic) and React + Vite frontend (product list / form / API integration)
**Review type:** Static analysis **plus** a full clone-and-run verification on a clean Windows machine. **No repository code was modified.** The fixes below are described, not written — they are the student's to implement.

---

## 1. Executive summary

The CRUD logic is correct and the structure is clean and conventional. Once the environment was scaffolded locally, **every backend endpoint worked end to end against PostgreSQL** (create, read, update, delete all verified), and the product page rendered and talked to the API.

**However, the repository as committed does not run from a clean clone.** Reaching a working state required several manual workarounds that a teammate or evaluator should not have to discover on their own. There are **five blocking issues**: an empty `requirements.txt`, no committed environment configuration (the backend crashes on import without it), no committed database migrations (the table is never created), the frontend entry point loading the wrong component, and the frontend's real dependencies not being installed by `npm install` as committed.

None of these are large fixes individually, but together they mean the work cannot currently be installed, run, or demonstrated straight from the repo. The priority for the next sprint is a single clear goal: **a teammate can clone the repo, follow the README, and reach a working product list — with no undocumented steps.**

**Can it run as-is from a clean clone?** No.
**Is the underlying functionality correct once it runs?** Yes — verified live (section 3).

---

## 2. How this was verified

A genuine clone-and-run was performed, not just a read-through:

- Cloned the repository and read every source file (backend + frontend).
- Created a clean Python virtual environment and attempted to import the backend exactly as a fresh clone would (no `.env`). It crashed at `create_engine(...)` with `ArgumentError: Expected string or URL object, got None` — confirming the missing-config blocker.
- Stood up a local PostgreSQL 16 database, created the schema directly from the SQLAlchemy models (no migrations existed to run), and started the API with Uvicorn.
- Exercised every endpoint through the Swagger UI at `/docs`.
- Installed the frontend, corrected the entry point locally, and loaded the product page in the browser.

All workarounds were local and **were not committed**; they are listed in section 6 so the result is transparent and reproducible.

---

## 3. Run verification results (live)

| Action | Result |
|--------|--------|
| Backend import (no `.env`, clean clone state) | **Failed** — crashes on import (missing `DATABASE_URL`). |
| Backend import (after local `.env`) | **OK** |
| Create table from models | **OK** — `products` table created (no migration available). |
| `POST /products/` | **201** — product created with UUID + timestamps. |
| `GET /products/` | **200** — returns the product list. |
| `PUT /products/{id}` | **200** — update applied. |
| `DELETE /products/{id}` | **204** — product removed. |
| Frontend `npm install` (as committed) | Installs, but **does not pull the product module's dependencies** (`@tanstack/react-query` etc.). |
| Frontend load (entry as committed) | **Wrong screen** — renders the default Vite template, not the product module. |
| Frontend load (entry corrected + deps installed) | **OK** — product page renders and communicates with the API. |

**Conclusion:** the business logic is sound; the packaging and reproducibility are not.

---

## 4. Blockers — "Won't run until fixed"

These must be resolved before the project can start from a clean clone.

| # | Blocker | File | Effect |
|---|---------|------|--------|
| B1 | `requirements.txt` is **empty (0 bytes)** | `backend/requirements.txt` | `pip install -r requirements.txt` installs nothing; backend cannot be set up. |
| B2 | **No environment config** committed and no example file | `backend/app/database.py`, `.gitignore` | `DATABASE_URL` resolves to `None` → `create_engine(None)` crashes on import. *Verified live.* |
| B3 | **No Alembic migrations** committed; `env.py` missing and gitignored | `backend/alembic/` | `alembic upgrade head` cannot run; the `products` table is never created. |
| B4 | **Frontend entry renders the wrong component** | `frontend/src/main.jsx` | Imports the Vite template (`App.jsx`) instead of the product module (`Apps.jsx`). *Verified live — boilerplate shown.* |
| B5 | **Frontend dependencies not installed by `npm install`** | `frontend/package.json`, root `package.json` | The product module imports `@tanstack/react-query`, MUI, and axios, which a clean `npm install` does not pull; the page crashes on load. *Verified live.* |

---

## 5. Findings by severity

### Critical

**C1 — Empty `requirements.txt`** · `backend/requirements.txt`
No dependencies declared (FastAPI, Uvicorn, SQLAlchemy, Alembic, Pydantic, a PostgreSQL driver, python-dotenv).
*Direction:* pin every runtime dependency the code actually uses, with versions.

**C2 — App crashes on import with no environment file** · `backend/app/database.py`
`DATABASE_URL` is `None` when no `.env` exists; `create_engine(None)` raises immediately. Because `.env` is gitignored and there is no `.env.example`, every fresh clone is in this state.
*Direction:* commit a `.env.example`, and fail with a clear message when `DATABASE_URL` is unset rather than an opaque SQLAlchemy error.

**C3 — No database migrations committed** · `backend/alembic/`
No `versions/` directory and no `env.py` (the latter also gitignored). The commit message references a migration, but none exists.
*Direction:* generate and commit the initial migration, track `alembic/env.py`, wire it to the same database URL, and document `alembic upgrade head`.

**C4 — Frontend dependencies missing from install** · `frontend/package.json` (+ stray root `package.json`)
The product module's dependencies are not installed by a clean `npm install` in `frontend/`; the real page fails to load until they are added manually. Compounded by a duplicate `package.json` at the repo root, which makes it ambiguous where to install.
*Direction:* ensure every dependency the frontend imports is declared in `frontend/package.json`; remove the root-level frontend dependencies/lockfile so `npm install` in `frontend/` is sufficient and unambiguous.

### High

**H1 — Frontend renders boilerplate, not the product module** · `frontend/src/main.jsx`
`main.jsx` imports the unmodified Vite starter (`App.jsx`); the real app (`QueryClientProvider` + `ProductsPage`) lives in `Apps.jsx`, which nothing imports. The README also incorrectly states the provider is in `App.jsx`.
*Direction:* consolidate to a single entry component, delete the unused boilerplate, and make `main.jsx` import the real one.

**H2 — Schema locked to PostgreSQL with no portable fallback** · `backend/app/models/product.py`
Uses `postgresql.UUID`; combined with the missing migrations, there is no path to create the schema on another engine, and Postgres is never documented as required.
*Direction:* either document Postgres as a hard requirement and ship a working migration, or use a dialect-agnostic UUID approach.

### Medium

**M1 — `PUT` overwrites fields on partial updates** · `backend/app/routers/products.py` (`update_product`)
Applies `data.model_dump()` over every column with no `exclude_unset`; omitted fields are written as `None`, violating `NOT NULL` on `reference` / `name`.
*Direction:* apply only the fields the client sent, or document that `PUT` requires the full object.

**M2 — No error handling on the frontend** · `ProductsPage.jsx`, `ProductForm.jsx`
Queries and mutations expose no error state — failed loads or saves fail silently.
*Direction:* surface error and empty states; disable the save action while a mutation is in flight.

**M3 — Form submits server-managed fields on edit** · `frontend/src/components/ProductForm.jsx`
On edit, the whole row (`id`, `created_at`, `updated_at`) is copied into form state and sent back.
*Direction:* send only the editable fields.

**M4 — Schema/DB enum mismatch** · `backend/app/schemas/product.py` vs `models/product.py`
`type` is a free `Optional[str]` in the schema but a constrained enum in the database, so an invalid value passes validation and fails at the database layer.
*Direction:* constrain `type` in the schema to the allowed values so invalid input is rejected cleanly (422) before reaching the database.

### Low

**L1 — Deprecated `datetime.utcnow`** · `backend/app/models/product.py` — prefer a timezone-aware UTC value.
**L2 — No pagination on the list endpoint** · `backend/app/routers/products.py` — add limit/offset before the dataset grows.
**L3 — README installation steps are empty** · `README.md` — the section has headers but no commands; backend, environment, and migration steps are absent. (The PostgreSQL non-default port encountered during testing is exactly the kind of detail the README should capture.)

---

## 6. Local workarounds used to verify (NOT committed)

For transparency — these made the project run locally and were intentionally kept out of the repository:

- Installed backend dependencies manually (FastAPI, Uvicorn, SQLAlchemy, Alembic, psycopg2-binary, python-dotenv, Pydantic).
- Created a local `.env` with a working `DATABASE_URL`.
- Created the `products` table directly from the models (a temporary `create_tables.py`), since no migration exists.
- Changed `main.jsx` to import the real component instead of the boilerplate.
- Installed the missing frontend packages by hand.

These are the student's to implement properly per the findings above.

---

## 7. What was done well

- Clean, conventional FastAPI layout (`models` / `schemas` / `routers` / `database` separation).
- CRUD endpoints are correct and idiomatic, with proper 404 handling and sensible status codes — **all verified working live.**
- Pydantic schemas use inheritance well and `from_attributes` for ORM serialization.
- The DB session dependency (`get_db`) is implemented correctly with proper cleanup.
- CORS is scoped to the dev frontend origin rather than left wide open.
- Frontend uses React Query and MUI DataGrid sensibly; clean list/form split and consistent French UI labels.

---

## 8. Validation verdict

**Status: CONDITIONAL PASS — not yet signed off.**

The functionality is correct and was demonstrated working end to end, which reflects real, competent work. However, Sprint 1 **cannot be marked "done"** while the repository does not run from a clean clone. A deliverable that only runs on the author's machine, with undocumented manual steps, is not yet a deliverable.

**Decision: do not proceed to the next sprint until blockers B1–B5 are closed and a clean clone runs by following the README alone.** This is expected to be a short round of fixes, not a rebuild.

**Definition of done for sign-off:** a teammate clones the repo, follows the README, and reaches a working product list in the browser — no questions, no manual patches.

**Recommended priority order:** B1–B5 first (make it run), then H2 + L3 (database decision + README), then M1/M4 (update + validation), then M2/M3 (frontend robustness), then L1/L2 housekeeping.
