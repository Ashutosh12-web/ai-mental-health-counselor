import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Wind } from 'lucide-react';
import { generateAIResponse } from '../services/aiService';
import BreathingExercise from './BreathingExercise';

const ChatInterface = ({ userName, initialMood, onReset }) => {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem(`counselor_messages_${userName}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showBreathing, setShowBreathing] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const hasInitializedRef = useRef(false);

  useEffect(() => {
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;

    const startChat = async () => {
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const savedMessages = localStorage.getItem(`counselor_messages_${userName}`);
      const isReturning = savedMessages && JSON.parse(savedMessages).length > 0;
      
      let initialText = isReturning
        ? `Welcome back, ${userName}. I see you're feeling ${initialMood} today. How can I support you?`
        : `Hello ${userName}. I understand you're feeling ${initialMood} right now. I'm here to support you. What's on your mind?`;

      if (!isReturning && (initialMood === 'happy' || initialMood === 'neutral')) {
        initialText = `Hello ${userName}. It's good to see you're feeling ${initialMood}. What would you like to talk about today?`;
      } else if (isReturning && (initialMood === 'happy' || initialMood === 'neutral')) {
        initialText = `Welcome back, ${userName}. I'm glad to see you're feeling ${initialMood} today. What would you like to talk about?`;
      }
      
      setMessages(prev => [...prev, { id: Date.now(), sender: 'ai', text: initialText }]);
      setIsTyping(false);
    };

    startChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userName, initialMood]);

  useEffect(() => {
    localStorage.setItem(`counselor_messages_${userName}`, JSON.stringify(messages));
    scrollToBottom();
  }, [messages, isTyping, userName]);

  const handleSendMessage = async (textToSend) => {
    if (!textToSend.trim()) return;

    const userText = textToSend.trim();
    const newUserMsg = { id: Date.now(), sender: 'user', text: userText };
    setMessages(prev => [...prev, newUserMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const aiResponse = await generateAIResponse(userText, initialMood, messages);
      const newAiMsg = { 
        id: Date.now() + 1, 
        sender: 'ai', 
        text: aiResponse.text,
        options: aiResponse.options 
      };
      setMessages(prev => [...prev, newAiMsg]);
      
      if (userText.toLowerCase().includes('deep breath')) {
        setTimeout(() => setShowBreathing(true), 1500);
      }
    } catch (error) {
      console.error('Error generating AI response:', error);
      const errorMsg = { id: Date.now() + 1, sender: 'ai', text: "I'm having a little trouble connecting right now, but please know I'm still here for you." };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSendMessage(inputMessage);
  };

  return (
    <div className="flex-1 flex flex-col h-full max-h-[calc(100vh-4rem)] bg-card/60 backdrop-blur-xl border border-border rounded-3xl shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
      {showBreathing && <BreathingExercise onClose={() => setShowBreathing(false)} />}
      
      <div className="px-6 py-4 border-b border-border flex items-center gap-4 bg-card/40">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
          <User size={24} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground m-0">Dr. Aura (AI)</h3>
          <p className="text-sm text-muted-foreground m-0">Mental Health Assistant</p>
        </div>
        <button 
          onClick={() => setShowBreathing(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent hover:bg-accent/30 transition-colors border border-accent/30"
          title="Take a mindful breath"
        >
          <Wind size={18} />
          <span className="font-medium text-sm">Breathe</span>
        </button>
        <button 
          onClick={onReset}
          className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors border border-transparent hover:border-destructive/20"
        >
          Sign Out
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 custom-scrollbar">
        {messages.map((msg, index) => (
          <div key={msg.id} className="flex flex-col gap-2 w-full">
            <div className={`max-w-[80%] p-4 rounded-2xl leading-relaxed animate-in fade-in slide-in-from-bottom-2 ${msg.sender === 'ai' ? 'self-start bg-secondary text-secondary-foreground rounded-bl-sm' : 'self-end bg-primary text-primary-foreground rounded-br-sm'}`}>
              {msg.text}
            </div>
            {msg.options && msg.sender === 'ai' && index === messages.length - 1 && !isTyping && (
              <div className="flex flex-wrap gap-2 mt-2 self-start animate-in slide-in-from-bottom-4 fade-in duration-500">
                {msg.options.map((option, i) => (
                  <button 
                    key={i} 
                    className="px-4 py-2 rounded-full text-sm bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                    onClick={() => handleSendMessage(option)}
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-1 p-4 bg-secondary rounded-2xl rounded-bl-sm self-start w-fit">
            <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="p-4 md:p-6 border-t border-border bg-card/40" onSubmit={handleFormSubmit}>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Type your message here..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={isTyping}
            className="flex-1 px-5 py-3 rounded-full border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 transition-all"
          />
          <button 
            type="submit" 
            disabled={!inputMessage.trim() || isTyping}
            className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
          >
            <Send size={20} className="mr-1" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
