#!/bin/bash

# Update package list and upgrade existing packages
sudo apt update && sudo apt upgrade -y

# Get the env variables needed to run the app
if [ -f .env ]; then
      echo ".env already exists, skipping download"
else
      sudo curl -o ./.env https://raw.githubusercontent.com/0XYoussefX0/CyberSentry/refs/heads/main/.env.example
      echo "a .env file has been added to the current directory, open it and populate it with the right values before procceding with the deployment."
      exit 1
fi

# Script Vars
REPO_URL="https://github.com/0XYoussefX0/CyberSentry"
APP_DIR=./myapp
SWAP_SIZE="1G"  # Swap size of 1GB

# Loading env variables
source ./.env

# Enable the firewall and allow ports needed by the application
sudo ufw enable

# HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# rtcMinPort/rtcMaxPort
sudo ufw allow 10000:10100/udp

# SSH
sudo ufw allow ssh

# Add Swap Space
echo "Adding swap space..."
sudo fallocate -l $SWAP_SIZE /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make swap permanent
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Install Docker
sudo apt install apt-transport-https ca-certificates curl software-properties-common -y
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" -y
sudo apt update
sudo apt install docker-ce -y

# Install Docker Compose
sudo rm -f /usr/local/bin/docker-compose
LATEST_COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep '"tag_name":' | cut -d'"' -f4)
sudo curl -L "https://github.com/docker/compose/releases/download/$LATEST_COMPOSE_VERSION/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Wait for the file to be fully downloaded before proceeding
if [ ! -f /usr/local/bin/docker-compose ]; then
  echo "Docker Compose download failed. Exiting."
  exit 1
fi

sudo chmod +x /usr/local/bin/docker-compose

# Ensure Docker Compose is executable and in path
sudo ln -sf /usr/local/bin/docker-compose /usr/bin/docker-compose

# Verify Docker Compose installation
docker-compose --version
if [ $? -ne 0 ]; then
  echo "Docker Compose installation failed. Exiting."
  exit 1
fi

# Ensure Docker starts on boot and start Docker service
sudo systemctl enable docker
sudo systemctl start docker

# Clone the Git repository
if [ -d "$APP_DIR" ]; then
  echo "Directory $APP_DIR already exists. Pulling latest changes..."
  cd $APP_DIR && git pull
else
  echo "Cloning repository from $REPO_URL..."
  git clone $REPO_URL $APP_DIR
  cd $APP_DIR
  # copying .env file to the app directory
  cp ../.env ./
fi


# Install Nginx
sudo apt install nginx -y

# Remove old Nginx config (if it exists)
sudo rm -f /etc/nginx/sites-available/myapp
sudo rm -f /etc/nginx/sites-enabled/myapp

# Stop Nginx temporarily to allow Certbot to run in standalone mode
sudo systemctl stop nginx

# Obtain SSL certificate using Certbot standalone mode
sudo apt install certbot -y
sudo certbot certonly --standalone -d $DOMAIN_NAME --non-interactive --agree-tos -m $EMAIL --debug

# Ensure SSL files exist or generate them
if [ ! -f /etc/letsencrypt/options-ssl-nginx.conf ]; then
  sudo wget https://raw.githubusercontent.com/certbot/certbot/main/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf -P /etc/letsencrypt/
fi

if [ ! -f /etc/letsencrypt/ssl-dhparams.pem ]; then
  sudo openssl dhparam -out /etc/letsencrypt/ssl-dhparams.pem 2048
fi

# Create Nginx config with reverse proxy, SSL support, rate limiting, and streaming support
sudo cat > /etc/nginx/sites-available/myapp <<EOL
limit_req_zone \$binary_remote_addr zone=mylimit:10m rate=10r/s;

server {
    listen 80;
    server_name $DOMAIN_NAME;

    # Redirect all HTTP requests to HTTPS
    return 301 https://\$host\$request_uri;
}

server {
    listen 443 ssl;
    server_name $DOMAIN_NAME;

    ssl_certificate /etc/letsencrypt/live/$DOMAIN_NAME/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN_NAME/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Enable rate limiting
    limit_req zone=mylimit burst=20 nodelay;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;

        # Disable buffering for streaming support
        proxy_buffering off;
        proxy_set_header X-Accel-Buffering no;
    }
    
    location /api {
        proxy_pass http://localhost:4000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;

        # Disable buffering for streaming support
        proxy_buffering off;
        proxy_set_header X-Accel-Buffering no;
    }
    
}
EOL

# Create symbolic link if it doesn't already exist
sudo ln -s /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled/myapp

# Restart Nginx to apply the new configuration
sudo systemctl restart nginx

# Build and run the Docker containers from the app directory (./myapp)
sudo docker compose -f docker-compose.yml up --build -d

# Check if Docker Compose started correctly
if ! sudo docker compose ps | grep "Up"; then
  echo "Docker containers failed to start. Check logs with 'docker-compose logs'."
  exit 1
fi

# Output final message
echo "Deployment complete. Don't forget to set the access permission of the public-assets and the profile pictures buckets to download using this command: mc anonymous set download ALIAS/BUCKET_NAME"