import React from 'react';
import { Smile, Meh, Frown, AlertCircle, CloudRain } from 'lucide-react';

const moods = [
  { id: 'happy', label: 'Happy / Okay', icon: Smile, baseColor: 'text-amber-500', bgHover: 'hover:bg-amber-500/10', borderHover: 'hover:border-amber-500/50' },
  { id: 'neutral', label: 'Neutral', icon: Meh, baseColor: 'text-slate-500', bgHover: 'hover:bg-slate-500/10', borderHover: 'hover:border-slate-500/50' },
  { id: 'anxious', label: 'Anxious', icon: AlertCircle, baseColor: 'text-red-400', bgHover: 'hover:bg-red-400/10', borderHover: 'hover:border-red-400/50' },
  { id: 'stressed', label: 'Stressed', icon: CloudRain, baseColor: 'text-purple-400', bgHover: 'hover:bg-purple-400/10', borderHover: 'hover:border-purple-400/50' },
  { id: 'sad', label: 'Sad / Low', icon: Frown, baseColor: 'text-blue-400', bgHover: 'hover:bg-blue-400/10', borderHover: 'hover:border-blue-400/50' }
];

const MoodSelector = ({ userName, onSelect, onReset }) => {
  return (
    <div className="flex-1 flex flex-col justify-center items-center gap-12 animate-in fade-in zoom-in-95 duration-500 relative">
      <button 
        onClick={onReset}
        className="absolute top-0 right-0 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
      >
        Sign Out
      </button>

      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">Hi, {userName}.</h2>
        <p className="text-lg text-muted-foreground">
          How are you feeling right now?
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-6">
        {moods.map((mood) => {
          const Icon = mood.icon;
          return (
            <button
              key={mood.id}
              onClick={() => onSelect(mood.id)}
              className={`flex flex-col items-center justify-center gap-4 w-32 h-36 bg-card border-2 border-transparent rounded-2xl cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${mood.bgHover} ${mood.borderHover} group`}
            >
              <div className={`p-4 rounded-full bg-white/5 flex items-center justify-center transition-colors ${mood.baseColor} group-hover:bg-white/10`}>
                <Icon size={36} />
              </div>
              <span className="font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                {mood.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MoodSelector;
