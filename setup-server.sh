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

# Create users and set up SSH
log "Creating users and configuring SSH..."

# Create geir user
log "Setting up user: geir"
sudo_run useradd -m -s /bin/bash geir
sudo_run usermod -aG sudo geir

# Set up welcome message for geir
cat << 'EOL' | sudo_run tee -a /home/geir/.bashrc
echo "Welcome to the HelpDesk Server, Geir!"
echo "===============================>"
echo "Server Status:"
echo "- Load Average: $(uptime | awk -F'load average:' '{ print $2 }')"
echo "- Disk Usage: $(df -h / | awk 'NR==2 {print $5}')"
echo "- Memory Usage: $(free -h | awk '/^Mem/ {print $3"/"$2}')"
echo "===============================>"
EOL

# Set up SSH directory for geir
sudo_run mkdir -p /home/geir/.ssh
sudo_run touch /home/geir/.ssh/authorized_keys
sudo_run chown -R geir:geir /home/geir/.ssh
sudo_run chmod 700 /home/geir/.ssh
sudo_run chmod 600 /home/geir/.ssh/authorized_keys

# Add geir's SSH keys
cat << 'EOL' | sudo_run tee /home/geir/.ssh/authorized_keys
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAINaz9F92MfdzWwt48AV/IV2vPLyeUDLSWcxcz4vAT3xl
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAID6Z9U0XvlDlSFOHZrlSIfM14J6V6TId/O1x8cVjS1zB
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIDpEkOGW4xXjrjn19qFWfbS5vtnQCaYQQhNMXXD9MpeM
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIFjmEi93xypzRNt8H9ulJ63OQ9tCT8CcK1yNyHPZLX7F
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIAqA0AgzyQLKbjEZYYA+EpM6lyRdKsJwa0444syRD/tm
EOL

# Create monica user
log "Setting up user: monica"
sudo_run useradd -m -s /bin/bash monica
sudo_run usermod -aG sudo monica

# Set up welcome message for monica
cat << 'EOL' | sudo_run tee -a /home/monica/.bashrc
echo "Welcome to the HelpDesk Server, Monica!"
echo "===============================>"
echo "Server Status:"
echo "- Load Average: $(uptime | awk -F'load average:' '{ print $2 }')"
echo "- Disk Usage: $(df -h / | awk 'NR==2 {print $5}')"
echo "- Memory Usage: $(free -h | awk '/^Mem/ {print $3"/"$2}')"
echo "===============================>"
EOL

# Set up SSH directory for monica
sudo_run mkdir -p /home/monica/.ssh
sudo_run touch /home/monica/.ssh/authorized_keys
sudo_run chown -R monica:monica /home/monica/.ssh
sudo_run chmod 700 /home/monica/.ssh
sudo_run chmod 600 /home/monica/.ssh/authorized_keys

# Add monica's SSH key
cat << 'EOL' | sudo_run tee /home/monica/.ssh/authorized_keys
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQCsoAXfKBNbQ8F+z1jOK95+MgEN8vrF60/fi4YEWihcFkMdqQHD+1Jb8ENl+aoNc5UO8wRdEmLX6bihyyJUtsQgsUyjQQld0L1vIEmBLkuFUJsjzzd88q55BiIhE9Cw/9qsNoPW/ojQoiiEl9fBAxCjSeieztbJtNI6xJ0Py0EYdvacjjmDz41MeRR8Z3IH/FXzODd3Z1gUmR0rnxteITx4GqnhNLd3PiPiRcTnHX99Je3dTFQzKYvBzo6PCPflTNWGe+4HaKHQbKV5coEqjtCbwsuYg9Cz/ytBImqsYDKEocRBoPGwh/UMKJ3IriPMsyJgSMi1dqeAGHf/koTlRda5uKS0WsAFZyiBwR6n00YWDOVnpA27ye7Jxi3sjQBSwWvkB8SIolbaAXisD/v5BHvyNpdAddTFhBu9yFXZ11vQugs0M+3wy21AMlny+MD3AIHuxaRQ5JQUoCdg6ITiF7qq4UrLXna0lWluXr28KlfquNL3jGBiJIFEWqDxMZDFULE= monica@Monica-sin-MacBook-Pro.local
EOL

# Configure SSH security
log "Configuring SSH security settings..."
sudo_run sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo_run sed -i 's/PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo_run systemctl restart sshd

# ...existing code...

# Configure SSH security
log "Configuring SSH security settings..."
sudo_run sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo_run sed -i 's/PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config

# Add SSH security configurations with Match blocks
cat << 'EOL' | sudo_run tee -a /etc/ssh/sshd_config

# Global SSH settings
PermitRootLogin no
MaxAuthTries 3
ClientAliveInterval 300
ClientAliveCountMax 2

# Match block for developer access
Match User dev
    PasswordAuthentication no
    MaxSessions 10

# Match block for admin users
Match User geir,monica
    MaxSessions 3

EOL

# Restart SSH service to apply changes
sudo_run systemctl restart sshd

# ...existing code...

# Install and configure UFW firewall
log "Installing and configuring UFW firewall..."
sudo_run apt install -y ufw

# Set default policies
sudo_run ufw default deny incoming
sudo_run ufw default allow outgoing

# Allow SSH (port 22)
sudo_run ufw allow ssh

# Allow HTTP (port 80)
sudo_run ufw allow http

# Allow HTTPS (port 443) for future SSL setup
sudo_run ufw allow https

# Enable UFW
log "Enabling UFW firewall..."
echo "y" | sudo_run ufw enable

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
MONGODB_URI=mongodb://10.12.14.179:27017/helpdesk
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
    listen 80 default_server;
    listen [::]:80 default_server;

    server_name _;  # Change this to your domain name if you have one

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
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