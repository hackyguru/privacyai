interface WakuStatusProps {
  isConnected: boolean;
  isConnecting: boolean;
  error?: string | null;
}

export const WakuStatus = ({ isConnected, isConnecting, error }: WakuStatusProps) => {
  if (error) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-red-900 border border-red-700 rounded-lg">
        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
        <span className="text-xs font-medium text-red-300">Network Error</span>
      </div>
    );
  }

  if (isConnecting) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-900 border border-yellow-700 rounded-lg">
        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
        <span className="text-xs font-medium text-yellow-300">Connecting...</span>
      </div>
    );
  }

  if (isConnected) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 border border-zinc-600 rounded-lg">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#9DFF00' }}></div>
        <span className="text-xs font-medium" style={{ color: '#9DFF00' }}>Connected</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 border border-zinc-600 rounded-lg">
      <div className="w-2 h-2 bg-zinc-500 rounded-full"></div>
      <span className="text-xs font-medium text-zinc-400">Disconnected</span>
    </div>
  );
}; 