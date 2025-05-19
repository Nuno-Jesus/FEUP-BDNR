#!/bin/bash

echo "Creating database..."

curl -s 'http://localhost:8080/admin/databases?name=Pc-Parts&replicationFactor=1' \
  -X 'PUT' \
  --data-raw '{"DatabaseName":"Pc-Parts","Settings":{},"Disabled":false,"Encrypted":false,"Topology":{"DynamicNodesDistribution":false}}' \
  --compressed > /dev/null

echo "Creating indexes..."

curl -X PUT "http://localhost:8080/databases/Pc-Parts/indexes" \
  -H "Content-Type: application/json" \
  -d '{
    "Indexes": [
      {
        "Name": "Products/MoreLikeThis",
        "Maps": [
          "map(\"Products\", product => ({ category: product.category }))"
        ],
        "Fields": {
          "category": {
            "Indexing": "Exact",
            "Storage": "Yes"
          }
        }
      }
    ]
  }'\
  --compressed > /dev/null

cd upload
echo 'Uploading products...'
python3 ./upload_products.py
echo 'Uploading users...'
python3 ./upload_users.py
cd ..
