#!/bin/bash

# SSL Setup Script for Attendance App
# This script helps you set up SSL certificates using Let's Encrypt

echo "=== SSL Setup for Attendance App ==="
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "Please run this script as root (use sudo)"
    exit 1
fi

# Install certbot if not already installed
if ! command -v certbot &> /dev/null; then
    echo "Installing certbot..."
    apt update
    apt install -y certbot
fi

# Stop nginx temporarily to free up port 80
echo "Stopping nginx temporarily..."
docker-compose stop nginx

# Request certificate
echo "Requesting SSL certificate from Let's Encrypt..."
certbot certonly --standalone -d attendance-app.com -d www.attendance-app.com

# Check if certificate was obtained successfully
if [ -f "/etc/letsencrypt/live/attendance-app.com/fullchain.pem" ]; then
    echo "Certificate obtained successfully!"
    
    # Create ssl directory if it doesn't exist
    mkdir -p ssl
    
    # Copy certificates to project directory
    echo "Copying certificates to project directory..."
    cp /etc/letsencrypt/live/attendance-app.com/fullchain.pem ssl/
    cp /etc/letsencrypt/live/attendance-app.com/privkey.pem ssl/
    
    # Set proper permissions
    chmod 644 ssl/fullchain.pem
    chmod 600 ssl/privkey.pem
    
    echo "SSL certificates are ready!"
    echo "You can now start your application with: docker-compose up -d"
    
    # Create renewal script
    cat > renew-ssl.sh << 'EOF'
#!/bin/bash
# Script to renew SSL certificates
certbot renew
cp /etc/letsencrypt/live/attendance-app.com/fullchain.pem ssl/
cp /etc/letsencrypt/live/attendance-app.com/privkey.pem ssl/
docker-compose restart nginx
EOF
    
    chmod +x renew-ssl.sh
    echo "Created renew-ssl.sh script for certificate renewal"
    
else
    echo "Failed to obtain SSL certificate. Please check your domain configuration."
    exit 1
fi

echo ""
echo "=== Setup Complete ==="
echo "Your application is now ready for HTTPS!"
echo "Access your app at: https://attendance-app.com" 