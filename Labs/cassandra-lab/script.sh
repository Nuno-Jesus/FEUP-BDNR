#!/bin/bash

CONTAINER="bdnr-cassandra"
NET="bdnr-cassandra-net"

start() {

    if ! [ "$(docker network ls -q -f name=$NET)" ]; then
        docker network create ${NET}
    fi

    if ! [ "$(docker ps -aq -f name=$CONTAINER)" ]; then
        docker run -d --rm \
            --name ${CONTAINER} \
            --network ${NET} \
            -v ${PWD}/cassandra-data:/var/lib/cassandra \
            -p 9042:9042 \
            -e MAX_HEAP_SIZE=512M \
            -e HEAP_NEWSIZE=100M \
            cassandra
    fi
}

stop () {    
    if [ "$(docker ps -aq -f name=$CONTAINER)" ]; then
        docker stop $CONTAINER
    fi

}

cli() {
    docker run -it --rm \
        --network $NET \
        cassandra cqlsh $CONTAINER  
}

while getopts "src" opt; do
    case ${opt} in
        r ) start ;;
        s ) stop ;;
        c ) cli ;;
    esac
done

