import uuid
from typing import List
from sqlmodel import SQLModel, Field
from sqlalchemy import Column, String
from sqlalchemy.dialects.postgresql import ARRAY

class Contact(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str
    surname: str
    email: str
    no_of_clients: List[str] = Field(default=[], sa_column=Column(ARRAY(String)))

class ContactCreate(SQLModel):
    name: str
    surname: str
    email: str
    no_of_clients: List[str] = []