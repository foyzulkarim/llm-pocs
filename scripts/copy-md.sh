#!/bin/bash

# Set the source and destination directories
src_dir="/home/foyzul/personal/public-repo/react/packages"
dest_dir="$HOME/Documents/markdowns"

# Find all markdown files in the source directory and its subdirectories
find "$src_dir" -type f -name "*.md" -print0 | while IFS= read -r -d '' file; do
    # Get the relative path of the file from the source directory
    relative_path="${file#$src_dir/}"
    
    # Create the destination directory path
    dest_path="$dest_dir/${relative_path%/*}"
    
    # Create the destination directory if it doesn't exist
    mkdir -p "$dest_path"
    
    # Copy the markdown file to the destination directory
    cp "$file" "$dest_path"
done
