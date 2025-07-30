import { Brain, Search, History, Settings, Plus, MessageCircle, Trash2 } from 'lucide-react';
import { ChatSession } from '../types/chat';
import { useState } from 'react';

interface ChatSidebarProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onCreateSession: () => void;
  onDeleteSession: (sessionId: string) => void;
}

export const ChatSidebar = ({
  sessions,
  currentSessionId,
  onSelectSession,
  onCreateSession,
  onDeleteSession,
}: ChatSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleDeleteSession = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this chat?')) {
      onDeleteSession(sessionId);
    }
  };

  const filteredSessions = sessions.filter(session =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const navigationItems = [
    { name: 'History', icon: History, active: true },
    { name: 'Settings', icon: Settings, active: false },
  ];

  return (
    <div className="w-80 bg-black flex flex-col h-full">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
        <Brain className="w-8 h-8 text-[#9DFF00]" />
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-zinc-400" />
          </div>
          <input
            type="text"
            placeholder="Search chat"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-sm text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:border-transparent"
            style={{ 
              '--tw-ring-color': '#9DFF00'
            } as React.CSSProperties}
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="px-6 py-4">
        <nav className="space-y-1">
          {navigationItems.map((item) => (
            <div
              key={item.name}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                item.active
                  ? 'text-black font-medium'
                  : 'text-zinc-300 hover:bg-zinc-800'
              }`}
              style={item.active ? { backgroundColor: '#9DFF00' } : {}}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.name}</span>
            </div>
          ))}
        </nav>
      </div>

      {/* Recent Chats Section */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="px-6 pb-2 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Recent Chats</h3>
            <button
              onClick={onCreateSession}
              className="p-1 text-zinc-400 transition-colors"
              style={{ color: '#9DFF00' }}
              aria-label="Create new chat"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sessions List - Now properly scrollable */}
        <div className="flex-1 overflow-y-auto px-6 min-h-0">
          {filteredSessions.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-zinc-500 text-sm">
                {searchQuery ? 'No chats found' : 'No chats yet'}
              </div>
              {!searchQuery && (
                <button
                  onClick={onCreateSession}
                  className="mt-2 text-sm font-medium transition-colors"
                  style={{ color: '#9DFF00' }}
                >
                  Start your first chat
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-1">
              {filteredSessions.map((session) => (
                <div
                  key={session.id}
                  className={`group relative flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border ${
                    currentSessionId === session.id
                      ? 'border-zinc-600 shadow-sm'
                      : 'hover:bg-zinc-900 border-transparent'
                  }`}
                  style={currentSessionId === session.id ? { backgroundColor: '#2b2c30' } : {}}
                  onClick={() => onSelectSession(session.id)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Select chat: ${session.title}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectSession(session.id);
                    }
                  }}
                >
                  <div className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-4 h-4 text-zinc-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">
                      {session.title}
                    </div>
                    <div className="text-xs text-zinc-400">
                      {new Date(session.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                                      <button
                      onClick={(e) => handleDeleteSession(e, session.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-900 rounded text-zinc-400 hover:text-red-400 transition-all"
                      aria-label="Delete chat"
                      tabIndex={0}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upgrade Section */}
      <div className="p-6">
        <div className="rounded-xl p-4 text-black" style={{ background: 'linear-gradient(to right, #9DFF00, #7ACC00)' }}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-black/20 rounded flex items-center justify-center">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="font-semibold text-sm">Upgrade to PRO</span>
          </div>
          <p className="text-xs text-black/80 mb-3">
            Unlock advanced features and unlimited conversations
          </p>
          <button className="w-full bg-black text-white text-sm font-medium py-2 px-4 rounded-lg hover:bg-gray-900 transition-colors">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}; 