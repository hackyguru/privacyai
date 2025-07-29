import { ChatMessage as ChatMessageType } from '../types/chat';

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
    <div className={`flex gap-4 p-4 ${isUser ? 'bg-transparent' : 'bg-zinc-50/50'}`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
        isUser 
          ? 'bg-zinc-700 text-white' 
          : 'bg-zinc-200 text-zinc-700'
      }`}>
        {isUser ? 'U' : 'AI'}
      </div>

      {/* Message Content */}
      <div className="flex-1 min-w-0">
        <div className="text-sm text-zinc-600 mb-1">
          {isUser ? 'You' : 'Assistant'}
        </div>
        <div className="text-zinc-900">
          {contentParts.map((part, index) => (
            <div key={index}>
              {part.type === 'think' ? (
                <div className="mb-3 p-3 bg-zinc-100/60 border-l-2 border-zinc-300 rounded-r text-zinc-500 text-sm italic whitespace-pre-wrap break-words">
                  <div className="text-xs text-zinc-400 mb-1 font-medium">Thinking...</div>
                  {part.content}
                </div>
              ) : (
                <div className="whitespace-pre-wrap break-words">
                  {part.content}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="text-xs text-zinc-400 mt-2">
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}; 