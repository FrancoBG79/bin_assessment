import uuid
from typing import Optional
from sqlmodel import SQLModel, Field

class FieldDefinition(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    description: str
    field_type: str
    compulsory: bool
    additional_information: Optional[str] = None
    for_entity: str