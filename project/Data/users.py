import random
import json
from faker import Faker

fake = Faker()

# Carrega os produtos do teu ficheiro products.json
with open("products.json", "r", encoding="utf-8") as f:
    products = [json.loads(line) for line in f]

def generate_user(user_index):
    username = fake.user_name()
    orders = []

    for _ in range(random.randint(0, 3)):
        num_items = random.randint(1, 2)
        selected_products = random.sample(products, num_items)

        items = [
            {
                "productName": product["name"],
                "quantity": random.randint(1, 3),
                "price": product.get("price", 0.0)  # Usa get para evitar KeyError e define um valor padrão
            }
            for product in selected_products
        ]

        orders.append({
            "date": fake.date_time_this_year().isoformat(),
            "items": items
        })

    return {
        "username": username,
        "email": fake.email(),
        "fullName": fake.name(),
        "passwordHash": "hashed_example_password",
        "address": {
            "street": fake.street_address(),
            "city": fake.city(),
            "postalCode": fake.postcode(),
            "country": fake.country()
        },
        "orders": orders,
        "@metadata": {
            "@collection": "Users"
        }
    }

# Gera 10 utilizadores
users = [generate_user(i + 1) for i in range(10)]

# Exporta como JSON
with open("users.json", "w", encoding="utf-8") as f:
    json.dump(users, f, ensure_ascii=False, indent=4)

print("Arquivo 'users.json' criado com sucesso.")