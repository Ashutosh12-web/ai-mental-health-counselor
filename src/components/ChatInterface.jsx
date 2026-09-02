import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Send, User, Wind, AlertTriangle, X, Settings } from 'lucide-react';
import { generateAIResponse, fetchCrisisResources } from '../services/aiService';
import BreathingExercise from './BreathingExercise';

const ChatInterface = ({ userName, settings }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialMood = location.state?.initialMood || 'neutral';
  const initialMessage = location.state?.initialMessage;

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem(`counselor_messages_${userName}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showBreathing, setShowBreathing] = useState(false);
  const [crisisResources, setCrisisResources] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const hasInitializedRef = useRef(false);
  const initialMessageSentRef = useRef(false);

  useEffect(() => {
    const getResources = async () => {
      const resources = await fetchCrisisResources();
      setCrisisResources(resources);
    };
    getResources();
  }, []);

  useEffect(() => {
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;

    const startChat = async () => {
      // Auto-send initial message from Landing Page opener
      if (initialMessage && !initialMessageSentRef.current) {
        initialMessageSentRef.current = true;
        
        const userMsg = { id: Date.now(), sender: 'user', text: initialMessage };
        setMessages(prev => {
          const newMessages = [...prev, userMsg];
          // Fire the AI response with the updated messages
          handleAutoSend(initialMessage, newMessages);
          return newMessages;
        });
        return;
      }

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
  }, [userName, initialMood, initialMessage]);

  useEffect(() => {
    localStorage.setItem(`counselor_messages_${userName}`, JSON.stringify(messages));
    scrollToBottom();
  }, [messages, isTyping, userName]);

  const handleAutoSend = async (userText, history) => {
    setIsTyping(true);
    try {
      const aiResponse = await generateAIResponse(userText, initialMood, history.slice(0, -1), settings.aiName, settings.aiTone);
      const newAiMsg = { 
        id: Date.now() + 1, 
        sender: 'ai', 
        text: aiResponse.text,
        options: aiResponse.options,
        crisisDetected: aiResponse.crisisDetected,
        crisisDismissed: false
      };
      setMessages(prev => [...prev, newAiMsg]);
    } catch (error) {
      console.error('Error generating AI response:', error);
      const errorMsg = { id: Date.now() + 1, sender: 'ai', text: "I'm having a little trouble connecting right now, but please know I'm still here for you." };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = async (textToSend) => {
    if (!textToSend.trim()) return;

    const userText = textToSend.trim();
    const newUserMsg = { id: Date.now(), sender: 'user', text: userText };
    setMessages(prev => [...prev, newUserMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const aiResponse = await generateAIResponse(userText, initialMood, messages, settings.aiName, settings.aiTone);
      const newAiMsg = { 
        id: Date.now() + 1, 
        sender: 'ai', 
        text: aiResponse.text,
        options: aiResponse.options,
        crisisDetected: aiResponse.crisisDetected,
        crisisDismissed: false
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

  const dismissCrisisAlert = (msgId) => {
    setMessages(prev => prev.map(msg => msg.id === msgId ? { ...msg, crisisDismissed: true } : msg));
  };

  return (
    <div className="flex-1 flex flex-col h-full max-h-[calc(100vh-4rem)] bg-card/60 backdrop-blur-xl border border-border rounded-3xl shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
      {showBreathing && <BreathingExercise onClose={() => setShowBreathing(false)} />}
      
      <div className="px-6 py-4 border-b border-border flex items-center gap-4 bg-card/40">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
          <User size={24} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground m-0">{settings.aiName || 'Dr. Aura'} (AI)</h3>
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
          onClick={() => navigate('/settings')}
          className="p-2 rounded-full hover:bg-accent/10 text-muted-foreground hover:text-foreground transition-colors mr-1"
          title="Settings"
        >
          <Settings size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 custom-scrollbar">
        {messages.map((msg, index) => (
          <div key={msg.id} className="flex flex-col gap-2 w-full">
            {msg.crisisDetected && !msg.crisisDismissed && (
              <div role="alert" className="w-full bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex flex-col gap-3 animate-in slide-in-from-top-2 mb-2 relative">
                <button onClick={() => dismissCrisisAlert(msg.id)} className="absolute top-2 right-2 p-1 text-destructive hover:bg-destructive/10 rounded-full transition-colors" title="Dismiss">
                  <X size={16} />
                </button>
                <div className="flex items-center gap-2 text-destructive font-semibold">
                  <AlertTriangle size={18} />
                  <span>Support is available</span>
                </div>
                <p className="text-sm text-foreground/80 m-0">You are not alone. Please reach out to one of these free, confidential resources:</p>
                <div className="flex flex-col gap-2">
                  {crisisResources.map((resource, i) => (
                    <div key={i} className="bg-background/50 rounded-lg p-3 border border-border">
                      <div className="font-medium">{resource.name}</div>
                      <div className="text-sm text-muted-foreground mb-1">{resource.description}</div>
                      <a href={`tel:${resource.phone}`} className="inline-flex items-center text-primary font-medium hover:underline">
                        Call {resource.phone}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
