import uuid
from typing import List, Optional
from sqlmodel import SQLModel, Field
from sqlalchemy import Column, String
from sqlalchemy.dialects.postgresql import ARRAY
from pydantic import computed_field

class Client(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str
    client_code_prefix: str = Field(..., regex=r"^[A-Z]{3}$")
    client_code_suffix: str = Field(..., regex=r"^\d{3}$")
    no_linked_contacts: List[str] = Field(
        default=[], 
        sa_column=Column(ARRAY(String))
    )
    @computed_field
    @property
    def client_code(self) -> str:
        return f"{self.client_code_prefix}{self.client_code_suffix}"

class ClientCreate(SQLModel):
    name: str
    client_code: str = Field(..., regex=r"^[A-Z]{3}\d{3}$")
    no_linked_contacts: List[str] = []