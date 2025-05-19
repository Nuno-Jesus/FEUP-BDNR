up: neo4j start php

down: stop clean

start:
	docker start bdnr-neo4j

stop:
	docker stop bdnr-neo4j
	pkill -f "php -S localhost:8080"

clean:
	docker rm bdnr-neo4j

php:
	php -S localhost:8080

populate:
	php neo4j-insert.php

neo4j:
	docker run -d \
	--name bdnr-neo4j --rm 	\
	-v ${PWD}/neo4j-data:/data \
	-p 7474:7474 \
	-p 7687:7687 \
	neo4j
	
.SILENT: