#!/bin/bash

# Simple SSL Certificate Initialization Script for Metis Client
# This script sets up Let's Encrypt SSL certificates using certbot

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${RED}Error: .env file not found. Please create it from .env.example${NC}"
    exit 1
fi

# Load environment variables
source .env

# Check if DOMAIN_NAME is set
if [ -z "$DOMAIN_NAME" ] || [ "$DOMAIN_NAME" = "your-domain.com" ]; then
    echo -e "${RED}Error: Please set DOMAIN_NAME in your .env file${NC}"
    exit 1
fi

echo -e "${GREEN}Setting up SSL certificates for domain: $DOMAIN_NAME${NC}"

# Create certbot directories
mkdir -p certbot/conf
mkdir -p certbot/www

# Check if certificates already exist
if [ -d "certbot/conf/live/$DOMAIN_NAME" ]; then
    echo -e "${YELLOW}Certificates already exist for $DOMAIN_NAME${NC}"
    echo -e "${YELLOW}To renew certificates, the certbot container will handle it automatically${NC}"
    exit 0
fi

echo -e "${YELLOW}Requesting initial SSL certificate from Let's Encrypt (standalone)...${NC}"

# Request certificate using certbot standalone (no nginx needed yet)
docker run --rm \
    -p 80:80 \
    -v $(pwd)/certbot/conf:/etc/letsencrypt \
    certbot/certbot certonly \
    --standalone \
    --preferred-challenges http \
    -m admin@$DOMAIN_NAME \
    --agree-tos \
    --no-eff-email \
    -d $DOMAIN_NAME

# Create stable symlink used by nginx
if [ -d "certbot/conf/live/$DOMAIN_NAME" ]; then
  mkdir -p certbot/conf/live/default || true
  rm -f certbot/conf/live/default/fullchain.pem certbot/conf/live/default/privkey.pem
  ln -s ../$DOMAIN_NAME/fullchain.pem certbot/conf/live/default/fullchain.pem
  ln -s ../$DOMAIN_NAME/privkey.pem certbot/conf/live/default/privkey.pem
fi

echo -e "${GREEN}SSL certificate successfully obtained!${NC}"
echo -e "${GREEN}You can now start your application with: npm run docker:compose:up${NC}"
echo -e "${YELLOW}Note: The certbot container will automatically renew certificates every 12 hours${NC}"
