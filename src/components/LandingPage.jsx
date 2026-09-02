import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Smile, Meh, Frown, AlertCircle, CloudRain, ArrowRight, Sparkles } from 'lucide-react';

const moods = [
  { 
    id: 'happy', label: 'Happy / Okay', icon: Smile, baseColor: 'text-amber-500', bgHover: 'hover:bg-amber-500/10', borderHover: 'hover:border-amber-500/50',
    openers: ["I'm having a good day today.", "Things are going well.", "I just wanted to check in and share some good news."]
  },
  { 
    id: 'neutral', label: 'Neutral', icon: Meh, baseColor: 'text-slate-500', bgHover: 'hover:bg-slate-500/10', borderHover: 'hover:border-slate-500/50',
    openers: ["I'm just feeling okay today.", "Nothing much is going on.", "I don't have anything specific to talk about."]
  },
  { 
    id: 'anxious', label: 'Anxious', icon: AlertCircle, baseColor: 'text-red-400', bgHover: 'hover:bg-red-400/10', borderHover: 'hover:border-red-400/50',
    openers: ["I feel overwhelmed right now.", "I can't stop worrying about things.", "I just need to take a breath."]
  },
  { 
    id: 'stressed', label: 'Stressed', icon: CloudRain, baseColor: 'text-purple-400', bgHover: 'hover:bg-purple-400/10', borderHover: 'hover:border-purple-400/50',
    openers: ["I have too much on my plate.", "I'm feeling completely burnt out.", "I don't know how to handle all this pressure."]
  },
  { 
    id: 'sad', label: 'Sad / Low', icon: Frown, baseColor: 'text-blue-400', bgHover: 'hover:bg-blue-400/10', borderHover: 'hover:border-blue-400/50',
    openers: ["I'm feeling really down today.", "I just feel empty.", "Everything feels a bit hopeless right now."]
  }
];

const LandingPage = ({ userName, setUserName }) => {
  const navigate = useNavigate();
  const [nameInput, setNameInput] = useState('');
  const [selectedMood, setSelectedMood] = useState(null);

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (nameInput.trim()) {
      setUserName(nameInput.trim());
      localStorage.setItem('counselor_userName', nameInput.trim());
    }
  };

  const handleSkip = () => {
    navigate('/chat');
  };

  const handleOpenerSelect = (opener) => {
    // Save mood history for the sparkline
    const historyStr = localStorage.getItem(`counselor_mood_history_${userName}`) || '[]';
    const history = JSON.parse(historyStr);
    history.push({ date: new Date().toISOString(), mood: selectedMood.id });
    localStorage.setItem(`counselor_mood_history_${userName}`, JSON.stringify(history));

    // To auto-send, we pass it via state
    navigate('/chat', { state: { initialMessage: opener, initialMood: selectedMood.id } });
  };

  if (!userName) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-500 relative overflow-hidden">
        {/* Background gradients */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl opacity-50 translate-x-1/3 -translate-y-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/15 rounded-full blur-3xl opacity-50 -translate-x-1/3 translate-y-1/3 pointer-events-none" />

        <div className="bg-card/60 backdrop-blur-xl border border-border p-8 rounded-3xl shadow-2xl max-w-md w-full text-center z-10">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="text-primary w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">Welcome to Haven.</h1>
          <p className="text-muted-foreground mb-8">Your private, AI-powered space to reflect and find balance. What should I call you?</p>
          <form onSubmit={handleNameSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Your preferred name..."
              className="px-6 py-4 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:outline-none text-lg text-center"
              autoFocus
            />
            <button
              type="submit"
              disabled={!nameInput.trim()}
              className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 md:p-8 animate-in fade-in duration-500 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl opacity-50 -translate-x-1/3 -translate-y-1/3 pointer-events-none" />
      
      {!selectedMood ? (
        <div className="flex flex-col items-center justify-center w-full max-w-2xl animate-in zoom-in-95 duration-300 z-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Hi, {userName}.</h2>
            <p className="text-lg text-muted-foreground">How are you feeling right now?</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-12 w-full">
            {moods.map((mood) => {
              const Icon = mood.icon;
              return (
                <button
                  key={mood.id}
                  onClick={() => setSelectedMood(mood)}
                  className={`flex flex-col items-center justify-center gap-4 w-28 h-32 md:w-32 md:h-36 bg-card border border-border rounded-2xl cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${mood.bgHover} ${mood.borderHover} group`}
                >
                  <div className={`p-4 rounded-full bg-foreground/5 flex items-center justify-center transition-colors ${mood.baseColor} group-hover:bg-foreground/10`}>
                    <Icon size={36} />
                  </div>
                  <span className="font-medium text-muted-foreground group-hover:text-foreground transition-colors text-sm md:text-base">
                    {mood.label}
                  </span>
                </button>
              );
            })}
          </div>

          <button 
            onClick={handleSkip}
            className="text-muted-foreground hover:text-foreground underline underline-offset-4 text-sm font-medium transition-colors"
          >
            Skip check-in
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full max-w-xl animate-in slide-in-from-bottom-8 duration-500 z-10">
          <button 
            onClick={() => setSelectedMood(null)}
            className="self-start mb-6 text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <ArrowRight className="rotate-180" size={16} /> Back to moods
          </button>
          
          <div className="w-full bg-card/60 backdrop-blur-xl border border-border p-6 md:p-8 rounded-3xl shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <selectedMood.icon className={selectedMood.baseColor} size={28} />
              <h3 className="text-xl font-semibold">Starting points</h3>
            </div>
            <p className="text-muted-foreground mb-6">Tap a thought to send it to Haven and start your session, or skip to type your own.</p>
            
            <div className="flex flex-col gap-3 mb-8">
              {selectedMood.openers.map((opener, i) => (
                <button
                  key={i}
                  onClick={() => handleOpenerSelect(opener)}
                  className="text-left w-full p-4 rounded-xl border border-border bg-background hover:border-primary hover:bg-primary/5 transition-all group flex items-center justify-between"
                >
                  <span className="text-foreground group-hover:text-primary transition-colors">{opener}</span>
                  <ArrowRight size={18} className="text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-primary transition-all -translate-x-2 group-hover:translate-x-0" />
                </button>
              ))}
            </div>

            <button 
              onClick={handleSkip}
              className="w-full text-center text-muted-foreground hover:text-foreground underline underline-offset-4 text-sm font-medium transition-colors"
            >
              Skip and type my own message
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
