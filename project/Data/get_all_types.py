import json

with open('products.json', 'r') as f:
    products = [json.loads(line) for line in f]

types = set()

for product in products:
    types.add(product['type'])        


print("Unique types:")
for key in types:
    print(key)
