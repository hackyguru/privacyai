import { useEffect, useState } from 'react';
import { useChat } from '../hooks/useChat';
import { ChatSidebar } from '../components/ChatSidebar';
import { ChatInterface } from '../components/ChatInterface';
import { WakuStatus } from '../components/WakuStatus';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const {
    sessions,
    currentSession,
    currentMessages,
    isLoading,
    createNewSession,
    selectSession,
    deleteSession,
    sendMessage,
    wakuConnected,
    wakuConnecting,
    wakuError,
  } = useChat();

  // Handle client-side mounting and session creation
  useEffect(() => {
    setMounted(true);
    // Create initial session if none exists (client-side only)
    if (sessions.length === 0) {
      createNewSession();
    }
  }, [sessions.length, createNewSession]);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="h-screen flex bg-black overflow-hidden">
        {/* Sidebar Loading */}
        <div className="w-80 bg-black flex flex-col h-full">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-500 rounded-lg" style={{ background: 'linear-gradient(to bottom right, #9DFF00, #7ACC00)' }}></div>
              <div className="h-4 bg-zinc-700 rounded w-24 animate-pulse"></div>
            </div>
            <div className="h-10 bg-zinc-700 rounded-lg animate-pulse"></div>
          </div>
          <div className="flex-1 p-4">
            <div className="text-zinc-500 text-sm text-center">Loading...</div>
          </div>
        </div>

        {/* Main Area Loading */}
        <div className="flex-1 flex flex-col bg-black p-6">
          <div className="h-16 bg-zinc-800 rounded-2xl mb-4 animate-pulse"></div>
          <div className="flex-1 bg-zinc-800 rounded-2xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-black overflow-hidden">
      {/* Sidebar */}
      <ChatSidebar
        sessions={sessions}
        currentSessionId={currentSession?.id || null}
        onSelectSession={selectSession}
        onCreateSession={createNewSession}
        onDeleteSession={deleteSession}
      />

      {/* Main Chat Area Container */}
      <div className="flex-1 flex flex-col p-6 min-h-0">
        {/* Top Header with User Profile */}
        <div className="border border-zinc-700 rounded-2xl shadow-sm flex items-center justify-between px-6 py-4 mb-4" style={{ backgroundColor: '#2b2c30' }}>
          {/* Session Info - Left Side */}
          <div className="flex items-center gap-4">
            {currentSession ? (
              <div>
                <h2 className="text-lg font-semibold text-white">{currentSession.title}</h2>
                <p className="text-sm text-zinc-400">
                  Created {new Date(currentSession.createdAt).toLocaleDateString()}
                </p>
              </div>
            ) : (
              <div>
                <h2 className="text-lg font-semibold text-white">New Chat</h2>
                <p className="text-sm text-zinc-400">Start a conversation</p>
              </div>
            )}
          </div>
          
          {/* Connection Status - Right Side */}
          <div className="flex items-center">
            <WakuStatus
              isConnected={wakuConnected}
              isConnecting={wakuConnecting}
              error={wakuError}
            />
          </div>
        </div>
        
        {/* Chat Interface - Curved Inset Area */}
        <div className="flex-1 border border-zinc-700 rounded-2xl shadow-sm overflow-hidden" style={{ backgroundColor: '#2b2c30' }}>
          <ChatInterface
            session={currentSession}
            messages={currentMessages}
            onSendMessage={sendMessage}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
