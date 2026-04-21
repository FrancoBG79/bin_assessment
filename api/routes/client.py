from fastapi import APIRouter
from api.models.client import Client

router = APIRouter(prefix="/clients", tags=["Clients"])

@router.post("/")
def create_client(client: Client):
    # Logic to save to DB goes here
    return client

@router.get("/")
def read_clients():
    # Logic to fetch all clients goes here
    return []

@router.get("/{client_id}")
def read_client(client_id: str):
    # Logic to fetch one client goes here
    return {"message": f"Fetch client {client_id}"}

@router.patch("/{client_id}")
def update_client(client_id: str, client: Client):
    # Logic to update client goes here
    return client

@router.delete("/{client_id}")
def delete_client(client_id: str):
    # Logic to delete client goes here
    return {"message": f"Client {client_id} deleted"}