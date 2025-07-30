import { useEffect, useRef } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ChatMessage as ChatMessageType, ChatSession } from '../types/chat';
import { Rocket, BarChart3, Microscope, MessageCircle } from 'lucide-react';

interface ChatInterfaceProps {
  session: ChatSession | undefined;
  messages: ChatMessageType[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export const ChatInterface = ({ session, messages, onSendMessage, isLoading }: ChatInterfaceProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const quickActions = [
    {
      icon: Rocket,
      title: "What's new in PrivacyAI?",
      description: "See what's been happening in the decentralized AI world over the last 24 hours",
      gradient: 'linear-gradient(to bottom right, #9DFF00, #7ACC00)'
    },
    {
      icon: BarChart3,
      title: "Waku network update",
      description: "See what's happening in the Waku network in real time",
      gradient: 'linear-gradient(to bottom right, #0EA5E9, #0284C7)'
    },
    {
      icon: Microscope,
      title: "Deep privacy research",
      description: "See research from experts that we have simplified",
      gradient: 'linear-gradient(to bottom right, #10B981, #059669)'
    }
  ];

  const handleQuickAction = (action: typeof quickActions[0]) => {
    onSendMessage(action.title);
  };

  if (!session) {
    return (
      <div className="flex-1 flex flex-col h-full" style={{ backgroundColor: '#2b2c30' }}>
        {/* Welcome Screen */}
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="text-center max-w-2xl">
            {/* Personalized Greeting */}
            <h1 className="text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(to right, #9DFF00, #7ACC00)' }}>
                Hello Marcus
              </span>
            </h1>
            <h2 className="text-3xl font-light text-zinc-300 mb-12">
              How can I help you today?
            </h2>

            {/* Quick Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
              {quickActions.map((action, index) => (
                <div
                  key={index}
                  onClick={() => handleQuickAction(action)}
                  className="group cursor-pointer bg-zinc-800 rounded-2xl p-6 hover:bg-zinc-700 transition-all duration-200 border border-zinc-600"
                >
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200"
                    style={{ background: action.gradient }}
                  >
                    <action.icon className="w-6 h-6 text-black" />
                  </div>
                  <h3 className="font-semibold text-white mb-2 text-left">
                    {action.title}
                  </h3>
                  <p className="text-sm text-zinc-300 text-left leading-relaxed">
                    {action.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="flex-shrink-0 bg-zinc-800 border-t border-zinc-600">
          <ChatInput onSendMessage={onSendMessage} disabled={isLoading} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full" style={{ backgroundColor: '#2b2c30' }}>
      {/* Messages - No header/title bar */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: 'linear-gradient(to bottom right, #9DFF00, #7ACC00)' }}
              >
                <MessageCircle className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Start a conversation</h3>
              <p className="text-zinc-400">Type a message below to begin your private AI chat</p>
            </div>
          </div>
        ) : (
          <div>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex gap-4 p-6">
                <div 
                  className="flex-shrink-0 w-10 h-10 rounded-full text-black flex items-center justify-center text-sm font-medium"
                  style={{ background: 'linear-gradient(to bottom right, #9DFF00, #7ACC00)' }}
                >
                  AI
                </div>
                <div className="flex-1">
                  <div className="text-sm text-zinc-300 mb-2">Assistant</div>
                  <div className="flex items-center gap-1 text-zinc-400">
                    <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#9DFF00' }}></div>
                    <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#9DFF00', animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#9DFF00', animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex-shrink-0 bg-zinc-800 border-t border-zinc-600">
        <ChatInput onSendMessage={onSendMessage} disabled={isLoading} />
      </div>
    </div>
  );
}; 