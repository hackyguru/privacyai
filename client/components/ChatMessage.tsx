import { ChatMessage as ChatMessageType } from '../types/chat';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === 'user';

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
        <div className="text-zinc-900 whitespace-pre-wrap break-words">
          {message.content}
        </div>
        <div className="text-xs text-zinc-400 mt-2">
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}; 