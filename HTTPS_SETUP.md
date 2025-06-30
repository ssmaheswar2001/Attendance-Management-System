# HTTPS Setup Guide for Attendance App

This guide will help you convert your attendance application from HTTP to HTTPS.

## Prerequisites

- Your application is currently running on EC2
- You have a domain (attendance-app.com) configured with Route 53
- Docker and Docker Compose are installed on your EC2 instance

## Step 1: Update Your Application

The following files have been updated to support HTTPS:

1. **docker-compose.yml** - Added nginx service for SSL termination
2. **nginx/default.conf** - Updated nginx configuration for HTTPS
3. **frontend/src/config.js** - Added configuration for API URLs
4. **frontend/src/pages/Login.js** - Updated to use new configuration
5. **frontend/Dockerfile** - Set production environment

## Step 2: Get SSL Certificate

You have two options for obtaining an SSL certificate:

### Option A: Let's Encrypt (Free) - Recommended

1. SSH into your EC2 instance
2. Navigate to your project directory
3. Run the SSL setup script:
   ```bash
   chmod +x setup-ssl.sh
   sudo ./setup-ssl.sh
   ```

### Option B: AWS Certificate Manager

1. Go to AWS Certificate Manager console
2. Request a certificate for:
   - `attendance-app.com`
   - `*.attendance-app.com`
3. Validate using DNS validation
4. Download the certificate files
5. Place them in the `ssl/` directory:
   - `ssl/fullchain.pem`
   - `ssl/privkey.pem`

## Step 3: Deploy Your Application

1. Stop your current application:
   ```bash
   docker-compose down
   ```

2. Start the application with HTTPS:
   ```bash
   docker-compose up -d
   ```

3. Verify the services are running:
   ```bash
   docker-compose ps
   ```

## Step 4: Update Security Groups

Make sure your EC2 security group allows:
- Port 80 (HTTP) - for redirects
- Port 443 (HTTPS) - for secure traffic

## Step 5: Test Your Application

1. Visit `https://attendance-app.com`
2. Verify that HTTP requests redirect to HTTPS
3. Test all functionality (login, registration, attendance, etc.)

## Step 6: Certificate Renewal (Let's Encrypt only)

If you used Let's Encrypt, certificates expire after 90 days. To renew:

```bash
sudo ./renew-ssl.sh
```

You can set up a cron job to auto-renew:
```bash
# Add to crontab (run monthly)
0 0 1 * * /path/to/your/project/renew-ssl.sh
```

## Troubleshooting

### Certificate Issues
- Ensure your domain points to your EC2 instance
- Check that ports 80 and 443 are open
- Verify certificate files are in the correct location

### Application Issues
- Check nginx logs: `docker-compose logs nginx`
- Check frontend logs: `docker-compose logs frontend`
- Check backend logs: `docker-compose logs backend`

### Common Issues
1. **Mixed Content Errors**: Ensure all API calls use HTTPS
2. **CORS Issues**: Backend should allow HTTPS origins
3. **Certificate Not Trusted**: Verify certificate is properly installed

## Security Headers

The nginx configuration includes security headers:
- HSTS (HTTP Strict Transport Security)
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection

## Performance

- HTTP/2 is enabled for better performance
- SSL session caching is configured
- Modern cipher suites are used

## Backup

Before making changes, backup your current setup:
```bash
cp docker-compose.yml docker-compose.yml.backup
cp -r nginx nginx.backup
```

## Rollback

If you need to rollback to HTTP:
```bash
docker-compose down
cp docker-compose.yml.backup docker-compose.yml
docker-compose up -d
```

Your application should now be accessible via HTTPS at `https://attendance-app.com`! 