import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const BreathingExercise = ({ onClose, inline = false }) => {
  const [phase, setPhase] = useState('Inhale'); // Inhale, Hold, Exhale, Hold
  const [countdown, setCountdown] = useState(4);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev > 1) return prev - 1;

        // Sequence: Inhale (4s) -> Hold (4s) -> Exhale (4s) -> Hold (4s)
        setPhase((currentPhase) => {
          switch (currentPhase) {
            case 'Inhale': return 'Hold';
            case 'Hold': return currentPhase === 'Hold' && countdown === 1 && phase === 'Inhale' ? 'Exhale' : (phase === 'Exhale' ? 'Inhale' : 'Exhale'); // A bit tricky to track which hold, relying on next effect
            default: return 'Inhale';
          }
        });
        return 4;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, countdown, phase]);

  // Better phase tracking
  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
        setPhase(current => {
            if(current === 'Inhale') return 'Hold (Full)';
            if(current === 'Hold (Full)') return 'Exhale';
            if(current === 'Exhale') return 'Hold (Empty)';
            return 'Inhale';
        })
    }, 4000);
    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div className={inline ? "flex flex-col items-center justify-center w-full relative" : "absolute inset-0 bg-background/80 backdrop-blur-md z-50 flex items-center justify-center animate-in fade-in duration-500"}>
      <div className={`w-[90%] max-w-md p-12 flex flex-col items-center relative ${inline ? '' : 'bg-card/50 border border-white/10 rounded-3xl shadow-2xl'}`}>
        {!inline && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        )}

        <h2 className="text-2xl font-bold mb-2">Box Breathing</h2>
        <p className="text-muted-foreground mb-12">4-4-4-4 Technique</p>

        <div className="relative w-64 h-64 flex items-center justify-center">
          <div className="absolute w-40 h-40 rounded-full bg-[radial-gradient(circle,rgba(79,70,229,0.4)_0%,rgba(192,132,252,0.2)_100%)] shadow-[0_0_40px_rgba(79,70,229,0.3)] animate-breathe z-0" />
          
          <div className="relative z-10 text-center">
            <h3 className="text-2xl font-semibold mb-2 drop-shadow-md">{phase.includes('Hold') ? 'Hold' : phase}</h3>
            <div className="text-4xl font-bold text-accent drop-shadow-md">
              {countdown}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreathingExercise;
