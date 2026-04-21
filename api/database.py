import os
from sqlmodel import SQLModel, create_engine
from dotenv import load_dotenv

# 1. IMPORT YOUR MODELS HERE
from api.models.client import Client
from api.models.contact import Contact

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL, echo=True)

def create_db_and_tables():
    # Now that the models are imported, SQLAlchemy knows about them
    SQLModel.metadata.create_all(engine)