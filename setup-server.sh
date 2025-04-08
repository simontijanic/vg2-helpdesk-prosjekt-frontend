#!/bin/bash

# Update system
sudo apt update
sudo apt upgrade -y

# Install required packages
sudo apt install -y curl git build-essential

# Install FNM
curl -fsSL https://fnm.vercel.app/install | bash

# Add FNM to bash profile
echo 'eval "$(fnm env --use-on-cd)"' >> ~/.bashrc
source ~/.bashrc

# Install Node.js
fnm install --latest
fnm use --latest

# Install PM2 globally
npm install -g pm2

# Create app directory if it doesn't exist
mkdir -p /var/www/helpdesk
cd /var/www/helpdesk

# Install project dependencies
npm install --production

# Start the application with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup