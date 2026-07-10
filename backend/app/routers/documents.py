import os
import shutil
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from uuid import UUID
from app.database import get_db
from app.models.document import Document
from app.models.product import Product
from app.schemas.document import DocumentOut
from typing import List

router = APIRouter(tags=["Documents"])

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.get("/products/{id}/documents", response_model=List[DocumentOut])
def get_documents(id: UUID, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return db.query(Document).filter(Document.product_id == id).all()

@router.post("/products/{id}/documents", response_model=DocumentOut, status_code=201)
def upload_document(id: UUID, file: UploadFile = File(...), db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Get current version
    existing = db.query(Document).filter(
        Document.product_id == id,
        Document.filename == file.filename
    ).count()
    version = existing + 1

    # Save file
    file_path = f"{UPLOAD_DIR}/{id}_{version}_{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Detect file type
    ext = file.filename.split(".")[-1].lower()
    file_type = ext if ext in ["pdf", "dwg"] else "image"

    doc = Document(
        product_id=id,
        filename=file.filename,
        file_type=file_type,
        file_url=file_path,
        version=version,
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc

@router.delete("/documents/{id}", status_code=204)
def delete_document(id: UUID, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    if os.path.exists(doc.file_url):
        os.remove(doc.file_url)
    db.delete(doc)
    db.commit()