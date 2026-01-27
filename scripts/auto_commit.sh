#!/bin/bash

# Auto stage and commit script
# This script adds all changes and commits them with a timestamp.

# Get current timestamp
TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")

# Add all changes
git add .

# Commit with timestamp message
git commit -m "Auto commit: $TIMESTAMP"

# Push to origin main (optional, uncomment if desired)
# git push origin main

echo "Changes committed with message: Auto commit: $TIMESTAMP"
