import { config } from '../config.js';
import { Logger } from '../utils/logger.js';
import { Ollama } from 'ollama';

export class AIService {
  constructor() {
    this.logger = new Logger('AIService');
    this.ollama = new Ollama({
      host: process.env.OLLAMA_HOST || 'http://localhost:11434'
    });
    this.defaultModel = process.env.OLLAMA_MODEL || 'deepseek-r1:8b';
    this.useOllama = process.env.USE_OLLAMA !== 'false'; // Defaults to true, set to false to use fallback
    
    // Keep fallback responses for when Ollama is unavailable
    this.fallbackResponses = {
      greeting: [
        "Service is unavailable. The AI service cannot connect to Ollama. Please check that Ollama is running and try again.",
        "Service is unavailable. Unable to process your request due to AI service connectivity issues.",
        "Service is unavailable. The local AI model is not accessible at this time."
      ],
      
      technology: [
        "Service is unavailable. Cannot provide information about technology topics as the AI service is offline.",
        "Service is unavailable. The AI inference system is currently not responding.",
        "Service is unavailable. Technical information cannot be provided without AI service connectivity."
      ],
      
      general: [
        "Service is unavailable. The AI assistant cannot process your request at this time.",
        "Service is unavailable. Please ensure Ollama is running and restart the inference service.",
        "Service is unavailable. The AI processing service is currently offline.",
        "Service is unavailable. Unable to generate intelligent responses without AI service connection."
      ]
    };
  }

  async generateResponse(userMessage) {
    try {
      this.logger.info('🤖 Generating AI response...');
      
      // Try Ollama first if enabled
      if (this.useOllama) {
        const ollamaResponse = await this.generateOllamaResponse(userMessage);
        if (ollamaResponse) {
          this.logger.success('✅ AI response generated via Ollama');
          return ollamaResponse;
        }
      }
      
      // Fallback to contextual responses
      this.logger.warn('⚠️ Using fallback responses');
      const response = await this.createContextualResponse(userMessage);
      
      this.logger.success('✅ AI response generated via fallback');
      return response;
      
    } catch (error) {
      this.logger.error('Failed to generate AI response:', error);
      return "Service is unavailable. The AI service encountered an error and cannot process your request.";
    }
  }

  async generateOllamaResponse(userMessage) {
    try {
      this.logger.info(`🦙 Querying Ollama with model: ${this.defaultModel}`);
      
      // Add context about the decentralized nature of the system
      const systemPrompt = `You are an AI assistant running on a decentralized network using the Waku protocol. This conversation is happening through peer-to-peer messaging, ensuring privacy and censorship resistance. Be helpful, informative, and acknowledge the decentralized nature of this interaction when relevant. Keep responses concise but informative.`;
      
      const response = await this.ollama.chat({
        model: this.defaultModel,
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: userMessage,
          },
        ],
        stream: false,
      });

      const aiResponse = response.message.content;
      this.logger.info(`📝 Ollama response length: ${aiResponse.length} characters`);
      
      return aiResponse;
      
    } catch (error) {
      this.logger.error('Ollama request failed:', error);
      
      // Log specific error types for debugging
      if (error.message?.includes('connect ECONNREFUSED')) {
        this.logger.error('🔴 Ollama service is not running on ' + (process.env.OLLAMA_HOST || 'http://localhost:11434'));
      } else if (error.message?.includes('model')) {
        this.logger.error(`🔴 Model "${this.defaultModel}" not available. Available models can be checked with: ollama list`);
      }
      
      return null; // Return null to trigger fallback
    }
  }

  async createContextualResponse(userMessage) {
    // Simulate processing time for fallback responses
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const message = userMessage.toLowerCase();
    
    // Greeting detection
    if (this.isGreeting(message)) {
      return this.getRandomResponse(this.fallbackResponses.greeting);
    }
    
    // Technology questions
    if (this.isTechnologyQuestion(message)) {
      return this.getRandomResponse(this.fallbackResponses.technology);
    }
    
    // Waku-specific questions
    if (message.includes('waku') || message.includes('decentralized') || message.includes('protocol')) {
      return this.generateWakuResponse(userMessage);
    }
    
    // Privacy/security questions
    if (message.includes('privacy') || message.includes('security') || message.includes('encryption')) {
      return this.generatePrivacyResponse(userMessage);
    }
    
    // AI/ML questions
    if (message.includes('ai') || message.includes('artificial intelligence') || message.includes('machine learning')) {
      return this.generateAIResponse(userMessage);
    }
    
    // Default contextual response
    return this.generateContextualAnswer(userMessage);
  }

  isGreeting(message) {
    const greetings = ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening'];
    return greetings.some(greeting => message.includes(greeting));
  }

  isTechnologyQuestion(message) {
    const techKeywords = ['how does', 'what is', 'explain', 'technology', 'protocol', 'network'];
    return techKeywords.some(keyword => message.includes(keyword));
  }

  generateWakuResponse(userMessage) {
    const wakuResponses = [
      "Service is unavailable. Cannot provide information about Waku protocol as the AI service is offline.",
      "Service is unavailable. The AI inference system cannot process questions about decentralized protocols at this time.",
      "Service is unavailable. Please ensure Ollama is running to get information about Waku."
    ];
    
    return this.getRandomResponse(wakuResponses);
  }

  generatePrivacyResponse(userMessage) {
    const privacyResponses = [
      "Service is unavailable. Cannot provide information about privacy features as the AI service is offline.",
      "Service is unavailable. Privacy-related questions cannot be answered without AI service connectivity.",
      "Service is unavailable. Please ensure the AI system is running to get information about security and privacy."
    ];
    
    return this.getRandomResponse(privacyResponses);
  }

  generateAIResponse(userMessage) {
    const aiResponses = [
      "Service is unavailable. Cannot provide information about AI as the Ollama service is not accessible.",
      "Service is unavailable. AI-related questions cannot be processed without local AI model connectivity.",
      "Service is unavailable. Please start Ollama service to get AI-powered responses."
    ];
    
    return this.getRandomResponse(aiResponses);
  }

  generateContextualAnswer(userMessage) {
    // Extract key topics from the message
    const topics = this.extractTopics(userMessage);
    const mainTopic = topics[0] || 'your question';
    
    const responseTemplates = [
      "Service is unavailable. Cannot process your request as the AI service is offline.",
      "Service is unavailable. The AI inference system is not responding.",
      "Service is unavailable. Please ensure Ollama is running and restart the service.",
      "Service is unavailable. Unable to provide intelligent responses without AI connectivity.",
      "Service is unavailable. The local AI model cannot be accessed at this time."
    ];
    
    return this.getRandomResponse(responseTemplates);
  }

  extractTopics(message) {
    // Simple topic extraction - could be enhanced with NLP
    const words = message.toLowerCase().split(' ');
    const stopWords = ['the', 'is', 'at', 'which', 'on', 'and', 'a', 'to', 'are', 'as', 'can', 'how', 'what', 'why', 'when'];
    const topics = words.filter(word => word.length > 3 && !stopWords.includes(word));
    return topics.slice(0, 3); // Return top 3 topics
  }

  getRandomResponse(responses) {
    return responses[Math.floor(Math.random() * responses.length)];
  }
} 