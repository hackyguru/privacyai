# PrivacyAI - Decentralized ChatGPT with Waku Protocol

A complete decentralized AI chat system built with Waku protocol, featuring a Next.js client and Node.js inference service that communicate through peer-to-peer messaging.

## 🎯 Overview

This project demonstrates how to build ChatGPT-style AI interactions using **completely decentralized infrastructure**:

- **No centralized servers** - All communication flows through Waku's P2P network
- **Privacy-first design** - Messages exist only during transmission
- **Censorship-resistant** - No single point of control or failure
- **Real-time bidirectional** - Instant request/response messaging

## 🏗️ Architecture

```
┌─────────────────┐    Waku Network    ┌─────────────────┐
│                 │ ←─────────────────→ │                 │
│  Next.js Client │                     │ Node.js AI      │
│                 │  Request Topic:     │ Inference       │
│  - Chat UI      │  /privacyai/1/      │ Service         │
│  - Session Mgmt │  chat-request/proto │                 │
│  - localStorage │                     │ - AI Responses  │
│                 │  Response Topic:    │ - Waku Listener │
│                 │  /privacyai/1/      │ - Context Aware │
│                 │  chat-response/proto│                 │
└─────────────────┘                     └─────────────────┘
```

## 🚀 Quick Start

### 1. Start the AI Inference Service

```bash
cd inference
npm install
npm start
```

The service will:
- 🎧 Connect to Waku network
- 📡 Listen for requests on `/privacyai/1/chat-request/proto`
- 🤖 Generate AI responses
- 📤 Send responses via `/privacyai/1/chat-response/proto`

### 2. Start the Client Interface

```bash
cd client
npm install
npm run dev
```

The client will be available at `http://localhost:3001` with:
- 💬 ChatGPT-style interface
- 📊 Real-time Waku status indicator
- 🤖 Real AI responses via Ollama integration
- 💾 Session persistence via localStorage

### 3. Chat with Decentralized AI

1. **Send a message** → Goes to Waku request topic
2. **AI processes** → Inference service generates response
3. **Receive response** → Delivered via Waku response topic
4. **Continue conversation** → All via decentralized network!

## 🎯 Key Features

### Client Features
- ✅ **ChatGPT-style UI** with dark/light themes
- ✅ **Session Management** - Create, switch, delete conversations
- ✅ **Real-time Status** - Visual Waku connection indicators
- ✅ **Topic Display** - Shows active request/response topics  
- ✅ **Ollama Integration** - Real AI responses via local models
- ✅ **localStorage Persistence** - Conversations saved locally
- ✅ **Responsive Design** - Works on desktop and mobile

### Inference Service Features
- ✅ **Waku Integration** - Full P2P network connectivity
- ✅ **Contextual AI** - Intelligent responses based on content
- ✅ **Topic-aware** - Specialized responses for different subjects
- ✅ **Privacy-first** - No data storage, real-time processing
- ✅ **Detailed Logging** - Comprehensive service monitoring
- ✅ **Graceful Shutdown** - Proper cleanup and error handling

### Decentralized Features
- ✅ **No Central Servers** - Pure P2P communication
- ✅ **Censorship Resistant** - No single point of control
- ✅ **Privacy Preserving** - Messages only exist in transit
- ✅ **Scalable** - Run multiple inference services
- ✅ **Resilient** - Automatic peer discovery and reconnection

## 🔧 Technical Details

### Waku Protocol Integration

#### Content Topics
- **Request Topic**: `/privacyai/1/chat-request/proto`
  - User prompts and questions
  - Sent by client, received by inference service

- **Response Topic**: `/privacyai/1/chat-response/proto`
  - AI-generated responses
  - Sent by inference service, received by client

#### Message Structure
```typescript
interface WakuMessage {
  sessionId: string;    // Chat session identifier
  messageId: string;    // Unique message ID
  content: string;      // Message content
  timestamp: string;    // ISO timestamp
  type: 'request' | 'response';  // Message direction
}
```

### Client Architecture
- **Next.js 15** with Pages Router
- **TailwindCSS** for styling
- **Custom Hooks** for Waku and chat management
- **TypeScript** throughout for type safety
- **localStorage** for conversation persistence

### Inference Service Architecture
- **Node.js ES Modules** for modern JavaScript
- **Waku SDK** for P2P communication
- **Modular Design** - Separated AI, logging, config
- **Graceful Error Handling** throughout
- **Real-time Monitoring** with detailed metrics

## 🎨 AI Capabilities

The inference service provides intelligent responses for:

### Topic Recognition
- **Greetings** → Welcoming decentralized AI introductions
- **Technology** → Explanations about Waku, P2P, Web3
- **Privacy/Security** → Information about decentralized privacy
- **AI/ML Topics** → Insights about decentralized AI systems
- **General Questions** → Contextual responses with educational value

### Response Features
- **Context Awareness** - Analyzes message content for relevant topics
- **Educational Focus** - Explains decentralized benefits
- **Conversational** - Natural, engaging communication style
- **Reference Integration** - Mentions user's specific questions
- **Privacy Emphasis** - Highlights decentralized advantages

## 🛠️ Development

### Running in Development Mode

**Client:**
```bash
cd client
npm run dev  # Auto-reload on changes
```

**Inference Service:**
```bash
cd inference
npm run dev  # Auto-reload with --watch flag
```

### Testing the System

1. **Start both services**
2. **Open client** at `http://localhost:3001`
3. **Check Waku status** - Should show green "Connected"
4. **Send a test message** - "Hello, how does Waku work?"
5. **Watch console logs** - See message flow in real-time
6. **Receive AI response** - Real Ollama-powered responses via Waku

### Debugging

**Client Console:**
```bash
# Check Waku message flow
📤 Sending Waku message to /privacyai/1/chat-request/proto
📥 Received Waku response from /privacyai/1/chat-response/proto
```

**Inference Service Logs:**
```bash
# Monitor AI processing
🎧 Subscribing to request topic: /privacyai/1/chat-request/proto
📥 [1] Received request: { sessionId: "...", content: "..." }
🤖 Generating AI response...
📤 Sending response: { content: "..." }
✅ Response sent to 3 peers
```

## 🚀 Production Deployment

### Environment Configuration

**Client (.env.local):**
```bash
NEXT_PUBLIC_WAKU_REQUEST_TOPIC=/privacyai/1/chat-request/proto
NEXT_PUBLIC_WAKU_RESPONSE_TOPIC=/privacyai/1/chat-response/proto
```

**Inference Service (.env):**
```bash
WAKU_REQUEST_TOPIC=/privacyai/1/chat-request/proto
WAKU_RESPONSE_TOPIC=/privacyai/1/chat-response/proto
AI_PROVIDER=local
LOG_LEVEL=info
NODE_ENV=production
```

### Scaling

**Multiple Inference Services:**
```bash
# Run multiple instances for load distribution
pm2 start index.js --name "ai-inference-1"
pm2 start index.js --name "ai-inference-2"
pm2 start index.js --name "ai-inference-3"
```

**Client Deployment:**
```bash
# Build and deploy Next.js client
npm run build
npm start
# or deploy to Vercel/Netlify
```

## 🔒 Security & Privacy

### Privacy Features
- **No Data Storage** - Messages processed in real-time only
- **P2P Communication** - Direct peer-to-peer messaging
- **No Central Authority** - No server logs or monitoring
- **Session Isolation** - Each conversation is independent
- **Local Storage Only** - User data stays on device

### Security Considerations
- **Waku Network Security** - Inherits Waku's security model
- **Message Encryption** - Transport-level security via libp2p
- **Peer Authentication** - Cryptographic peer identification
- **DoS Protection** - Rate limiting and peer management
- **Content Validation** - Input sanitization and validation

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit changes** (`git commit -m 'Add amazing feature'`)
4. **Push to branch** (`git push origin feature/amazing-feature`)
5. **Open Pull Request**

### Development Guidelines
- Use TypeScript for type safety
- Follow existing code style and patterns
- Add tests for new features
- Update documentation for API changes
- Test with both client and inference service

## 📊 Performance

### Typical Metrics
- **Connection Time**: 2-5 seconds for Waku peer discovery
- **Message Latency**: 1-3 seconds end-to-end
- **Throughput**: Limited by AI processing, not network
- **Memory Usage**: ~50MB per service instance
- **Network Usage**: Minimal, only for active messages

### Optimization Tips
- Run multiple inference services for load balancing
- Use faster AI models for quicker responses
- Optimize Waku peer configuration for your network
- Monitor peer count for connection quality

## 🔗 Links

- **Waku Protocol**: [waku.org](https://waku.org)
- **Next.js**: [nextjs.org](https://nextjs.org)
- **TailwindCSS**: [tailwindcss.com](https://tailwindcss.com)
- **Waku SDK**: [js.waku.org](https://js.waku.org)

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Built with ❤️ for the decentralized web**

This project demonstrates the future of AI interactions - private, censorship-resistant, and user-controlled. Experience ChatGPT-style conversations without giving up your privacy or depending on centralized infrastructure. 