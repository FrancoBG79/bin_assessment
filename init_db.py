import sys
import os

# Ensure the current directory is in sys.path so it can find the 'api' folder
sys.path.append(os.getcwd())

try:
    from api.database import create_db_and_tables, engine, seed_fields

    print("Attempting to create tables...")
    create_db_and_tables()

    print("Seeding data...")
    seed_fields(engine)

    print("Setup complete!")
except Exception as e:
    print(f"An error occurred: {e}")