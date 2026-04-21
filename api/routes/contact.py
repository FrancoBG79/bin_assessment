from fastapi import APIRouter
from api.models.contact import Contact

router = APIRouter(prefix="/contacts", tags=["Contacts"])

@router.post("/")
def create_contact(contact: Contact):
    # Logic to save to DB goes here
    return contact

@router.get("/")
def read_contacts():
    # Logic to fetch all contacts goes here
    return []

@router.get("/{contact_id}")
def read_contact(contact_id: str):
    # Logic to fetch one contact goes here
    return {"message": f"Fetch contact {contact_id}"}

@router.patch("/{contact_id}")
def update_contact(contact_id: str, contact: Contact):
    # Logic to update contact goes here
    return contact

@router.delete("/{contact_id}")
def delete_contact(contact_id: str):
    # Logic to delete contact goes here
    return {"message": f"Contact {contact_id} deleted"}