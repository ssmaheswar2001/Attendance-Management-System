#!/bin/bash

# HTTPS Deployment Script for Attendance App
echo "=== Deploying HTTPS for Attendance App ==="
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "Please run this script as root (use sudo)"
    exit 1
fi

# Stop current services
echo "Stopping current services..."
docker-compose down

# Check if SSL certificates exist
if [ ! -f "ssl/fullchain.pem" ] || [ ! -f "ssl/privkey.pem" ]; then
    echo "SSL certificates not found in ssl/ directory"
    echo "Please run setup-ssl.sh first to obtain certificates"
    exit 1
fi

# Build and start services
echo "Building and starting services with HTTPS..."
docker-compose up -d --build

# Check if services are running
echo "Checking service status..."
sleep 10
docker-compose ps

# Test HTTPS
echo ""
echo "Testing HTTPS connection..."
if curl -s -o /dev/null -w "%{http_code}" https://attendance-app.com | grep -q "200\|301\|302"; then
    echo "✅ HTTPS is working!"
    echo "Your application is now accessible at: https://attendance-app.com"
else
    echo "❌ HTTPS test failed. Please check the logs:"
    echo "docker-compose logs nginx"
    echo "docker-compose logs frontend"
    echo "docker-compose logs backend"
fi

echo ""
echo "=== Deployment Complete ==="
echo "If you encounter any issues, check the logs with:"
echo "docker-compose logs [service-name]" 