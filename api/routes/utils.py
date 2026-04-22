from sqlmodel import Session
from sqlalchemy.orm.attributes import flag_modified
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

def sync_relationships(db: Session, my_id: str, old_ids: list, new_ids: list, target_model, target_field: str):
    old_set = set(old_ids)
    new_set = set(new_ids)

    to_add = new_set - old_set
    to_remove = old_set - new_set
    
    for item_id in to_add:
        obj = db.get(target_model, item_id)
        if obj:
            current_list = getattr(obj, target_field)
            if my_id not in current_list:
                current_list.append(my_id)
                # Tell SQLAlchemy: "This list changed, please update it!"
                flag_modified(obj, target_field) 
                db.add(obj)
                
    for item_id in to_remove:
        obj = db.get(target_model, item_id)
        if obj:
            current_list = getattr(obj, target_field)
            if my_id in current_list:
                current_list.remove(my_id)
                flag_modified(obj, target_field) 
                db.add(obj)
            