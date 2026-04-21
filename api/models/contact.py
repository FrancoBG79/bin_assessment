import uuid
from sqlmodel import SQLModel, Field
from typing import Optional

class Contact(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)s
    name: str
    surname: str
    email: str
    no_of_clients: int = Field(default=0)