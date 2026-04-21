from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from api.database import create_db_and_tables
from api.routes import client, contact, field_definition # Make sure to import this

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

app = FastAPI(lifespan=lifespan)


origins = [
    "http://localhost:4200",
]

# Add the middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(client.router)
app.include_router(contact.router)
app.include_router(field_definition.router)

@app.get("/")
async def root():
    return {"message": "Hello World from FastAPI!"}