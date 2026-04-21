import sys
import os

# Ensure the current directory is in sys.path so it can find the 'api' folder
sys.path.append(os.getcwd())

try:
    from api.database import create_db_and_tables
    print("Import successful. Attempting to create tables...")
    create_db_and_tables()
    print("Success! Tables created.")
except Exception as e:
    print(f"An error occurred: {e}")