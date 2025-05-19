#!/bin/bash

# Load environment variables
if [ -f .env ]; then
    source .env
else
    echo ".env file not found. Please create one."
    exit 1
fi

# Does DATA FOLDER exists as env variable in the file?
if [ -z "$DATA_FOLDER" ]; then
    echo "DATA_FOLDER is not set in .env file."
    exit 1
fi

create_data_folder() {
    mkdir -p "$DATA_FOLDER"
    sudo chown -R 999:999 "$DATA_FOLDER"
}

clean() {
    sudo rm -rf "$DATA_FOLDER"
}

up() {
    docker compose up
}

build() {
    docker compose build
}

down() {
    docker compose down
}

case "$1" in
    all)
        create_data_folder
        build
        up;;
    clean)
        clean;;
    up)
        up;;
    build)
        build;;
    down)
        down;;
    stop)
        stop;;
    prune)
        prune;;
    *)
        echo "Usage: $0 {all|clean|up|build|down|stop|prune}"
        exit 1;;
esac
