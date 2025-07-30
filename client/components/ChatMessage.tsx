import { ChatMessage as ChatMessageType } from '../types/chat';
import { Copy, RotateCcw } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
}

const parseMessageContent = (content: string) => {
  const parts = [];
  let currentIndex = 0;
  
  // Find all <think> and </think> tags
  const thinkRegex = /<think>([\s\S]*?)<\/think>/g;
  let match;
  
  while ((match = thinkRegex.exec(content)) !== null) {
    // Add content before the <think> tag
    if (match.index > currentIndex) {
      const beforeThink = content.slice(currentIndex, match.index);
      if (beforeThink.trim()) {
        parts.push({ type: 'normal', content: beforeThink });
      }
    }
    
    // Add the thinking content
    parts.push({ type: 'think', content: match[1] });
    currentIndex = match.index + match[0].length;
  }
  
  // Add any remaining content after the last </think> tag
  if (currentIndex < content.length) {
    const afterThink = content.slice(currentIndex);
    if (afterThink.trim()) {
      parts.push({ type: 'normal', content: afterThink });
    }
  }
  
  // If no <think> tags found, return the entire content as normal
  if (parts.length === 0) {
    parts.push({ type: 'normal', content });
  }
  
  return parts;
};

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === 'user';
  const contentParts = parseMessageContent(message.content);

  return (
    <div className={`p-6 ${isUser ? 'bg-zinc-800' : ''}`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-4">
          {/* Avatar */}
          <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
            isUser 
              ? 'bg-zinc-700 text-white' 
              : 'text-black'
          }`}
          style={!isUser ? { background: 'linear-gradient(to bottom right, #9DFF00, #7ACC00)' } : {}}
          >
            {isUser ? 'MA' : 'AI'}
          </div>

          {/* Message Content */}
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-zinc-300 mb-2">
              {isUser ? 'Marcus Aurelius' : 'PrivacyAI'}
            </div>
            <div className="text-white">
              {contentParts.map((part, index) => (
                <div key={index}>
                  {part.type === 'think' ? (
                    <div className="mb-4 p-4 bg-zinc-900 border-l-4 rounded-r-lg text-zinc-300 text-sm italic whitespace-pre-wrap break-words" style={{ borderLeftColor: '#9DFF00' }}>
                      <div className="text-xs mb-2 font-semibold uppercase tracking-wider" style={{ color: '#9DFF00' }}>Thinking...</div>
                      {part.content}
                    </div>
                  ) : (
                    <div className="prose prose-gray max-w-none whitespace-pre-wrap break-words leading-relaxed text-white">
                      {part.content}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-3">
              <div className="text-xs text-zinc-500">
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
              {!isUser && (
                <div className="flex items-center gap-2">
                  <button 
                    className="p-1 text-zinc-500 hover:text-white transition-colors rounded"
                    title="Copy message"
                    onClick={() => navigator.clipboard.writeText(message.content)}
                    style={{ color: '#9DFF00' }}
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button 
                    className="p-1 text-zinc-500 hover:text-white transition-colors rounded"
                    title="Regenerate response"
                    style={{ color: '#9DFF00' }}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 