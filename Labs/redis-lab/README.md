## Redis Lab

### Redis Setup

Launch a Redis server using Docker:

```bash
docker run -d --name bdnr-redis -v ${PWD}/redis-data:/data -p 6379:6379 redis
```

Check if the Redis server container is running:

```bash
docker ps
```

Start a Redis CLI session:

```bash
docker run -it --rm --network container:bdnr-redis redis redis-cli
```

Test the access sending `ping` and expecting `PONG`.

### Keys, Strings

- `SET a 10` - Set a key `a` with value `10`.
- `GET a` - Get the value of key `a`.
- `DEL a` - Delete key `a`.
- `EXISTS a` - Check if key `a` exists.
- `KEYS *` - List all keys.
- `EXPIRE a 10` - Set a key `a` to expire in 10 seconds.
- `TTL a` - Get the time to live of key `a`.
- `PERSIST a` - Remove the expiration of key `a`.
- `TYPE a` - Get the type of key `a`.
- `INCR a` - Increment the value of key `a`.
- `DECR a` - Decrement the value of key `a`.
- `INCRBY a 5` - Increment the value of key `a` by 5.
- `MSET a 10 b 20 c 30` - Set multiple keys at once.
- `MGET a b c` - Get multiple keys at once.
- etc.

### PHP Redis Client

Install the PHP Redis client:

```bash
cd redis-data
composer require predis/predis
```

Run the set PHP script to populate the Redis server:

```bash
php redis-set.php
```

Run the main PHP script to interact with the Redis server:

```bash
cd ../
php -S localhost:8000
```