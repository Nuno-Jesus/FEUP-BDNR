import json
import random

with open('./final/products.json', 'r') as f:
    products = json.load(f)

for product in products:
    n = random.randint(1, 4)

    image_name = product['name'].lower().replace(' ', '_') + '.jpg'
    if product['category'] in ['case-accessory', 'fan-controller', 'sound-card', 'unknown']:
        continue

    if product['category'] != 'cpu':
        product['image'] = f'/products/{product["category"]}/{n}.jpg'
        continue

    if product['category'] == 'cpu' and 'Intel' in product['name']:
        product['image'] = f'/products/cpu/intel-{n}.jpg'
    else:
        product['image'] = f'/products/cpu/amd-{n}.jpg'

    


with open('products-images.json', 'w') as f:
    json.dump(products, f, indent=2)
