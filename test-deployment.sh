#!/bin/bash

# Test Deployment Script
# This script tests the auto-deployment setup

echo "=== Testing Auto-Deployment Setup ==="

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: docker-compose.yml not found. Make sure you're in the project directory."
    exit 1
fi

# Check if git is configured
if ! git remote -v | grep -q "origin"; then
    echo "❌ Error: Git remote 'origin' not configured."
    exit 1
fi

# Check if we can pull from origin
echo "Testing git pull..."
if git pull origin main --dry-run; then
    echo "✅ Git pull test successful"
else
    echo "❌ Git pull test failed"
    exit 1
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running"
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Error: docker-compose not found"
    exit 1
fi

# Test docker-compose
echo "Testing docker-compose..."
if docker-compose config > /dev/null 2>&1; then
    echo "✅ Docker-compose configuration is valid"
else
    echo "❌ Docker-compose configuration has errors"
    exit 1
fi

echo "✅ All tests passed! Your deployment setup is ready."
echo ""
echo "Next steps:"
echo "1. Add GitHub secrets (EC2_HOST, EC2_USERNAME, EC2_SSH_KEY)"
echo "2. Push this commit to trigger the first deployment"
echo "3. Check GitHub Actions tab to monitor deployment" 