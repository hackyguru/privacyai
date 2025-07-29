import { createLightNode, waitForRemotePeer, Protocols, createEncoder, createDecoder } from '@waku/sdk';
import { config } from './config.js';
import { AIService } from './services/aiService.js';
import { Logger } from './utils/logger.js';

class WakuInferenceService {
  constructor() {
    this.node = null;
    this.isConnected = false;
    this.logger = new Logger('WakuInferenceService');
    this.aiService = new AIService();
    this.messageCount = 0;
    this.startTime = Date.now();
  }

  async initialize() {
    try {
      this.logger.info('🚀 Starting Waku Inference Service...');
      this.logger.info(`📡 Request Topic: ${config.waku.requestTopic}`);
      this.logger.info(`📤 Response Topic: ${config.waku.responseTopic}`);

      // Create Waku light node
      this.logger.info('Creating Waku light node...');
      this.node = await createLightNode({ 
        defaultBootstrap: true 
      });

      // Start the node
      this.logger.info('Starting Waku node...');
      await this.node.start();

      // Wait for peers
      this.logger.info('Waiting for remote peers...');
      await waitForRemotePeer(this.node, [Protocols.LightPush, Protocols.Filter]);

      this.isConnected = true;
      this.logger.success('✅ Waku node connected successfully!');

      // Start listening for requests with retry logic
      let subscriptionAttempts = 0;
      const maxSubscriptionAttempts = 3;
      
      while (subscriptionAttempts < maxSubscriptionAttempts) {
        try {
          await this.subscribeToRequests();
          break; // Success, exit retry loop
        } catch (subError) {
          subscriptionAttempts++;
          this.logger.warn(`Subscription attempt ${subscriptionAttempts} failed:`, subError.message);
          
          if (subscriptionAttempts < maxSubscriptionAttempts) {
            this.logger.info(`Retrying subscription in 2 seconds... (attempt ${subscriptionAttempts + 1}/${maxSubscriptionAttempts})`);
            await new Promise(resolve => setTimeout(resolve, 2000));
          } else {
            this.logger.error('❌ Failed to subscribe after all attempts. Service will continue but won\'t receive messages.');
          }
        }
      }

      // Log service status
      setInterval(() => {
        this.logStatus();
      }, 30000); // Every 30 seconds

    } catch (error) {
      this.logger.error('Failed to initialize Waku service:', error);
      process.exit(1);
    }
  }

  async subscribeToRequests() {
    try {
      this.logger.info(`🎧 Subscribing to request topic: ${config.waku.requestTopic}`);
      
      const decoder = createDecoder(config.waku.requestTopic);
      
      // Check if node and filter are properly initialized
      if (!this.node) {
        throw new Error('Waku node not initialized');
      }
      
      if (!this.node.filter) {
        throw new Error('Waku filter protocol not available');
      }

      // Wait for filter protocol to be ready
      await waitForRemotePeer(this.node, [Protocols.Filter]);
      
      const subscription = await this.node.filter.subscribe(
        [decoder],
        async (message) => {
          await this.handleIncomingMessage(message);
        }
      );

      this.logger.success('📨 Successfully subscribed to request messages');
      this.logger.info(`🔗 Subscription active for topic: ${config.waku.requestTopic}`);
      
      return subscription;
    } catch (error) {
      this.logger.error('Failed to subscribe to requests:', error);
      this.logger.error('Error details:', {
        message: error.message,
        stack: error.stack,
        nodeConnected: !!this.node,
        filterAvailable: !!(this.node && this.node.filter)
      });
      throw error; // Re-throw to handle in calling code
    }
  }

  async handleIncomingMessage(message) {
    try {
      if (!message.payload) {
        this.logger.warn('Received message without payload');
        return;
      }

      // Decode the message
      const textPayload = new TextDecoder().decode(message.payload);
      const wakuMessage = JSON.parse(textPayload);

      // Only process request messages
      if (wakuMessage.type !== 'request') {
        this.logger.debug('Ignoring non-request message');
        return;
      }

      this.messageCount++;
      this.logger.info(`📥 [${this.messageCount}] Received request:`, {
        sessionId: wakuMessage.sessionId,
        messageId: wakuMessage.messageId,
        content: wakuMessage.content.substring(0, 100) + '...',
        timestamp: wakuMessage.timestamp
      });

      // Generate AI response
      const aiResponse = await this.aiService.generateResponse(wakuMessage.content);

      // Create response message
      const responseMessage = {
        sessionId: wakuMessage.sessionId,
        messageId: Date.now().toString(),
        content: aiResponse,
        timestamp: new Date().toISOString(),
        type: 'response'
      };

      // Send response back
      await this.sendResponse(responseMessage);

    } catch (error) {
      this.logger.error('Error handling incoming message:', error);
    }
  }

  async sendResponse(responseMessage) {
    try {
      if (!this.isConnected) {
        this.logger.error('Cannot send response - Waku node not connected');
        return;
      }

      this.logger.info(`📤 Sending response:`, {
        sessionId: responseMessage.sessionId,
        messageId: responseMessage.messageId,
        content: responseMessage.content.substring(0, 100) + '...'
      });

      // Create encoder for response topic
      const encoder = createEncoder({ contentTopic: config.waku.responseTopic });
      
      // Encode the response
      const payload = new TextEncoder().encode(JSON.stringify(responseMessage));
      
      // Send via Waku
      const result = await this.node.lightPush.send(encoder, { payload });
      
      if (result.successes.length > 0) {
        this.logger.success(`✅ Response sent to ${result.successes.length} peers`);
      } else {
        this.logger.error('❌ Failed to send response to any peers');
      }

    } catch (error) {
      this.logger.error('Failed to send response:', error);
    }
  }

  logStatus() {
    const uptime = Math.floor((Date.now() - this.startTime) / 1000);
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = uptime % 60;

    this.logger.info(`📊 Service Status:`, {
      connected: this.isConnected,
      uptime: `${hours}h ${minutes}m ${seconds}s`,
      messagesProcessed: this.messageCount,
      avgPerMinute: Math.round((this.messageCount / (uptime / 60)) * 100) / 100
    });
  }

  async shutdown() {
    this.logger.info('🛑 Shutting down Waku Inference Service...');
    
    if (this.node) {
      await this.node.stop();
    }
    
    this.logger.success('✅ Service shut down successfully');
    process.exit(0);
  }
}

// Initialize and start the service
const service = new WakuInferenceService();

// Handle graceful shutdown
process.on('SIGINT', () => service.shutdown());
process.on('SIGTERM', () => service.shutdown());

// Start the service
service.initialize().catch(console.error); 