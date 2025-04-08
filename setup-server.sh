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
sudo_run apt install -y curl git build-essential

# Install FNM (Fast Node Manager)
log "Installing FNM..."
curl -fsSL https://fnm.vercel.app/install | bash

# Add FNM to bash profile
log "Configuring FNM..."
echo 'eval "$(fnm env --use-on-cd)"' >> ~/.bashrc
source ~/.bashrc

# Install Node.js
log "Installing Node.js..."
fnm install --latest
fnm use --latest

# Install PM2 globally
log "Installing PM2..."
npm install -g pm2

# Create application directory
APP_DIR="/var/www/helpdesk"
log "Creating application directory at $APP_DIR..."
sudo_run mkdir -p "$APP_DIR"
sudo_run chown -R $USER:$USER "$APP_DIR"

# Clone the repository
log "Cloning repository..."
git clone https://github.com/your-username/helpdesk.git "$APP_DIR"
cd "$APP_DIR"

# Create .env file
log "Creating .env file..."
cat > .env << EOL
MONGODB_URI=mongodb://localhost:27017/helpdesk
JWT_SECRET=$(openssl rand -base64 32)
PORT=80
NODE_ENV=production
EOL

# Install dependencies
log "Installing project dependencies..."
npm install --production

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
      PORT: 80
    }
  }]
}
EOL

# Start application with PM2
log "Starting application with PM2..."
sudo_run pm2 start ecosystem.config.js
pm2 save
sudo_run env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp $HOME

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

Default Admin Account:
- Email: admin@helpdesk.com
- Password: Admin123!

Next Steps:
1. Update the admin password
2. Configure MongoDB if needed
3. Consider setting up a firewall (ufw)
4. Consider setting up SSL/TLS

Configuration Tips:
- The app runs directly on port 80
- PM2 runs in cluster mode for better performance
- Auto-restart is enabled
====================================
EOL