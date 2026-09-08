import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Send, User, Wind, AlertTriangle, X, Settings, Anchor, Heart, PlayCircle, Mic, MicOff, Volume2 } from 'lucide-react';
import { generateAIResponseStream, fetchCrisisResources } from '../services/aiService';
import BreathingExercise from './BreathingExercise';

export const getWaitingOptions = (mood) => {
  const options = [
    { id: 'breathe', label: 'Try a Breathing Exercise' },
    { id: 'quote', label: 'Read a comforting quote' }
  ];
  if (['anxious', 'stressed', 'overwhelmed', 'angry'].includes(mood)) {
    options.push({ id: 'grounding', label: 'Try 5-4-3-2-1 Grounding' });
    options.push({ id: 'video', label: 'Watch a calming nature video' });
  } else {
    options.push({ id: 'video', label: 'Watch a relaxing visual' });
  }
  return options;
};

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
  const [connectionStatus, setConnectionStatus] = useState('green'); // green, yellow, red
  const [retrySeconds, setRetrySeconds] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setInputMessage(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
        alert("Your browser does not support voice input. Please try Chrome or Edge.");
        return;
      }
      setInputMessage('');
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const strippedText = text.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*/g, '');
      const utterance = new SpeechSynthesisUtterance(strippedText);
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    let interval;
    if (connectionStatus === 'yellow' || connectionStatus === 'red') {
      interval = setInterval(() => {
        setRetrySeconds(prev => prev + 1);
      }, 1000);
    } else {
      setRetrySeconds(0);
    }
    return () => clearInterval(interval);
  }, [connectionStatus]);

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



  const handleWaitingOption = (optionId, msgId) => {
    if (optionId === 'breathe') {
      setShowBreathing(true);
    } else if (optionId === 'grounding') {
      setMessages(prev => prev.map(msg => msg.id === msgId ? {
        ...msg,
        text: "**5-4-3-2-1 Grounding Technique:**\n\nTake a slow deep breath, then look around you and identify:\n- **5** things you can see\n- **4** things you can physically feel\n- **3** things you can hear\n- **2** things you can smell\n- **1** thing you can taste\n\n*(Still trying to connect in the background...)*"
      } : msg));
    } else if (optionId === 'quote') {
      setMessages(prev => prev.map(msg => msg.id === msgId ? {
        ...msg,
        text: `**Finding a comforting thought...**\n\n*(Still trying to connect in the background...)*`
      } : msg));

      const fetchQuote = async () => {
        let finalQuote = "";
        try {
          let tags = "inspirational";
          if (['anxious', 'stressed', 'overwhelmed', 'angry'].includes(initialMood)) {
            tags = "wisdom|patience|courage|strength";
          } else if (['sad', 'depressed', 'lonely'].includes(initialMood)) {
            tags = "inspirational|hope|happiness";
          }
          
          const response = await fetch(`https://api.quotable.io/random?tags=${tags}`);
          if (!response.ok) throw new Error("API down");
          const data = await response.json();
          finalQuote = `"${data.content}" — ${data.author}`;
        } catch (error) {
          console.error("Quote fetch failed, using fallback", error);
          const fallbackQuotes = [
            "\"You don't have to control your thoughts. You just have to stop letting them control you.\" — Dan Millman",
            "\"Out of suffering have emerged the strongest souls; the most massive characters are seared with scars.\" — Kahlil Gibran",
            "\"Promise me you'll always remember: You're braver than you believe, and stronger than you seem, and smarter than you think.\" — A.A. Milne",
            "\"Healing takes time, and asking for help is a courageous step.\" — Mariska Hargitay",
            "\"There is a crack in everything, that's how the light gets in.\" — Leonard Cohen",
            "\"Your present circumstances don't determine where you can go; they merely determine where you start.\" — Nido Qubein",
            "\"Not until we are lost do we begin to understand ourselves.\" — Henry David Thoreau",
            "\"Tough times never last, but tough people do.\" — Robert H. Schuller",
            "\"You are not a drop in the ocean. You are the entire ocean in a drop.\" — Rumi"
          ];
          finalQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
        }
        
        setMessages(prev => prev.map(msg => msg.id === msgId ? {
          ...msg,
          text: `**A comforting thought:**\n\n${finalQuote}\n\n*(Still trying to connect in the background...)*`
        } : msg));
      };
      
      fetchQuote();
    } else if (optionId === 'video') {
      setMessages(prev => prev.map(msg => msg.id === msgId ? {
        ...msg,
        videoUrl: 'https://www.youtube.com/embed/inpok4MKVLM?autoplay=1&mute=1&loop=1',
        text: `**Relaxing Visuals:**\n\nTake a moment to watch this calming scene while we wait.\n\n*(Still trying to connect in the background...)*`
      } : msg));
    }
  };

  const handleAutoSend = async (userText, history) => {
    setIsTyping(true);
    const newAiMsgId = Date.now() + 1;
    setMessages(prev => [...prev, {
      id: newAiMsgId,
      sender: 'ai',
      text: '',
      options: [],
      crisisDetected: false,
      crisisDismissed: false
    }]);

    await generateAIResponseStream(userText, initialMood, history.slice(0, -1), settings.aiName, settings.aiTone, {
      onStatus: (status) => setConnectionStatus(status),
      onMeta: (crisisDetected) => {
        setMessages(prev => prev.map(msg => msg.id === newAiMsgId ? { ...msg, crisisDetected } : msg));
      },
      onChunk: (chunkText) => {
        setIsTyping(false);
        setMessages(prev => prev.map(msg => msg.id === newAiMsgId ? { ...msg, text: msg.text + chunkText } : msg));
      },
      onDone: () => {
        setIsTyping(false);
        setConnectionStatus('green');
      },
      onError: (err) => {
        console.error(err);
        setMessages(prev => prev.map(msg => msg.id === newAiMsgId ? { 
          ...msg, 
          text: "I'm having a little trouble connecting right now, but I'm still trying in the background. While we wait, would you like to try one of these?",
          waitingOptions: getWaitingOptions(initialMood)
        } : msg));
        setIsTyping(false);
      },
      onRecovered: () => {
        setIsTyping(true);
        // Clear the error message to make way for real stream
        setMessages(prev => prev.map(msg => msg.id === newAiMsgId ? { ...msg, text: "", waitingOptions: null, videoUrl: null } : msg));
      }
    });
  };

  const handleSendMessage = async (textToSend) => {
    if (!textToSend.trim()) return;

    const userText = textToSend.trim();
    const newUserMsg = { id: Date.now(), sender: 'user', text: userText };
    setMessages(prev => [...prev, newUserMsg]);
    setInputMessage('');
    setIsTyping(true);

    const newAiMsgId = Date.now() + 1;
    setMessages(prev => [...prev, {
      id: newAiMsgId,
      sender: 'ai',
      text: '',
      options: [],
      crisisDetected: false,
      crisisDismissed: false
    }]);

    await generateAIResponseStream(userText, initialMood, messages, settings.aiName, settings.aiTone, {
      onStatus: (status) => setConnectionStatus(status),
      onMeta: (crisisDetected) => {
        setMessages(prev => prev.map(msg => msg.id === newAiMsgId ? { ...msg, crisisDetected } : msg));
      },
      onChunk: (chunkText) => {
        setIsTyping(false);
        setMessages(prev => prev.map(msg => msg.id === newAiMsgId ? { ...msg, text: msg.text + chunkText } : msg));
      },
      onDone: () => {
        setIsTyping(false);
        setConnectionStatus('green');
      },
      onError: (err) => {
        console.error(err);
        setMessages(prev => prev.map(msg => msg.id === newAiMsgId ? { 
          ...msg, 
          text: "I'm having a little trouble connecting right now, but I'm still trying in the background. While we wait, would you like to try one of these?",
          waitingOptions: getWaitingOptions(initialMood)
        } : msg));
        setIsTyping(false);
      },
      onRecovered: () => {
        setIsTyping(true);
        // Clear the error message to make way for real stream
        setMessages(prev => prev.map(msg => msg.id === newAiMsgId ? { ...msg, text: "", waitingOptions: null } : msg));
      }
    });

    if (userText.toLowerCase().includes('deep breath')) {
      setTimeout(() => setShowBreathing(true), 1500);
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
        <div className="flex-1 flex items-center gap-2">
          <div>
            <h3 className="font-semibold text-foreground m-0 flex items-center gap-2">
              {settings.aiName || 'Dr. Aura'} (AI)
              <div className="flex items-center gap-1.5 bg-background/50 px-2 py-0.5 rounded-full border border-border/50">
                <div 
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    connectionStatus === 'green' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' :
                    connectionStatus === 'yellow' ? 'bg-yellow-500 animate-pulse shadow-[0_0_8px_rgba(234,179,8,0.6)]' :
                    'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]'
                  }`} 
                  title={
                    connectionStatus === 'green' ? 'Connected' :
                    connectionStatus === 'yellow' ? 'Connecting/Retrying...' :
                    'Connection Failed'
                  }
                />
                {(connectionStatus === 'yellow' || connectionStatus === 'red') && (
                  <span className="text-[10px] text-muted-foreground font-mono font-medium tracking-tighter w-4 text-center">
                    {retrySeconds}s
                  </span>
                )}
              </div>
            </h3>
            <p className="text-sm text-muted-foreground m-0">Mental Health Assistant</p>
          </div>
        </div>
        <button  
          onClick={() => setShowBreathing(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent hover:bg-accent/30 transition-colors border border-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          title="Take a mindful breath"
          aria-label="Take a mindful breath"
        >
          <Wind size={18} />
          <span className="font-medium text-sm">Breathe</span>
        </button>
        <button 
          onClick={() => navigate('/settings')}
          className="p-2 rounded-full hover:bg-accent/10 text-muted-foreground hover:text-foreground transition-colors mr-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          title="Settings"
          aria-label="Settings"
        >
          <Settings size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 custom-scrollbar">
        {messages.map((msg, index) => (
          <div key={msg.id} className="flex flex-col gap-2 w-full">
            {msg.crisisDetected && !msg.crisisDismissed && (
              <div role="alert" className="w-full bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex flex-col gap-3 animate-in slide-in-from-top-2 mb-2 relative">
                <button onClick={() => dismissCrisisAlert(msg.id)} className="absolute top-2 right-2 p-1 text-destructive hover:bg-destructive/10 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2" title="Dismiss" aria-label="Dismiss Alert">
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
            <div className={`max-w-[80%] p-4 rounded-2xl leading-relaxed animate-in fade-in slide-in-from-bottom-2 ${msg.sender === 'ai' ? 'self-start bg-secondary text-secondary-foreground rounded-bl-sm relative group/bubble' : 'self-end bg-primary text-primary-foreground rounded-br-sm'}`}>
              
              {msg.sender === 'ai' && msg.text && (
                <button 
                  onClick={() => speakText(msg.text)}
                  className="absolute -right-10 top-2 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent/20 transition-all opacity-0 group-hover/bubble:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  title="Read Aloud"
                  aria-label="Read Aloud"
                >
                  <Volume2 size={18} />
                </button>
              )}

              <div className={`prose prose-sm max-w-none ${msg.sender === 'user' ? 'prose-invert' : 'dark:prose-invert'}`}>
                {msg.text.split('\n').map((line, i) => (
                  <p key={i} className="m-0 mb-1 last:mb-0">
                    {line.startsWith('**') && line.endsWith('**') ? 
                      <strong>{line.replace(/\*\*/g, '')}</strong> :
                      line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').split('<strong>').map((part, j) => {
                        if (part.includes('</strong>')) {
                          const [bold, rest] = part.split('</strong>');
                          return <React.Fragment key={j}><strong>{bold}</strong>{rest}</React.Fragment>;
                        }
                        return part;
                      })
                    }
                  </p>
                ))}
              </div>
              
              {msg.videoUrl && (
                <div className="mt-4 rounded-xl overflow-hidden border border-border">
                  <iframe 
                    width="100%" 
                    height="200" 
                    src={msg.videoUrl} 
                    title="Calming Video" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen 
                  />
                </div>
              )}
              
              {msg.waitingOptions && (
                <div className="mt-4 flex flex-col gap-2">
                  {msg.waitingOptions.map(option => (
                    <button
                      key={option.id}
                      onClick={() => handleWaitingOption(option.id, msg.id)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border text-sm font-medium text-foreground hover:bg-accent/20 hover:text-accent hover:border-accent/40 transition-all text-left w-full group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      <span className="text-muted-foreground group-hover:text-accent transition-colors">
                        {option.id === 'breathe' && <Wind size={16} />}
                        {option.id === 'grounding' && <Anchor size={16} />}
                        {option.id === 'quote' && <Heart size={16} />}
                        {option.id === 'video' && <PlayCircle size={16} />}
                      </span>
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className={`text-[10px] text-muted-foreground/60 mt-1 px-1 ${msg.sender === 'ai' ? 'self-start' : 'self-end'}`}>
              {new Date(msg.id).toLocaleString([], { hour: 'numeric', minute: '2-digit', month: 'short', day: 'numeric' })}
            </div>
            {msg.options && msg.options.length > 0 && msg.sender === 'ai' && index === messages.length - 1 && !isTyping && (
              <div className="flex flex-wrap gap-2 mt-2 self-start animate-in slide-in-from-bottom-4 fade-in duration-500">
                {msg.options.map((option, i) => (
                  <button 
                    key={i} 
                    className="px-4 py-2 rounded-full text-sm bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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
          <button
            type="button"
            onClick={toggleRecording}
            className={`p-3 rounded-full flex-shrink-0 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
              isRecording ? 'bg-red-500 text-white animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground'
            }`}
            aria-label={isRecording ? "Stop Recording" : "Start Voice Recording"}
            title={isRecording ? "Stop Recording" : "Start Voice Recording"}
          >
            {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={isRecording ? "Listening..." : "Type your message..."}
            className="flex-1 bg-background border border-border rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-muted-foreground/60 shadow-sm"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isTyping}
            className="bg-primary text-primary-foreground p-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all shadow-md flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label="Send Message"
          >
            <Send size={20} className={inputMessage.trim() && !isTyping ? 'translate-x-0.5' : ''} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
