import sys
import os

sys.path.append(os.getcwd())

try:
    from api.database import engine, SQLModel, seed_fields
    from api.models import Contact, Client 

    print("Dropping all existing tables...")
    SQLModel.metadata.drop_all(engine)

    print("Recreating all tables with new schema...")
    SQLModel.metadata.create_all(engine)

    print("Seeding fields data only...")
    seed_fields(engine)

    print("Setup complete!")
except Exception as e:
    print(f"An error occurred: {e}")