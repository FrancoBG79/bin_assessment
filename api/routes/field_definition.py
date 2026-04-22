from fastapi import APIRouter, Query, HTTPException
from sqlmodel import Session, select
from api.database import engine
from api.models.field_definition import FieldDefinition
from typing import List

router = APIRouter(prefix="/fields", tags=["Fields"])

@router.get("", response_model=List[FieldDefinition])
def read_fields(
    entity: str = Query(..., description="The entity type (clients or contacts)", min_length=1)
):
    valid_entities = ["clients", "contacts"]
    if entity not in valid_entities:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid entity. Must be one of: {', '.join(valid_entities)}"
        )

    with Session(engine) as session:
        statement = select(FieldDefinition).where(
            FieldDefinition.for_entity.in_([entity, "both"])
        )
        
        results = session.exec(statement).all()
        return results