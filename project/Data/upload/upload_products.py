import json
import requests

def put(object, index):
    object["@metadata"] = {
        "@collection": "Products"
    }
    
    id = f'products/{index}'

    return {
        "Id": id,
        "Document": object, 
        "Type": "PUT"
    }

commands = {"Commands":[]}

with open("../final/products.json") as f:
    products = json.load(f)
    commands["Commands"] = [put(product, i+1) for i, product in enumerate(products)]

req = requests.post("http://localhost:8080/databases/Pc-Parts/bulk_docs", json=commands)
print(req.status_code)
if req.status_code != 201:
    print(req.text)