import os
from sqlmodel import SQLModel, create_engine, Session, select
from dotenv import load_dotenv

# 1. IMPORT YOUR MODELS HERE
from api.models.client import Client
from api.models.contact import Contact
from api.models.field_definition import FieldDefinition

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL, echo=True)

def create_db_and_tables():
    # Now that the models are imported, SQLAlchemy knows about them
    SQLModel.metadata.create_all(engine)

def seed_fields(engine):
    with Session(engine) as session:
        results = session.exec(select(FieldDefinition)).all()
        if not results:
            data = [
                FieldDefinition(description="name", field_type="textbox", compulsory=True, additional_information="N/A", for_entity="both"),
                FieldDefinition(description="surname", field_type="textbox", compulsory=True, additional_information="N/A", for_entity="clients"),
                FieldDefinition(description="email", field_type="textbox", compulsory=True, additional_information="The entered email should be unique and validate as a email", for_entity="clients"),
                FieldDefinition(description="client_code", field_type="textbox", compulsory=True, additional_information="The client code should be auto generated", for_entity="contacts"),
            ]
            session.add_all(data)
            session.commit()
            print("Database seeded with entities.")