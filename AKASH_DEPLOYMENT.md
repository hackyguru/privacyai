# 🚀 Deploying PrivacyAI Inference Server on Akash Network

This guide walks you through deploying your decentralized AI inference server on Akash Network, enabling truly permissionless AI infrastructure.

## 📋 Prerequisites

### 1. Install Akash CLI
```bash
# Download and install Akash CLI
curl -sSfL https://raw.githubusercontent.com/akash-network/provider/main/install.sh | sh

# Add to PATH
export PATH="$PATH:$HOME/bin"

# Verify installation
akash version
```

### 2. Create Akash Wallet
```bash
# Create new wallet
akash keys add my-wallet

# Or import existing wallet
akash keys add my-wallet --recover
```

### 3. Fund Your Wallet
- Get AKT tokens from exchanges (Gate.io, Osmosis, etc.)
- Transfer to your Akash wallet address
- Minimum ~5 AKT recommended for deployment

## 🐳 Step 1: Containerize Your Inference Server

### Build Docker Image
```bash
# Navigate to inference directory
cd inference

# Build Docker image
docker build -t privacyai-inference:latest .

# Test locally (optional)
docker run -e PROVIDER_ID=test-provider privacyai-inference:latest
```

### Push to Container Registry
```bash
# Tag for GitHub Container Registry
docker tag privacyai-inference:latest ghcr.io/yourusername/privacyai-inference:latest

# Login to GHCR
echo $GITHUB_TOKEN | docker login ghcr.io -u yourusername --password-stdin

# Push image
docker push ghcr.io/yourusername/privacyai-inference:latest
```

## 📝 Step 2: Configure Deployment

### Update deploy.yaml
```yaml
# Edit the image reference in deploy.yaml
services:
  inference:
    image: ghcr.io/yourusername/privacyai-inference:latest
    env:
      - PROVIDER_ID=your-unique-provider-id
      - PROVIDER_NAME=Your Provider Name
      # ... other environment variables
```

### Environment Variables
| Variable | Description | Example |
|----------|-------------|---------|
| `PROVIDER_ID` | Unique provider identifier | `akash-provider-1` |
| `PROVIDER_NAME` | Human-readable provider name | `Akash AI Provider` |
| `WAKU_REQUEST_TOPIC` | Topic for receiving requests | `/marketplace/v1/providers/{id}/requests` |
| `WAKU_RESPONSE_TOPIC` | Topic for sending responses | `/marketplace/v1/providers/{id}/responses` |
| `OLLAMA_MODEL` | AI model to use | `deepseek-r1:8b` |
| `USE_OLLAMA` | Enable Ollama integration | `true` |

## 🚀 Step 3: Deploy to Akash

### 1. Create Certificate
```bash
# Create deployment certificate
akash tx cert create client \
  --from my-wallet \
  --chain-id akashnet-2 \
  --node https://rpc.akash.forbole.com:443 \
  --fees 5000uakt
```

### 2. Create Deployment
```bash
# Create deployment from SDL file
akash tx deployment create deploy.yaml \
  --from my-wallet \
  --chain-id akashnet-2 \
  --node https://rpc.akash.forbole.com:443 \
  --fees 5000uakt
```

### 3. View Bids
```bash
# Get your deployment sequence (DSEQ)
akash query deployment list --owner $(akash keys show my-wallet -a) \
  --chain-id akashnet-2 \
  --node https://rpc.akash.forbole.com:443

# View bids for your deployment
akash query market bid list \
  --owner $(akash keys show my-wallet -a) \
  --chain-id akashnet-2 \
  --node https://rpc.akash.forbole.com:443
```

### 4. Accept Bid and Create Lease
```bash
# Create lease with chosen provider
akash tx market lease create \
  --dseq $DSEQ \
  --gseq 1 \
  --oseq 1 \
  --provider $PROVIDER_ADDRESS \
  --from my-wallet \
  --chain-id akashnet-2 \
  --node https://rpc.akash.forbole.com:443 \
  --fees 5000uakt
```

### 5. Send Manifest
```bash
# Send deployment manifest to provider
akash provider send-manifest deploy.yaml \
  --dseq $DSEQ \
  --provider $PROVIDER_ADDRESS \
  --from my-wallet \
  --home ~/.akash
```

## 📊 Step 4: Monitor Deployment

### Check Deployment Status
```bash
# View deployment status
akash provider lease-status \
  --dseq $DSEQ \
  --gseq 1 \
  --oseq 1 \
  --provider $PROVIDER_ADDRESS \
  --from my-wallet
```

### View Logs
```bash
# Stream application logs
akash provider lease-logs \
  --dseq $DSEQ \
  --gseq 1 \
  --oseq 1 \
  --provider $PROVIDER_ADDRESS \
  --from my-wallet \
  --follow
```

### Access Service
```bash
# Get service URI
akash provider lease-status \
  --dseq $DSEQ \
  --gseq 1 \
  --oseq 1 \
  --provider $PROVIDER_ADDRESS \
  --from my-wallet \
  | jq '.services.inference.uris[0]'
```

## 🔧 Deployment Configurations

### Basic Configuration (CPU Only)
```yaml
profiles:
  compute:
    inference:
      resources:
        cpu:
          units: 2.0
        memory:
          size: 4Gi
        storage:
          size: 10Gi
```
**Cost**: ~$20-40/month

### Performance Configuration (More Resources)
```yaml
profiles:
  compute:
    inference:
      resources:
        cpu:
          units: 4.0
        memory:
          size: 8Gi
        storage:
          size: 20Gi
```
**Cost**: ~$40-80/month

### High-Performance (With GPU - if available)
```yaml
profiles:
  compute:
    inference:
      resources:
        cpu:
          units: 8.0
        memory:
          size: 16Gi
        storage:
          size: 50Gi
        gpu:
          units: 1
          attributes:
            vendor:
              nvidia:
```
**Cost**: ~$100-200/month

## 🔄 Multiple Provider Deployment

### Deploy Multiple Instances
```bash
# Create multiple providers with different IDs
for i in {1..5}; do
  # Update PROVIDER_ID in deploy.yaml
  sed "s/PROVIDER_ID=akash-provider-1/PROVIDER_ID=akash-provider-$i/" deploy.yaml > deploy-$i.yaml
  
  # Deploy each instance
  akash tx deployment create deploy-$i.yaml \
    --from my-wallet \
    --chain-id akashnet-2 \
    --node https://rpc.akash.forbole.com:443 \
    --fees 5000uakt
done
```

### Load Balancing Strategy
```yaml
# Example: Geographic distribution
services:
  inference-us:
    env:
      - PROVIDER_ID=akash-provider-us-1
      - REGION=us-east
      
  inference-eu:
    env:
      - PROVIDER_ID=akash-provider-eu-1  
      - REGION=europe
```

## 🛠️ Troubleshooting

### Common Issues

**1. Container Won't Start**
```bash
# Check logs for startup errors
akash provider lease-logs --dseq $DSEQ --provider $PROVIDER --follow

# Common fixes:
# - Verify image exists and is public
# - Check environment variables
# - Ensure proper resource allocation
```

**2. Waku Connection Issues**
```bash
# Verify Waku network connectivity
# Check if ports are properly exposed
# Ensure sufficient peers are available
```

**3. Out of Funds**
```bash
# Check wallet balance
akash query bank balances $(akash keys show my-wallet -a)

# Add more AKT tokens to continue deployment
```

### Performance Optimization

**1. Resource Tuning**
- Monitor CPU/memory usage via logs
- Adjust resource allocation based on actual usage
- Use storage for model caching

**2. Network Optimization**
- Choose providers with good connectivity
- Consider geographic proximity to users
- Monitor Waku peer count and connection quality

## 💰 Cost Management

### Estimated Costs (per month)
- **Basic**: 2 CPU, 4GB RAM = ~$20-40
- **Standard**: 4 CPU, 8GB RAM = ~$40-80  
- **Performance**: 8 CPU, 16GB RAM = ~$80-150

### Cost Optimization Tips
1. **Right-size resources** based on actual usage
2. **Use persistent storage** for model caching
3. **Deploy in regions** with lower costs
4. **Monitor and scale** based on demand

## 🎯 Next Steps

After successful deployment:

1. **Test your provider** by connecting from the client
2. **Monitor performance** and adjust resources
3. **Scale horizontally** by deploying multiple instances
4. **Implement provider discovery** as outlined in ROADMAP.md
5. **Add encryption** for content privacy

## 📚 Resources

- [Akash Network Documentation](https://docs.akash.network)
- [Akash Console](https://console.akash.network) - Web UI for deployments
- [Akash Discord](https://discord.gg/akash) - Community support
- [Provider List](https://stats.akash.network) - Available providers

---

**🎉 Congratulations!** You now have a decentralized AI inference provider running on Akash Network, contributing to the permissionless AI marketplace ecosystem! 