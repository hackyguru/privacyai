# PrivacyAI Inference Service

A decentralized AI inference service that processes requests via the Waku protocol and sends intelligent responses back through the network.

## Overview

This Node.js service demonstrates how AI can operate in a fully decentralized manner:

- 🎧 **Listens** to user requests on Waku content topic: `/privacyai/1/chat-request/proto`
- 🤖 **Processes** requests with contextual AI responses
- 📤 **Sends** responses back via topic: `/privacyai/1/chat-response/proto`
- 🔒 **Maintains** privacy through decentralized communication

## Architecture

```
Client App                 Waku Network                 Inference Service
    |                           |                            |
    |--- Send Request --------->|                            |
    |    (request topic)        |--- Deliver Request ------>|
    |                           |                            |--- Process with AI
    |                           |<--- Send Response ---------|
    |<--- Receive Response -----|                            |
    |    (response topic)       |                            |
```

## Features

- **Decentralized Communication**: No central servers, all via Waku P2P network
- **Contextual AI**: Intelligent responses based on message content and context
- **Privacy-First**: Messages only exist during transmission, no storage
- **Resilient**: Automatic peer discovery and connection management
- **Scalable**: Can run multiple instances for load distribution

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start the service:**
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```

## Configuration

### Environment Variables

- `WAKU_REQUEST_TOPIC`: Topic to listen for incoming requests (default: `/privacyai/1/chat-request/proto`)
- `WAKU_RESPONSE_TOPIC`: Topic to send responses (default: `/privacyai/1/chat-response/proto`)
- `AI_PROVIDER`: AI provider to use (`local`, `openai`) (default: `local`)
- `AI_API_KEY`: API key for external AI services (if using OpenAI)
- `LOG_LEVEL`: Logging level (`info`, `debug`, `warn`, `error`)

### Waku Topics

The service uses two distinct content topics:

- **Request Topic**: `/privacyai/1/chat-request/proto`
  - Receives user prompts and questions
  - Message type: `{ type: 'request', sessionId, messageId, content, timestamp }`

- **Response Topic**: `/privacyai/1/chat-response/proto`  
  - Sends AI-generated responses
  - Message type: `{ type: 'response', sessionId, messageId, content, timestamp }`

## AI Capabilities

The service provides contextual responses for:

- **General Questions**: Thoughtful responses to any query
- **Technology Topics**: Explanations about Waku, decentralization, Web3
- **Privacy & Security**: Information about decentralized privacy
- **AI & Machine Learning**: Insights about decentralized AI systems
- **Greetings**: Friendly introductions to the decentralized system

## Message Flow

1. **Incoming Request**:
   ```json
   {
     "sessionId": "1234567890",
     "messageId": "msg_001",
     "content": "How does Waku enable decentralized AI?",
     "timestamp": "2024-01-15T10:30:00.000Z",
     "type": "request"
   }
   ```

2. **AI Processing**: 
   - Analyzes content for context and topics
   - Generates intelligent, relevant response
   - Adds information about decentralized benefits

3. **Outgoing Response**:
   ```json
   {
     "sessionId": "1234567890", 
     "messageId": "resp_001",
     "content": "Waku enables decentralized AI by...",
     "timestamp": "2024-01-15T10:30:03.000Z",
     "type": "response"
   }
   ```

## Development

### Running in Development Mode

```bash
npm run dev
```

This enables:
- Auto-reload on file changes
- Debug logging
- Development-specific configurations

### Adding New AI Capabilities

1. Edit `services/aiService.js`
2. Add new response categories in the `responses` object
3. Create detection logic in `createContextualResponse()`
4. Add specialized response generators

### Monitoring

The service logs key metrics every 30 seconds:
- Connection status
- Uptime
- Messages processed
- Average messages per minute

## Production Deployment

1. **Set environment to production:**
   ```bash
   export NODE_ENV=production
   ```

2. **Configure external AI (optional):**
   ```bash
   export AI_PROVIDER=openai
   export AI_API_KEY=your_openai_key
   ```

3. **Run with process manager:**
   ```bash
   pm2 start index.js --name "privacyai-inference"
   ```

## Security Considerations

- **No Data Storage**: Messages are processed in real-time, no persistence
- **P2P Communication**: All messages flow through Waku's decentralized network
- **No Central Authority**: Service operates independently without external control
- **Privacy by Design**: User data never leaves the decentralized network

## Troubleshooting

### Connection Issues
- Ensure internet connectivity for peer discovery
- Check firewall settings for P2P connections
- Verify Waku bootstrap nodes are accessible

### Performance
- Monitor peer count - more peers = better reliability
- Check message processing times in logs
- Scale horizontally by running multiple instances

### Debugging
```bash
export LOG_LEVEL=debug
npm run dev
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details. 