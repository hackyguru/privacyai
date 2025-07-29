#!/usr/bin/env node

import { AIService } from './services/aiService.js';
import { Logger } from './utils/logger.js';

const logger = new Logger('TestService');
const aiService = new AIService();

const testMessages = [
  "Hello, how does Waku work?",
  "What is privacy in decentralized systems?",
  "Tell me about AI and decentralization",
  "How does this system ensure censorship resistance?",
  "What are the benefits of peer-to-peer communication?"
];

async function runTests() {
  logger.info('🧪 Starting AI Service Tests...');
  
  for (let i = 0; i < testMessages.length; i++) {
    const message = testMessages[i];
    logger.info(`\n📤 Test ${i + 1}: Sending message`, { content: message });
    
    try {
      const response = await aiService.generateResponse(message);
      logger.success(`📥 Response received:`, { 
        content: response.substring(0, 100) + '...',
        fullLength: response.length 
      });
    } catch (error) {
      logger.error(`❌ Test ${i + 1} failed:`, error);
    }
    
    // Add delay between tests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  logger.success('✅ All tests completed!');
}

// Run the tests
runTests().catch(logger.error);