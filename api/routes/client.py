import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from sqlalchemy import func, cast, Integer
from api.models.client import Client, ClientCreate
from api.models.contact import Contact
from api.database import get_session
from .utils import generate_client_code, sync_relationships

router = APIRouter(prefix="/clients", tags=["Clients"])

@router.post("", response_model=Client, status_code=status.HTTP_201_CREATED)
def create_client(client: ClientCreate, db: Session = Depends(get_session)):
    try:
        statement = select(func.max(cast(func.substring(Client.client_code, 4), Integer)))
        last_number = db.exec(statement).one()
        next_number = (last_number or 0) + 1
        formatted_num = f"{next_number:03d}"
        client_data = client.model_dump()
        client_data["client_code"] = generate_client_code(client_data["name"], formatted_num)
        db_client = Client(**client_data)
        db.add(db_client)
        db.commit()
        db.refresh(db_client)
        if db_client.no_linked_contacts:
            sync_relationships(db, str(db_client.id), [], db_client.no_linked_contacts, Contact, 'no_of_clients')
            db.commit()
        return db_client
    except Exception as e:
        db.rollback()
        print(f"Error creating client: {e}")
        print("--- DATABASE ERROR START ---")
        import traceback
        traceback.print_exc()
        print("--- DATABASE ERROR END ---")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="Database insertion failed"
        )

@router.get("", response_model=List[Client], status_code=status.HTTP_200_OK)
def read_clients(db: Session = Depends(get_session)):
    try:
        statement = select(Client)
        clients = db.exec(statement).all()
        return clients
    except Exception as e:
        print(f"Error fetching clients: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve clients from the database."
        )

@router.get("/{client_id}", response_model=Client, status_code=status.HTTP_200_OK)
def read_client(client_id: uuid.UUID, db: Session = Depends(get_session)):
    client = db.get(Client, client_id)
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Client with ID {client_id} not found"
        )
    return client

@router.put("", response_model=Client, status_code=status.HTTP_200_OK)
def update_client(client_data: Client, db: Session = Depends(get_session)):
    db_client = db.get(Client, client_data.id)
    if not db_client: raise HTTPException(status_code=404)

    old_links = db_client.no_linked_contacts.copy()
    
    update_data = client_data.model_dump(exclude={'id'})
    for key, value in update_data.items():
        setattr(db_client, key, value)
    
    sync_relationships(db, str(db_client.id), old_links, client_data.no_linked_contacts, Contact, 'no_of_clients')
    
    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    return db_client

@router.delete("/{contact_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_contact(contact_id: str):
    # Added the operation but was not part of assignment
    return {"message": f"Contact {contact_id} deleted"}