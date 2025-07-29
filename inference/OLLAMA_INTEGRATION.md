# Ollama Integration for Waku Inference Service

This document describes how the inference service has been enhanced to use Ollama for AI responses while maintaining the decentralized Waku communication flow.

## 🔄 Architecture Flow

```
Client App                    Waku Network                    Inference Service
    |                             |                                |
    |--- Send Request ----------->|                                |
    |    (/privacyai/1/           |--- Deliver Request ---------->|
    |     chat-request/proto)     |                                |--- Process with Ollama
    |                             |                                |    (Local AI Model)
    |                             |<--- Send Response ------------|
    |<--- Receive Response -------|                                |
    |    (/privacyai/1/           |                                |
    |     chat-response/proto)    |                                |
```

## 🚀 Quick Setup

### 1. Install and Start Ollama

```bash
# Install Ollama (macOS/Linux)
curl -fsSL https://ollama.ai/install.sh | sh

# Start Ollama service
ollama serve

# Pull a model (e.g., llama3.2)
ollama pull llama3.2
```

### 2. Configure the Inference Service

The service now supports environment variables for Ollama configuration:

```bash
# Set environment variables (optional)
export OLLAMA_HOST=http://localhost:11434
export OLLAMA_MODEL=llama3.2
export USE_OLLAMA=true
```

### 3. Start the Inference Service

```bash
cd inference
npm install  # Ollama package is now included
npm start
```

## ⚙️ Configuration Options

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `OLLAMA_HOST` | `http://localhost:11434` | Ollama service endpoint |
| `OLLAMA_MODEL` | `llama3.2` | Default model to use |
| `USE_OLLAMA` | `true` | Enable/disable Ollama (fallback to mock responses if false) |

### Supported Models

Any model available in your Ollama installation:
- `llama3.2` (recommended)
- `llama3.2:13b`
- `codellama`
- `mistral`
- `phi3`
- Custom models

Check available models:
```bash
ollama list
```

## 🔧 How It Works

### 1. Message Processing Flow

1. **Waku Request**: Client sends message to `/privacyai/1/chat-request/proto`
2. **Inference Service**: Receives message via Waku subscription
3. **Ollama Processing**: 
   - If Ollama is available: Uses Ollama for AI response
   - If Ollama fails: Falls back to contextual mock responses
4. **Waku Response**: Sends response back via `/privacyai/1/chat-response/proto`

### 2. AI Service Logic

The `AIService` class now implements:

```javascript
async generateResponse(userMessage) {
  // Try Ollama first
  if (this.useOllama) {
    const ollamaResponse = await this.generateOllamaResponse(userMessage);
    if (ollamaResponse) return ollamaResponse;
  }
  
  // Fallback to contextual responses
  return this.createContextualResponse(userMessage);
}
```

### 3. System Prompt

The service includes a custom system prompt for Ollama:

> "You are an AI assistant running on a decentralized network using the Waku protocol. This conversation is happening through peer-to-peer messaging, ensuring privacy and censorship resistance. Be helpful, informative, and acknowledge the decentralized nature of this interaction when relevant. Keep responses concise but informative."

## 🛠️ Error Handling & Fallbacks

### Ollama Connection Issues

The service gracefully handles Ollama failures:

1. **Connection Refused**: Falls back to mock responses if Ollama service is down
2. **Model Not Found**: Logs specific error and uses fallback
3. **Timeout**: Uses fallback responses after timeout

### Fallback Responses

When Ollama is unavailable, the service provides:
- Contextual responses based on message content
- Waku-specific information
- Privacy and decentralization explanations
- General helpful responses

## 📊 Monitoring & Logging

The service provides detailed logging:

```
🤖 Generating AI response...
🦙 Querying Ollama with model: llama3.2
📝 Ollama response length: 245 characters
✅ AI response generated via Ollama
```

Error scenarios:
```
🔴 Ollama service is not running on http://localhost:11434
🔴 Model "llama3.2" not available. Available models can be checked with: ollama list
⚠️ Using fallback responses
```

## 🔍 Testing the Integration

### 1. Start Required Services

```bash
# Terminal 1: Start Ollama
ollama serve

# Terminal 2: Start Inference Service
cd inference
npm start

# Terminal 3: Start Client
cd client
npm run dev
```

### 2. Test the Flow

1. Open `http://localhost:3000` (or 3001) in your browser
2. Send a message in the chat interface
3. Watch the inference service logs for Ollama processing
4. Verify you receive AI-generated responses

### 3. Test Fallback Behavior

```bash
# Stop Ollama service
pkill ollama

# Send another message - should receive fallback responses
# Restart Ollama to resume AI responses
ollama serve
```

## 🎯 Benefits of This Integration

### For Users
- **Real AI Responses**: Powered by local Ollama models
- **Privacy First**: No data sent to external AI services
- **Decentralized**: Communication via Waku P2P network
- **Reliable**: Fallback responses ensure service availability

### For Developers
- **Easy Integration**: Simple environment variable configuration
- **Flexible Models**: Support for any Ollama model
- **Robust Fallbacks**: Service continues even if Ollama fails
- **Extensible**: Easy to add new AI providers

## 🔮 Future Enhancements

Potential improvements:
- **Model Selection**: Allow clients to request specific models
- **Streaming Responses**: Support for real-time streaming
- **Context Memory**: Maintain conversation context across messages
- **Multi-Model**: Load balancing across multiple models
- **Performance Metrics**: Response time and quality monitoring

## 🐛 Troubleshooting

### Common Issues

1. **"Ollama service is not running"**
   ```bash
   # Check if Ollama is running
   ps aux | grep ollama
   
   # Start Ollama
   ollama serve
   ```

2. **"Model not available"**
   ```bash
   # List available models
   ollama list
   
   # Pull required model
   ollama pull llama3.2
   ```

3. **Slow responses**
   - First request may be slower (model loading)
   - Consider using smaller models (e.g., `phi3`)
   - Check system resources (RAM/CPU)

4. **Connection issues**
   - Verify Ollama is running on correct port (11434)
   - Check firewall settings
   - Ensure OLLAMA_HOST environment variable is correct

### Debug Mode

Enable detailed logging:
```bash
LOG_LEVEL=debug npm start
```

This integration brings the power of local AI models to the decentralized Waku network, creating a truly private and censorship-resistant AI chat experience! 