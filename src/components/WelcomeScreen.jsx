import React, { useState } from 'react';

const WelcomeScreen = ({ onComplete }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onComplete(name.trim());
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center text-center gap-8 max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="p-10 md:p-12 w-full bg-card/60 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl">
        <h1 className="text-4xl font-bold text-foreground mb-4">Welcome.</h1>
        <p className="text-muted-foreground leading-relaxed">
          I am your AI Mental Health Counselor. I'm here to listen, support, and help you navigate your feelings safely.
        </p>
        
        <form onSubmit={handleSubmit} className="mt-8">
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="What should I call you?"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              className="w-full px-5 py-4 rounded-xl border border-border bg-background/50 text-foreground text-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
            <button 
              type="submit" 
              disabled={!name.trim()}
              className="w-full py-4 rounded-xl font-semibold bg-primary text-primary-foreground shadow-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Start Session
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WelcomeScreen;
