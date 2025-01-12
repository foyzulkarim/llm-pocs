#!/bin/bash

# Container names
CONTAINER1="ollama1"
CONTAINER2="ollama2"
CONTAINER3="ollama3"
CONTAINER4="ollama4"

# sample command: docker run -d --gpus=all -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama

# Create and start first Ollama container
echo "Starting first Ollama container..."
docker run -d \
  --gpus=all \
  -v ollama:/root/.ollama \
  --name $CONTAINER1 \
  -p 11435:11434 \
  ollama/ollama

# Create and start second Ollama container
echo "Starting second Ollama container..."
docker run -d \
  --gpus=all \
  -v ollama:/root/.ollama \
  --name $CONTAINER2 \
  -p 11436:11434 \
  ollama/ollama

# Create and start third Ollama container
echo "Starting third Ollama container..."
docker run -d \
  --gpus=all \
  -v ollama:/root/.ollama \
  --name $CONTAINER3 \
  -p 11437:11434 \
  ollama/ollama

# Create and start fourth Ollama container
echo "Starting fourth Ollama container..."
docker run -d \
  --gpus=all \
  -v ollama:/root/.ollama \
  --name $CONTAINER4 \
  -p 11438:11434 \
  ollama/ollama

echo "Containers created successfully!"


# How to run the script
# chmod +x create_ollama_containers.sh
# ./create_ollama_containers.sh
