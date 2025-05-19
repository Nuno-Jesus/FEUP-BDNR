import json
import requests

def put(object, index):
    object["@metadata"] = {
        "@collection": "Users"
    }
    
    id = f'users/{index}'

    return {
        "Id": id,
        "Document": object, 
        "Type": "PUT"
    }

commands = {"Commands":[]}

with open("../final/users.json") as f:
    users = json.load(f)
    commands["Commands"] = [put(user, i+1) for i, user in enumerate(users)]

req = requests.post("http://localhost:8080/databases/Pc-Parts/bulk_docs", json=commands)
print(req.status_code)
if req.status_code != 201:
    print(req.text)