from sqlmodel import Session
from sqlalchemy.orm.attributes import flag_modified
from api.models.client import Client
from api.models.contact import Contact

def generate_client_code(full_name_string: str):    
    names = full_name_string.split();
    names_length = len(names)
    client_code = ''
    if names_length == 1:
        name = names[0].upper()
        if name.isalpha() == False:
            name = "ABC"
        elif len(name) == 2:
            name += "A"
        elif len(name) == 1:
            name += "AB"
        else:
            name = name[:3]
        client_code = name
    else:
        max_tries = 3
        count = 0
        while count < names_length and count < max_tries:
            client_code += names[count][:1]
            count += 1
        
        if len(client_code) == 2:
            client_code += "A"
    return client_code.upper()

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
            