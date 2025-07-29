interface WakuStatusProps {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}

export const WakuStatus = ({ isConnected, isConnecting, error }: WakuStatusProps) => {
  const getStatusIcon = () => {
    if (isConnecting) {
      return (
        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
      );
    }
    
    if (isConnected && !error) {
      return (
        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
      );
    }
    
    if (isConnected && error) {
      return (
        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
      );
    }
    
    return (
      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
    );
  };

  const getStatusText = () => {
    if (isConnecting) return 'Connecting to Waku...';
    if (isConnected && !error) return 'Connected to Waku Network';
    if (isConnected && error) return 'Demo Mode (Waku Simulated)';
    if (error) return `Waku: ${error}`;
    return 'Disconnected from Waku';
  };

  const getStatusColor = () => {
    if (isConnecting) return 'text-yellow-600';
    if (isConnected && !error) return 'text-green-600';
    if (isConnected && error) return 'text-blue-600';
    return 'text-red-600';
  };

  return (
    <div className="flex items-center justify-between px-3 py-2 bg-zinc-50 border-b border-zinc-200">
      <div className="flex items-center gap-2">
        {getStatusIcon()}
        <span className={`text-xs font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </span>
        {isConnected && (
          <div className="flex items-center gap-4 text-xs text-zinc-500">
            <span>📤 Request: /privacyai/1/chat-request/proto</span>
            <span>📥 Response: /privacyai/1/chat-response/proto</span>
            {error && <span className="text-blue-600">(Simulated)</span>}
          </div>
        )}
      </div>
    </div>
  );
}; 