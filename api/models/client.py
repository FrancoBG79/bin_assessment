import uuid
from sqlmodel import SQLModel, Field
from typing import Optional

class Client(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str
    client_code: str
    no_linked_contacts: int = Field(default=0)