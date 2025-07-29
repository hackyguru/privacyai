import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
  waku: {
    requestTopic: process.env.WAKU_REQUEST_TOPIC || '/privacyai/1/chat-request/proto',
    responseTopic: process.env.WAKU_RESPONSE_TOPIC || '/privacyai/1/chat-response/proto',
  },
  
  ai: {
    provider: process.env.AI_PROVIDER || 'local',
    apiKey: process.env.AI_API_KEY || '',
    model: process.env.AI_MODEL || 'gpt-3.5-turbo',
  },
  
  service: {
    logLevel: process.env.LOG_LEVEL || 'info',
    nodeEnv: process.env.NODE_ENV || 'development',
  }
}; 