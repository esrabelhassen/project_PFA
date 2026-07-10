## Sprint 3 — Documentation & Bons de commande

### What was built
- Defined `Document` and `PurchaseOrder` SQLAlchemy models
- Generated and applied Alembic migration for `documents` and `purchase_orders` tables
- Implemented document endpoints — list, upload, delete with automatic versioning
- Implemented purchase order endpoints — list, generate, update status
- Mounted `uploads/` folder as static file server
- Built `DocumentList` component — upload and delete files linked to a product
- Built `PurchaseOrdersPage` — generate orders from BOM and track status lifecycle
- Added tab navigation in `App.jsx` — Produits / Bons de commande
- Updated `ProductsPage` dashboard — three panels: BOM, Routing, Documents

### How to test

#### Documents
1. Click any product row in the table
2. Confirm three panels appear: BOM, Routing, Documents
3. Click **+ Upload fichier** and select a PDF or image
4. Confirm file appears with filename, type, and version number
5. Click delete icon → confirm file disappears

#### Purchase Orders
1. Make sure the selected product has at least one BOM component
2. Click the **Bons de commande** tab
3. Select a product from the dropdown
4. Click **Générer bon de commande**
5. Confirm order appears in the table with status `draft`
6. Change status `draft` → `sent` → `received`
7. Confirm status updates correctly

#### Swagger UI
Open `http://localhost:8000/docs` and verify:

| Endpoint | Expected |
|----------|----------|
| GET /products/{id}/documents | 200 |
| POST /products/{id}/documents | 201 |
| DELETE /documents/{id} | 204 |
| GET /purchase-orders | 200 |
| POST /purchase-orders/generate/{id} | 201 |
| PUT /purchase-orders/{id}/status | 200 |

### Notes
- A product must have at least one BOM item before generating a purchase order
- Uploaded files are stored in `backend/uploads/` and served at `http://localhost:8000/uploads/`
- File versioning is automatic — uploading the same filename increments the version number