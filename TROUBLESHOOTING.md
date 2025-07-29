# Troubleshooting Waku Connection Issues

## Current Status

✅ **AI Service**: Working perfectly (tested with `npm test`)  
✅ **Client Interface**: Running in demo mode  
⚠️ **Waku Connection**: Currently using simulation mode due to connection issues

## Quick Fix Applied

The client has been set to **demo mode** to avoid connection timeouts. You should now see:
- 🔵 Blue dot: "Demo Mode (Waku Simulated)"
- Functional chat interface with simulated AI responses
- All UI features working correctly

## Enabling Full Waku Connection

When you're ready to test real Waku connectivity:

### 1. Enable Waku in Client

```typescript
// In client/hooks/useWaku.ts, line 26
const ENABLE_FULL_WAKU = true; // Change from false to true
```

### 2. Start Both Services

**Terminal 1 - Inference Service:**
```bash
cd inference
npm start
```

**Terminal 2 - Client:**
```bash
cd client
npm run dev
```

### 3. Monitor Connection

**Client Console (Browser DevTools):**
```bash
# Should see progression:
Creating Waku light node...
Starting Waku node...
Waiting for remote peers...
Waku node connected successfully!
```

**Inference Service Console:**
```bash
# Should see:
✅ Waku node connected successfully!
📨 Successfully subscribed to request messages
```

## Common Connection Issues

### Issue 1: Peer Discovery Timeout

**Symptoms:**
- Client stuck on "Connecting to Waku..."
- Console shows "Waiting for remote peers..." then timeout

**Solutions:**
1. **Check Internet Connection**: Ensure stable internet
2. **Wait Longer**: Peer discovery can take 10-30 seconds
3. **Restart Services**: Stop and restart both client and inference service
4. **Network Configuration**: Check firewall/router settings for P2P

### Issue 2: Bootstrap Node Issues

**Symptoms:**
- Connection fails immediately
- Error about bootstrap nodes

**Solutions:**
1. **Use Different Bootstrap**: Try connecting at different times
2. **Network Environment**: Some corporate/school networks block P2P
3. **VPN**: Try with/without VPN connection

### Issue 3: Port Conflicts

**Symptoms:**
- Services start but can't communicate
- Multiple instances running

**Solutions:**
1. **Kill Existing Processes**:
   ```bash
   pkill -f "node index.js"
   pkill -f "next dev"
   ```

2. **Check Ports**:
   ```bash
   lsof -i :3001  # Client port
   lsof -i :3000  # Alternative client port
   ```

## Testing Waku Connection

### 1. Test AI Service Independently

```bash
cd inference
npm test
```

Should show successful AI responses.

### 2. Test Client Connection

1. Open browser DevTools (F12)
2. Go to `http://localhost:3001`
3. Check Console tab for Waku logs
4. Watch Network tab for WebSocket connections

### 3. Test End-to-End Communication

When both services show "Connected":

1. **Send Test Message**: "Hello Waku!"
2. **Check Client Console**: Should see outgoing message log
3. **Check Inference Console**: Should see incoming message log
4. **Wait for Response**: Should appear in chat interface
5. **Verify Response Path**: Should see response message logs

## Debug Mode

### Enable Detailed Logging

**Client:**
```typescript
// In browser console
localStorage.setItem('debug', 'waku*');
// Refresh page
```

**Inference Service:**
```bash
export LOG_LEVEL=debug
npm start
```

### Key Log Messages to Watch For

**Successful Client Connection:**
```
📤 Sending Waku message to /privacyai/1/chat-request/proto
📥 Received Waku response from /privacyai/1/chat-response/proto
```

**Successful Inference Service:**
```
📥 [1] Received request: { sessionId: "...", content: "..." }
📤 Sending response: { content: "..." }
✅ Response sent to 3 peers
```

## Network Requirements

### Waku Protocol Needs

- **Internet Access**: For bootstrap node discovery
- **P2P Ports**: Various UDP/TCP ports for peer communication
- **WebRTC**: For browser-based connections
- **libp2p**: Underlying networking protocol

### Firewall Configuration

If using strict firewall, may need to allow:
- Outbound connections to Waku bootstrap nodes
- P2P protocol connections
- WebRTC STUN/TURN servers

## Alternative Testing

### Local Network Testing

For development on restricted networks:

1. **Use Demo Mode**: Already configured and working
2. **Simulate Both Sides**: Use the test panel to simulate AI responses
3. **Mock Network**: Test UI/UX without real P2P networking

### Production Deployment

For production with reliable Waku:

1. **VPS/Cloud**: Deploy both services on VPS with good connectivity
2. **Container Deployment**: Use Docker for consistent environments
3. **Load Balancing**: Multiple inference services for reliability

## Current Demo Mode Features

While in demo mode, you can still test:

✅ **Chat Interface**: Full ChatGPT-style UI  
✅ **Session Management**: Create/switch/delete conversations  
✅ **AI Responses**: Simulated intelligent responses  
✅ **Test Panel**: Manual response simulation  
✅ **localStorage**: Conversation persistence  
✅ **Responsive Design**: Mobile/desktop compatibility  

## Getting Help

### Check Service Status

```bash
# Inference service status
curl -s http://localhost:3000/health || echo "Service not running"

# Client status  
curl -s http://localhost:3001 || echo "Client not running"
```

### Common Solutions

1. **Restart Everything**:
   ```bash
   # Kill all node processes
   pkill -f node
   
   # Restart inference service
   cd inference && npm start &
   
   # Restart client
   cd client && npm run dev
   ```

2. **Clear Browser Data**:
   - Clear localStorage: DevTools > Application > Storage > Clear
   - Hard refresh: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)

3. **Check Network**:
   ```bash
   ping google.com  # Basic connectivity
   nslookup bootstrap.libp2p.io  # Bootstrap node access
   ```

## Success Indicators

### Demo Mode Working ✅
- 🔵 Blue dot: "Demo Mode (Waku Simulated)"
- Chat interface responds with simulated AI
- Test panel allows manual responses

### Full Waku Working ✅
- 🟢 Green dot: "Connected to Waku Network"  
- Messages flow between client and inference service
- Real-time P2P communication working
- Console logs show actual Waku message routing

The system is designed to gracefully fall back to demo mode, so you always have a working chat interface while debugging network connectivity.