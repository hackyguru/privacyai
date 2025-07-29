import { useState } from 'react';
import { WakuMessage } from '../types/waku';

interface WakuTestPanelProps {
  currentSessionId: string | null;
  isConnected: boolean;
  onSendResponse: (message: WakuMessage) => void;
}

export const WakuTestPanel = ({ currentSessionId, isConnected, onSendResponse }: WakuTestPanelProps) => {
  const [responseText, setResponseText] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const predefinedResponses = [
    "Hello! This is an AI response sent through the Waku decentralized network.",
    "Your message was successfully received via Waku protocol. The network is working perfectly!",
    "I'm an AI assistant running on the decentralized web using Waku for messaging.",
    "This demonstrates real-time communication through Waku's censorship-resistant network.",
    "Waku enables privacy-preserving, decentralized messaging for Web3 applications."
  ];

  const handleSendResponse = () => {
    if (!responseText.trim() || !currentSessionId) return;

    const responseMessage: WakuMessage = {
      sessionId: currentSessionId,
      messageId: Date.now().toString(),
      content: responseText.trim(),
      timestamp: new Date().toISOString(),
      type: 'response'
    };

    onSendResponse(responseMessage);
    setResponseText('');
  };

  const handlePredefinedResponse = (response: string) => {
    if (!currentSessionId) return;

    const responseMessage: WakuMessage = {
      sessionId: currentSessionId,
      messageId: Date.now().toString(),
      content: response,
      timestamp: new Date().toISOString(),
      type: 'response'
    };

    onSendResponse(responseMessage);
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-zinc-800 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-zinc-700 transition-colors z-50"
      >
        🧪 Waku Test Panel
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white border border-zinc-300 rounded-lg shadow-xl z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-zinc-200 bg-zinc-50 rounded-t-lg">
        <h3 className="font-semibold text-sm">🧪 Waku AI Test Panel</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-zinc-500 hover:text-zinc-700 text-sm"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="p-3 space-y-3">
        <div className="text-xs text-zinc-600">
          <div className="flex items-center gap-2 mb-2">
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></span>
            <span>{isConnected ? 'Waku Connected' : 'Waku Disconnected'}</span>
          </div>
          <p>Simulate AI responses sent via Waku response topic</p>
        </div>

        {/* Quick Responses */}
        <div>
          <label className="text-xs font-medium text-zinc-700 block mb-2">Quick AI Responses:</label>
          <div className="space-y-1">
            {predefinedResponses.map((response, index) => (
              <button
                key={index}
                onClick={() => handlePredefinedResponse(response)}
                disabled={!isConnected || !currentSessionId}
                className="w-full text-left text-xs p-2 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {response.substring(0, 60)}...
              </button>
            ))}
          </div>
        </div>

        {/* Custom Response */}
        <div>
          <label className="text-xs font-medium text-zinc-700 block mb-2">Custom AI Response:</label>
          <textarea
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
            placeholder="Type a custom AI response..."
            className="w-full text-xs border border-zinc-300 rounded px-2 py-2 h-20 resize-none focus:outline-none focus:ring-1 focus:ring-zinc-500"
          />
          <button
            onClick={handleSendResponse}
            disabled={!responseText.trim() || !isConnected || !currentSessionId}
            className="w-full mt-2 bg-zinc-800 text-white text-xs py-2 rounded hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send via Waku Response Topic
          </button>
        </div>

        {!currentSessionId && (
          <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
            ⚠️ No active chat session. Create a chat first.
          </div>
        )}
      </div>
    </div>
  );
}; 