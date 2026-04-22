import uuid
from typing import List
from sqlmodel import SQLModel, Field
from sqlalchemy import Column, String
from sqlalchemy.dialects.postgresql import ARRAY

class Client(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str
    client_code: str
    no_linked_contacts: List[str] = Field(default=[], sa_column=Column(ARRAY(String)))

class ClientRead(SQLModel):
    id: uuid.UUID
    name: str
    client_code: str
    no_linked_contacts: int