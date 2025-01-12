#!/bin/bash

# Container names
CONTAINER1="ollama1"
CONTAINER2="ollama2"
CONTAINER3="ollama3"
CONTAINER4="ollama4"

# Run qwen model in first container
echo "Starting qwen2.5 model in first container..."
docker exec -d $CONTAINER1 ollama run qwen2.5:1.5b

# Run qwen model in second container
echo "Starting qwen2.5 model in second container..."
docker exec -d $CONTAINER2 ollama run qwen2.5:1.5b

# Run qwen model in third container
echo "Starting qwen2.5 model in third container..."
docker exec -d $CONTAINER3 ollama run qwen2.5:1.5b

# Run qwen model in fourth container
echo "Starting qwen2.5 model in fourth container..."
docker exec -d $CONTAINER4 ollama run qwen2.5:1.5b

echo "Models are now running in all containers! It will download approx 4GB of data in total (according to the model size * 4). Ensure models are downloaded in each container before running the load test." 


# How to run the script
# chmod +x run_ollama_containers.sh
# ./run_ollama_containers.sh
# Check docker stats by running: `docker stats` to see if the containers are running


# How to test the containers
# Go inside of the container by running: `docker exec -it ollama1 /bin/bash`
# Verify ollama is running the model by running: `ollama ps`
# If you don't see the model running, you can run: `ollama run qwen2.5:1.5b` by yourself
# If you want to run the load test, you can run: `node ollama-multi.js`
