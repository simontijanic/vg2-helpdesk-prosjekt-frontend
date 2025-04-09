#!/bin/bash

# HelpDesk Application Setup Script
# This script sets up the environment for running the HelpDesk application
# Designed for Ubuntu 22.04 Server

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to echo with timestamp
function log() {
  echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] $1${NC}"
}

function warn() {
  echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

function error() {
  echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
  exit 1
}

# Function to run commands with sudo
function sudo_run() {
  if sudo -n true 2>/dev/null; then
    sudo "$@"
  else
    echo -e "${YELLOW}Sudo password required for: $*${NC}"
    sudo "$@"
  fi
}

# Get server's IP address
SERVER_IP=$(hostname -I | awk '{print $1}')
if [ -z "$SERVER_IP" ]; then
  error "Could not determine server IP address"
fi

log "Server IP: $SERVER_IP"

# Update system
log "Updating system packages..."
sudo_run apt update
sudo_run apt upgrade -y

# Install required packages
log "Installing required packages..."
sudo_run apt install -y curl git build-essential nginx

# Install NVM
log "Installing NVM..."
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# Reload shell configuration
source ~/.bashrc

# Install Node.js
log "Installing Node.js..."
nvm install 18
nvm use 18

# Install PM2 globally (with full path)
log "Installing PM2..."
export PATH="$NVM_DIR/versions/node/$(node -v)/bin:$PATH"
npm install -g pm2

# Add PM2 to PATH permanently
log "Adding PM2 to PATH..."
if ! grep -q "export PATH=\"\$HOME/.nvm/versions/node/\$(node -v)/bin:\$PATH\"" ~/.bashrc; then
    echo 'export PATH="$HOME/.nvm/versions/node/$(node -v)/bin:$PATH"' >> ~/.bashrc
fi

# Reload shell configuration
source ~/.bashrc

# Create application directory
APP_DIR="/var/www/helpdesk"
log "Creating application directory at $APP_DIR..."
sudo_run mkdir -p "$APP_DIR"
sudo_run chown -R $USER:$USER "$APP_DIR"

# Clone the repository
log "Cloning repository..."
git clone https://github.com/simontijanic/vg2-helpdesk-prosjekt-frontend.git "$APP_DIR"
cd "$APP_DIR"

# Create .env file
log "Creating .env file..."
cat > .env << EOL
MONGODB_URI=mongodb://localhost:27017/helpdesk
JWT_SECRET=$(openssl rand -base64 32)
PORT=3000
NODE_ENV=production
EOL

# Install dependencies
log "Installing project dependencies..."
npm install

# Configure PM2 ecosystem file
log "Creating PM2 ecosystem config..."
cat > ecosystem.config.js << EOL
module.exports = {
  apps: [{
    name: 'helpdesk',
    script: 'index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
EOL

# Start application with PM2
log "Starting application with PM2..."
"$NVM_DIR/versions/node/$(node -v)/bin/pm2" start ecosystem.config.js
"$NVM_DIR/versions/node/$(node -v)/bin/pm2" save

# Configure Nginx
log "Configuring Nginx as reverse proxy..."
sudo_run tee /etc/nginx/sites-available/helpdesk << 'EOL'
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
EOL

# Enable the Nginx site
log "Enabling Nginx site..."
sudo_run rm -f /etc/nginx/sites-enabled/default
sudo_run ln -s /etc/nginx/sites-available/helpdesk /etc/nginx/sites-enabled/

# Test Nginx configuration
log "Testing Nginx configuration..."
sudo_run nginx -t

# Restart Nginx
log "Restarting Nginx..."
sudo_run systemctl restart nginx

# Save PM2 startup script
startup_script=$("$NVM_DIR/versions/node/$(node -v)/bin/pm2" startup | grep "sudo" | tail -n1)
eval "sudo $startup_script"

# Final setup
log "Setting up final configurations..."
sudo_run chown -R $USER:$USER "$APP_DIR"
sudo_run chmod -R 755 "$APP_DIR"

log "Application setup complete!"
cat << EOL

====================================
 HelpDesk System Setup Complete
====================================
- Web Interface: http://$SERVER_IP
- Application Directory: $APP_DIR
- Logs: pm2 logs helpdesk
- Restart App: pm2 restart helpdesk
- Nginx logs: /var/log/nginx/access.log and error.log

Default Admin Account:
- Email: admin@helpdesk.com
- Password: Admin123!

Next Steps:
1. Update the admin password
2. Configure MongoDB if needed
3. Consider setting up a firewall (ufw)
4. Consider setting up SSL/TLS with Let's Encrypt

Configuration Tips:
- The app runs on port 3000 (proxied through Nginx on port 80)
- PM2 runs in cluster mode for better performance
- Auto-restart is enabled
- Nginx is configured as a reverse proxy
====================================
EOL