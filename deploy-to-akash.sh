#!/bin/bash

# PrivacyAI Inference Server - Akash Deployment Script
# This script automates the deployment process to Akash Network

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
WALLET_NAME="my-wallet"
CHAIN_ID="akashnet-2"
NODE_URL="https://rpc.akash.forbole.com:443"
FEES="5000uakt"

echo -e "${BLUE}🚀 PrivacyAI Akash Deployment Script${NC}"
echo "========================================="

# Check if Akash CLI is installed
check_akash_cli() {
    if ! command -v akash &> /dev/null; then
        echo -e "${RED}❌ Akash CLI not found!${NC}"
        echo "Please install Akash CLI first:"
        echo "curl -sSfL https://raw.githubusercontent.com/akash-network/provider/main/install.sh | sh"
        exit 1
    fi
    echo -e "${GREEN}✅ Akash CLI found${NC}"
}

# Check wallet balance
check_wallet_balance() {
    echo -e "${BLUE}💰 Checking wallet balance...${NC}"
    BALANCE=$(akash query bank balances $(akash keys show $WALLET_NAME -a) --chain-id $CHAIN_ID --node $NODE_URL -o json | jq -r '.balances[0].amount // "0"')
    
    if [ "$BALANCE" -lt 5000000 ]; then
        echo -e "${YELLOW}⚠️  Low balance: ${BALANCE}uakt. Recommended: >5000000uakt${NC}"
        read -p "Continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo "Deployment cancelled."
            exit 1
        fi
    else
        echo -e "${GREEN}✅ Sufficient balance: ${BALANCE}uakt${NC}"
    fi
}

# Build and push Docker image
build_and_push_image() {
    echo -e "${BLUE}🐳 Building Docker image...${NC}"
    
    read -p "Enter your GitHub username: " GITHUB_USERNAME
    read -p "Enter your GitHub token: " -s GITHUB_TOKEN
    echo
    
    IMAGE_NAME="ghcr.io/$GITHUB_USERNAME/privacyai-inference:latest"
    
    # Build image
    cd inference
    docker build -t privacyai-inference:latest .
    docker tag privacyai-inference:latest $IMAGE_NAME
    
    # Login and push
    echo $GITHUB_TOKEN | docker login ghcr.io -u $GITHUB_USERNAME --password-stdin
    docker push $IMAGE_NAME
    
    # Update deploy.yaml with the correct image
    sed -i.bak "s|ghcr.io/yourusername/privacyai-inference:latest|$IMAGE_NAME|g" ../deploy.yaml
    
    cd ..
    echo -e "${GREEN}✅ Image built and pushed: $IMAGE_NAME${NC}"
}

# Customize deployment configuration
customize_deployment() {
    echo -e "${BLUE}⚙️  Customizing deployment...${NC}"
    
    read -p "Enter your provider ID (e.g., akash-provider-1): " PROVIDER_ID
    read -p "Enter your provider name (e.g., My Akash Provider): " PROVIDER_NAME
    
    # Update deploy.yaml with custom values
    sed -i.bak "s|PROVIDER_ID=akash-provider-1|PROVIDER_ID=$PROVIDER_ID|g" deploy.yaml
    sed -i.bak "s|PROVIDER_NAME=Akash AI Provider|PROVIDER_NAME=$PROVIDER_NAME|g" deploy.yaml
    sed -i.bak "s|/marketplace/v1/providers/akash-provider-1/|/marketplace/v1/providers/$PROVIDER_ID/|g" deploy.yaml
    
    echo -e "${GREEN}✅ Deployment customized${NC}"
}

# Create certificate if needed
create_certificate() {
    echo -e "${BLUE}📜 Checking for certificate...${NC}"
    
    CERT_COUNT=$(akash query cert list --owner $(akash keys show $WALLET_NAME -a) --chain-id $CHAIN_ID --node $NODE_URL -o json | jq '.certificates | length')
    
    if [ "$CERT_COUNT" -eq 0 ]; then
        echo -e "${YELLOW}📜 Creating certificate...${NC}"
        akash tx cert create client \
            --from $WALLET_NAME \
            --chain-id $CHAIN_ID \
            --node $NODE_URL \
            --fees $FEES
        echo -e "${GREEN}✅ Certificate created${NC}"
    else
        echo -e "${GREEN}✅ Certificate already exists${NC}"
    fi
}

# Deploy to Akash
deploy_to_akash() {
    echo -e "${BLUE}🚀 Deploying to Akash...${NC}"
    
    # Create deployment
    DEPLOY_OUTPUT=$(akash tx deployment create deploy.yaml \
        --from $WALLET_NAME \
        --chain-id $CHAIN_ID \
        --node $NODE_URL \
        --fees $FEES \
        -o json)
    
    DEPLOY_TX=$(echo $DEPLOY_OUTPUT | jq -r '.txhash')
    echo -e "${GREEN}✅ Deployment created. TX: $DEPLOY_TX${NC}"
    
    # Wait for deployment to be processed
    echo "Waiting for deployment to be processed..."
    sleep 10
    
    # Get deployment sequence
    DSEQ=$(akash query deployment list --owner $(akash keys show $WALLET_NAME -a) \
        --chain-id $CHAIN_ID \
        --node $NODE_URL \
        -o json | jq -r '.deployments[0].deployment.deployment_id.dseq')
    
    echo -e "${GREEN}✅ Deployment DSEQ: $DSEQ${NC}"
    
    # Wait for bids
    echo "Waiting for bids..."
    sleep 15
    
    # Show available bids
    echo -e "${BLUE}📋 Available bids:${NC}"
    akash query market bid list \
        --owner $(akash keys show $WALLET_NAME -a) \
        --chain-id $CHAIN_ID \
        --node $NODE_URL \
        -o json | jq -r '.bids[] | "\(.bid.bid_id.provider): \(.bid.price.amount)uakt"'
    
    # Get first available provider
    PROVIDER=$(akash query market bid list \
        --owner $(akash keys show $WALLET_NAME -a) \
        --chain-id $CHAIN_ID \
        --node $NODE_URL \
        -o json | jq -r '.bids[0].bid.bid_id.provider')
    
    if [ "$PROVIDER" != "null" ] && [ -n "$PROVIDER" ]; then
        echo -e "${GREEN}🎯 Selected provider: $PROVIDER${NC}"
        
        # Create lease
        akash tx market lease create \
            --dseq $DSEQ \
            --gseq 1 \
            --oseq 1 \
            --provider $PROVIDER \
            --from $WALLET_NAME \
            --chain-id $CHAIN_ID \
            --node $NODE_URL \
            --fees $FEES
        
        echo -e "${GREEN}✅ Lease created${NC}"
        
        # Send manifest
        sleep 5
        akash provider send-manifest deploy.yaml \
            --dseq $DSEQ \
            --provider $PROVIDER \
            --from $WALLET_NAME \
            --home ~/.akash
        
        echo -e "${GREEN}✅ Manifest sent${NC}"
        
        # Show deployment info
        echo -e "${BLUE}📊 Deployment Information:${NC}"
        echo "DSEQ: $DSEQ"
        echo "Provider: $PROVIDER"
        echo ""
        echo "To check status:"
        echo "akash provider lease-status --dseq $DSEQ --gseq 1 --oseq 1 --provider $PROVIDER --from $WALLET_NAME"
        echo ""
        echo "To view logs:"
        echo "akash provider lease-logs --dseq $DSEQ --gseq 1 --oseq 1 --provider $PROVIDER --from $WALLET_NAME --follow"
        
    else
        echo -e "${RED}❌ No bids available. Please try again later.${NC}"
        exit 1
    fi
}

# Main execution
main() {
    echo "Starting deployment process..."
    
    check_akash_cli
    check_wallet_balance
    
    read -p "Build and push Docker image? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        build_and_push_image
    fi
    
    customize_deployment
    create_certificate
    deploy_to_akash
    
    echo -e "${GREEN}🎉 Deployment complete!${NC}"
    echo "Your PrivacyAI inference server is now running on Akash Network!"
}

# Run main function
main 