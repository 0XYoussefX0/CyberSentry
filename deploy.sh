#!/bin/bash

# Update package list and upgrade existing packages
sudo apt update && sudo apt upgrade -y

# Get the env variables needed to run the app
if [ -f .env ]; then
      echo ".env already exists, skipping download"
else
      sudo curl -o .env https://raw.githubusercontent.com/0XYoussefX0/CyberSentry/refs/heads/main/.env.example
      echo "a .env file has been added in this directory, open it and populate it with the right values before procceding with the deployment."
      exit 1
fi

# Script Vars
REPO_URL="https://github.com/0XYoussefX0/CyberSentry"
APP_DIR=./myapp
SWAP_SIZE="1G"  # Swap size of 1GB
DOMAIN_NAME="$(grep '^DOMAIN_NAME=' .env | cut -d '=' -f2-)"
SERVER_PUBLIC_IP=$(grep '^SERVER_PUBLIC_IP=' .env | cut -d '=' -f2-)
ENV=$(grep '^ENV=' .env | cut -d '=' -f2-)
EMAIL=$(grep '^EMAIL=' .env | cut -d '=' -f2-)
TURN_SECRET=$(grep '^TURN_SECRET=' .env | cut -d '=' -f2-)

# Enable the firewall and allow ports needed by the application
sudo ufw enable

# HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# TURN
sudo ufw allow 5349/tcp
sudo ufw allow 5349/udp

# STUN
sudo ufw allow 3478/udp
sudo ufw allow 3478/tcp

# rtcMinPort/rtcMaxPort
sudo ufw allow 10000:10100/udp

# port range for relay
sudo ufw allow 49152:65535/udp

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
sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

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

    location /frontend {
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
    
    location /backend {
        proxy_pass http://localhost:4000;
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

echo 'Setting up coturn for TURN AND STUN servers'

# Installing Coturn for TURN AND STUN Servers
sudo apt install coturn

# Configuring coturn
sudo cat > /etc/turnserver.conf <<EOL

    # Basic listening ports for STUN and TURN
    listening-port=3478
    tls-listening-port=5349
    listening-ip=$SERVER_PUBLIC_IP    

    # Authentication and Security
    fingerprint
    lt-cred-mech
    static-auth-secret=$TURN_SECRET  
    realm=$DOMAIN_NAME                 

    # Relay port range
    min-port=49152
    max-port=65535

    # Using Let's Encrypt certificates
    cert=/etc/letsencrypt/live/$DOMAIN_NAME/fullchain.pem
    pkey=/etc/letsencrypt/live/$DOMAIN_NAME/privkey.pem

    # Performance Settings
    max-allocate-lifetime=3600       

    # Logging Configuration
    log-file=/var/log/turnserver.log

EOL

# Conditionally append the verbose line in dev env
if [ "$ENV" = "development" ]; then
    echo "verbose" | sudo tee -a /etc/turnserver.conf > /dev/null
fi

# Have the turnserver running as an automatic system service daemon
sudo cat > /etc/default/coturn <<EOL

  TURNSERVER_ENABLED=1

EOL

# Enable and start the service
sudo systemctl enable coturn
sudo systemctl start coturn

# increasing file descriptor limits
sudo cat > /etc/security/limits.conf <<EOL

    * soft nofile 1048576
    * hard nofile 1048576
    turnserver soft nofile 1048576
    turnserver hard nofile 1048576

EOL

# optmizing network performance 
sudo cat > /etc/sysctl.conf <<EOL

    net.core.rmem_max=8388608
    net.core.wmem_max=8388608
    net.ipv4.ip_local_port_range=10000 65000

EOL

# Apply sysctl changes
sudo sysctl -p

if ! systemctl is-active --quiet coturn; then
    echo "Coturn installation has failed."
    exit 1
fi

# Build and run the Docker containers from the app directory (~/myapp)
cd $APP_DIR
sudo docker-compose up --build -d

# Check if Docker Compose started correctly
if ! sudo docker-compose ps | grep "Up"; then
  echo "Docker containers failed to start. Check logs with 'docker-compose logs'."
  exit 1
fi

# Output final message
echo "Deployment complete. One thing you should do is add this line of code: renew_hook = systemctl reload nginx && systemctl reload coturn under [renewalparams] inside this file: /etc/letsencrypt/renewal/$DOMAIN_NAME.conf"