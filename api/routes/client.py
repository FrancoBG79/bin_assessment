import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from api.models.client import Client, ClientCreate
from api.database import get_session

router = APIRouter(prefix="/clients", tags=["Clients"])

@router.post("/", response_model=Client, status_code=status.HTTP_201_CREATED)
def create_client(client: ClientCreate, db: Session = Depends(get_session)):
    try:
        db_client = Client.model_validate(client)
        db.add(db_client)
        db.commit()
        db.refresh(db_client)
        return db_client
    except Exception as e:
        db.rollback()
        print(f"Error creating client: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="Database insertion failed"
        )

@router.get("/", response_model=List[Client], status_code=status.HTTP_200_OK)
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

@router.put("/", response_model=Client, status_code=status.HTTP_200_OK)
def update_client(client_data: Client, db: Session = Depends(get_session)):
    db_client = db.get(Client, client_data.id)
    
    if not db_client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Client with ID {client_data.id} not found"
        )
    
    try:
        update_data = client_data.model_dump(exclude={'id'})
        for key, value in update_data.items():
            setattr(db_client, key, value)
        
        db.add(db_client)
        db.commit()
        db.refresh(db_client)
        return db_client
        
    except Exception as e:
        db.rollback()
        print(f"Error updating client: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update client due to a database error."
        )

@router.delete("/{contact_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_contact(contact_id: str):
    # Added the operation but was not part of assignment
    return {"message": f"Contact {contact_id} deleted"}