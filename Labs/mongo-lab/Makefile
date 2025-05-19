up: mongo start php

down: stop clean

start:
	docker start bdnr-mongo

stop:
	docker stop bdnr-mongo

clean:
	docker rm bdnr-mongo

php:
	php -S localhost:8080

populate:
	php insert_data.php

mongo:
	docker run -d \
	--name bdnr-mongo \
	-v ${PWD}/mongo-data:/data/db \
	-p 27017:27017 \
	mongo

mongo-cli:
	docker run -it --rm \
	--network container:bdnr-mongo \
	mongo mongosh
	
.SILENT: