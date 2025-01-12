#!/bin/bash

# Container names
CONTAINER1="ollama1"
CONTAINER2="ollama2"
CONTAINER3="ollama3"
CONTAINER4="ollama4"

# Stop containers
echo "Stopping Ollama containers..."
docker stop $CONTAINER1 $CONTAINER2 $CONTAINER3 $CONTAINER4

echo "Containers stopped successfully!" 


# How to run the script
# chmod +x stop_ollama_containers.sh
# ./stop_ollama_containers.sh
