import { useState, KeyboardEvent } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput = ({ onSendMessage, disabled = false }: ChatInputProps) => {
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="relative bg-zinc-700 border border-zinc-600 rounded-2xl shadow-sm hover:border-zinc-500 transition-colors">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask something..."
            className="w-full resize-none border-0 rounded-2xl px-6 py-4 pr-14 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed placeholder-zinc-400 text-white bg-transparent"
            rows={1}
            style={{
              minHeight: '56px',
              maxHeight: '200px',
              height: 'auto',
            }}
            disabled={disabled}
            aria-label="Type your message"
          />
          
          {/* Send Button */}
          <button
            onClick={handleSubmit}
            disabled={!message.trim() || disabled}
            className="absolute right-3 bottom-3 p-2 text-black rounded-xl disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
            style={{ 
              background: !message.trim() || disabled 
                ? '#52525b' 
                : 'linear-gradient(to bottom right, #9DFF00, #7ACC00)',
              color: !message.trim() || disabled ? '#a1a1aa' : '#000000'
            }}
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        {/* Bottom Text */}
        <div className="text-center mt-4">
          <p className="text-xs text-zinc-500">
            Join the privacy community for more insights{' '}
            <a href="#" className="hover:underline transition-colors" style={{ color: '#9DFF00' }}>
              Join Discord
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}; 