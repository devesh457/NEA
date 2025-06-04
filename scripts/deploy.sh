#!/bin/bash

echo "Starting deployment process..."

# Pull latest changes
echo "Pulling latest changes from git..."
git pull origin master

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the Next.js application
echo "Building Next.js application..."
npm run build

# Stop PM2 processes
echo "Stopping PM2 processes..."
pm2 stop all

# Start PM2 processes
echo "Starting PM2 processes..."
pm2 start ecosystem.config.js

# Test and reload Nginx configuration
echo "Testing Nginx configuration..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "Nginx configuration is valid. Reloading Nginx..."
    sudo systemctl reload nginx
else
    echo "Nginx configuration test failed. Please check the configuration."
    exit 1
fi

# Show PM2 status
echo "PM2 Status:"
pm2 status

echo "Deployment completed successfully!"
echo "Your website should now be accessible at http://31.57.34.150" 