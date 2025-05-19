all: clean start populate php

down: stop clean

start:
	docker start bdnr-redis

stop:
	docker stop bdnr-redis
	pidof php | xargs kill -9

clean:
	@if [ -d "../redis-data" ]; then rm -rf "../redis-data"; fi

populate:
	php redis-data/redis-set.php

php:
	php -S localhost:8080

redis:
	docker run -d --rm \
	--name bdnr-redis \
	-v ${PWD}/redis-data:/data \
	-p 6379:6379 \
	redis

redis-cli:
	docker run -it --rm \
	--network container:bdnr-redis redis \
	redis-cli
	
.SILENT: