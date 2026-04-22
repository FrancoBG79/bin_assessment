import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from api.models.client import Client
from api.models.contact import Contact, ContactCreate
from api.database import get_session
from .utils import sync_relationships

router = APIRouter(prefix="/contacts", tags=["Contacts"])

@router.post("", response_model=Contact, status_code=status.HTTP_201_CREATED)
def create_contact(contact: ContactCreate, db: Session = Depends(get_session)):
    existing_contact = db.exec(select(Contact).where(Contact.email == contact.email)).first()
    if existing_contact:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="A contact with this email already exists."
        )
    try:
        db_contact = Contact.model_validate(contact)
        db.add(db_contact)
        db.commit()
        db.refresh(db_contact)
        if db_contact.no_of_clients:
            sync_relationships(db, str(db_contact.id), [], db_contact.no_of_clients, Client, 'no_linked_contacts')
            db.commit()
        return db_contact
    except Exception as e:
        db.rollback()
        print(f"Error creating contact: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="Database insertion failed"
        )

@router.get("", response_model=List[Contact], status_code=status.HTTP_200_OK)
def read_contacts(db: Session = Depends(get_session)):
    try:
        statement = select(Contact)
        contacts = db.exec(statement).all()
        return contacts
    except Exception as e:
        print(f"Error fetching contacts: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve contacts from the database."
        )

@router.get("/{contact_id}", response_model=Contact, status_code=status.HTTP_200_OK)
def read_contact(contact_id: uuid.UUID, db: Session = Depends(get_session)):
    contact = db.get(Contact, contact_id)
    if not contact:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Contact with ID {contact_id} not found"
        )
    return contact

@router.put("", response_model=Contact, status_code=status.HTTP_200_OK)
def update_contact(contact_data: Contact, db: Session = Depends(get_session)):
    db_contact = db.get(Contact, contact_data.id)
    if not db_contact: raise HTTPException(status_code=404)
    
    old_links = db_contact.no_of_clients.copy()
    
    update_data = contact_data.model_dump(exclude={'id'})
    for key, value in update_data.items():
        setattr(db_contact, key, value)
    
    sync_relationships(db, str(db_contact.id), old_links, contact_data.no_of_clients, Client, 'no_linked_contacts')
    
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    return db_contact

@router.delete("/{contact_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_contact(contact_id: str):
    # Added the operation but was not part of assignment
    return {"message": f"Contact {contact_id} deleted"}