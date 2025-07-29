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
      <div className="h-screen flex bg-zinc-50">
        {/* Sidebar */}
        <div className="w-64 bg-zinc-900 border-r border-zinc-700 flex flex-col h-full">
          <div className="p-4 border-b border-zinc-700">
            <button
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
              aria-label="Create new chat"
            >
              + New Chat
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 text-zinc-400 text-sm text-center">
              Loading...
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col items-center justify-center bg-white">
          <div className="text-center">
            <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-zinc-700 mb-2">Welcome to ChatGPT Clone</h2>
            <p className="text-zinc-500">Loading your chats...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-zinc-50">
      {/* Sidebar */}
      <ChatSidebar
        sessions={sessions}
        currentSessionId={currentSession?.id || null}
        onSelectSession={selectSession}
        onCreateSession={createNewSession}
        onDeleteSession={deleteSession}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Waku Status */}
        <WakuStatus
          isConnected={wakuConnected}
          isConnecting={wakuConnecting}
          error={wakuError}
        />
        
        {/* Chat Interface */}
        <ChatInterface
          session={currentSession}
          messages={currentMessages}
          onSendMessage={sendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
