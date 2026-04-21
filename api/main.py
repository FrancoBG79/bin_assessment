from fastapi import FastAPI
from contextlib import asynccontextmanager
from api.database import create_db_and_tables
from api.routes import client, contact 

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

app = FastAPI(lifespan=lifespan)


app.include_router(client.router)
app.include_router(contact.router)

@app.get("/")
async def root():
    return {"message": "Hello World from FastAPI!"}