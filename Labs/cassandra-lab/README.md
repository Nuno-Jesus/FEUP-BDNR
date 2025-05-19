# Setup

1. Start the Cassandra + Flask app. This will only start the Flask container once the Cassandra container is healthy, which might take a while.

```bash
docker compose up --build
```

2. Run `./populate.py` to populate the database with the data

```bash 
python3 populate.py
```
