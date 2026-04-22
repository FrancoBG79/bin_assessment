from sqlmodel import Session
from api.models.client import Client
from api.models.contact import Contact

def generate_client_code(full_name: str, numeric_code: str):
    full_name = full_name.upper()
    words = full_name.split()
    if not words:
        return "ABC" + numeric_code
        
    if len(words) == 1:
        name = words[0]
        prefix = name[:3] + "ABC"[len(name):]
        
    else:
        initials = "".join([word[0] for word in words])
        prefix = initials[:3] + "ABC"[len(initials):]
        
    return prefix + numeric_code

def sync_relationships(db: Session, contact_id: str, old_client_ids: list, new_client_ids: list):
    """
    Synchronizes the relationship between a Contact and Clients.
    - Adds Contact ID to new Clients.
    - Removes Contact ID from old Clients that are no longer associated.
    """
    # Use sets for efficient comparison
    old_set = set(old_client_ids)
    new_set = set(new_client_ids)
    
    # 1. Clients to ADD: in new set, but not in old
    to_add = new_set - old_set
    
    # 2. Clients to REMOVE: in old set, but not in new
    to_remove = old_set - new_set
    
    # Handle Additions
    for c_id in to_add:
        client = db.get(Client, c_id)
        if client:
            # Append if not already there (safety check)
            if contact_id not in client.no_linked_contacts:
                client.no_linked_contacts.append(contact_id)
                db.add(client)
                
    # Handle Removals
    for c_id in to_remove:
        client = db.get(Client, c_id)
        if client and contact_id in client.no_linked_contacts:
            client.no_linked_contacts.remove(contact_id)
            db.add(client)
            
    # Note: We do NOT commit here. We let the calling route commit 
    # so the operation remains atomic (all or nothing).