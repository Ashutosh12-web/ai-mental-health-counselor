import React, { useState, useEffect } from 'react';
import { Search, Filter, MessageCircle } from 'lucide-react';

const JournalPage = ({ userName }) => {
  const [messages, setMessages] = useState([]);
  const [moodHistory, setMoodHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'user', 'ai'

  useEffect(() => {
    const savedMessages = localStorage.getItem(`counselor_messages_${userName}`);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
    
    const savedMoods = localStorage.getItem(`counselor_mood_history_${userName}`);
    if (savedMoods) {
      setMoodHistory(JSON.parse(savedMoods));
    }
  }, [userName]);

  const filteredMessages = messages.filter(msg => {
    const matchesSearch = msg.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || msg.sender === filter;
    return matchesSearch && matchesFilter;
  });

  const getMoodColor = (moodId) => {
    switch (moodId) {
      case 'happy': return 'bg-amber-500';
      case 'neutral': return 'bg-slate-500';
      case 'anxious': return 'bg-red-400';
      case 'stressed': return 'bg-purple-400';
      case 'sad': return 'bg-blue-400';
      default: return 'bg-border';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-card/60 backdrop-blur-xl border border-border rounded-3xl shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
      <div className="px-6 py-5 border-b border-border bg-card/40 z-10">
        <h2 className="font-bold text-foreground text-2xl mb-4">Your Journal</h2>
        
        {/* Mood Sparkline */}
        {moodHistory.length > 0 && (
          <div className="mb-6 bg-background/50 p-4 rounded-2xl border border-border">
            <p className="text-sm text-muted-foreground font-medium mb-3">Recent Moods</p>
            <div className="flex items-end gap-1 h-10 w-full overflow-x-auto custom-scrollbar pb-1">
              {moodHistory.slice(-30).map((entry, i) => (
                <div 
                  key={i} 
                  title={`${new Date(entry.date).toLocaleDateString()}: ${entry.mood}`}
                  className={`w-6 flex-shrink-0 rounded-sm opacity-80 hover:opacity-100 transition-opacity cursor-help ${getMoodColor(entry.mood)}`}
                  style={{ height: `${Math.max(30, Math.random() * 70 + 30)}%` }}
                />
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-10 pr-8 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:outline-none appearance-none cursor-pointer"
            >
              <option value="all">All Messages</option>
              <option value="user">My Messages</option>
              <option value="ai">Haven's Responses</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 custom-scrollbar">
        {filteredMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <MessageCircle size={48} className="mb-4 opacity-20" />
            <p>No messages found.</p>
          </div>
        ) : (
          filteredMessages.map((msg, idx) => (
            <div key={msg.id || idx} className={`p-4 rounded-2xl ${msg.sender === 'ai' ? 'bg-secondary/50 border border-secondary' : 'bg-primary/5 border border-primary/20'}`}>
              <div className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">
                {msg.sender === 'ai' ? 'Haven' : 'You'}
              </div>
              <div className="text-foreground leading-relaxed whitespace-pre-wrap">
                {msg.text}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default JournalPage;
