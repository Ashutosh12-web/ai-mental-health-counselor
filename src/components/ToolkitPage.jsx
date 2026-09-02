import React, { useState } from 'react';
import { Eye, Hand, Ear, Navigation, Coffee, Lock } from 'lucide-react';
import BreathingExercise from './BreathingExercise';

const ToolkitPage = () => {
  const [activeTab, setActiveTab] = useState('breathing');

  const [senses, setSenses] = useState({
    see: ['', '', '', '', ''],
    feel: ['', '', '', ''],
    hear: ['', '', ''],
    smell: ['', ''],
    taste: ['']
  });

  const updateSense = (category, index, value) => {
    setSenses(prev => {
      const newCategory = [...prev[category]];
      newCategory[index] = value;
      return { ...prev, [category]: newCategory };
    });
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-card/60 backdrop-blur-xl border border-border rounded-3xl shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
      <div className="px-6 py-5 border-b border-border bg-card/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 z-10">
        <h2 className="font-bold text-foreground text-2xl">Mental Toolkit</h2>
        
        <div className="flex bg-background/50 p-1 rounded-xl border border-border">
          <button 
            onClick={() => setActiveTab('breathing')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'breathing' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}
          >
            Box Breathing
          </button>
          <button 
            onClick={() => setActiveTab('grounding')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'grounding' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}
          >
            5-4-3-2-1 Grounding
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar relative">
        {activeTab === 'breathing' ? (
          <div className="h-full flex flex-col items-center justify-center min-h-[400px]">
             <BreathingExercise inline={true} />
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-8 duration-500 pb-10">
            <div className="text-center space-y-3 mb-8">
              <h3 className="text-2xl font-bold">5-4-3-2-1 Grounding</h3>
              <p className="text-muted-foreground">This technique helps bring you back to the present moment when you feel overwhelmed.</p>
              <div className="inline-flex items-center gap-2 bg-secondary/30 text-secondary-foreground px-4 py-2 rounded-full text-xs font-medium border border-secondary/50 shadow-sm">
                <Lock size={14} /> Anything typed here stays on your screen and is never saved or sent anywhere.
              </div>
            </div>

            <section className="space-y-4">
              <div className="flex items-center gap-2 text-blue-400 font-semibold text-lg border-b border-border pb-2">
                <Eye size={20} /> 5 things you can SEE
              </div>
              <div className="grid gap-2">
                {senses.see.map((val, i) => (
                  <input key={`see-${i}`} type="text" value={val} onChange={(e) => updateSense('see', i, e.target.value)} placeholder={`Thing ${i+1}...`} className="w-full px-4 py-2 rounded-xl border border-border bg-background/50 focus:ring-2 focus:ring-blue-400 focus:outline-none" />
                ))}
              </div>
            </section>
            
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-amber-500 font-semibold text-lg border-b border-border pb-2">
                <Hand size={20} /> 4 things you can FEEL
              </div>
              <div className="grid gap-2">
                {senses.feel.map((val, i) => (
                  <input key={`feel-${i}`} type="text" value={val} onChange={(e) => updateSense('feel', i, e.target.value)} placeholder={`Thing ${i+1}...`} className="w-full px-4 py-2 rounded-xl border border-border bg-background/50 focus:ring-2 focus:ring-amber-500 focus:outline-none" />
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-2 text-green-500 font-semibold text-lg border-b border-border pb-2">
                <Ear size={20} /> 3 things you can HEAR
              </div>
              <div className="grid gap-2">
                {senses.hear.map((val, i) => (
                  <input key={`hear-${i}`} type="text" value={val} onChange={(e) => updateSense('hear', i, e.target.value)} placeholder={`Thing ${i+1}...`} className="w-full px-4 py-2 rounded-xl border border-border bg-background/50 focus:ring-2 focus:ring-green-500 focus:outline-none" />
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-2 text-purple-400 font-semibold text-lg border-b border-border pb-2">
                <Navigation size={20} /> 2 things you can SMELL
              </div>
              <div className="grid gap-2">
                {senses.smell.map((val, i) => (
                  <input key={`smell-${i}`} type="text" value={val} onChange={(e) => updateSense('smell', i, e.target.value)} placeholder={`Thing ${i+1}...`} className="w-full px-4 py-2 rounded-xl border border-border bg-background/50 focus:ring-2 focus:ring-purple-400 focus:outline-none" />
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-2 text-rose-400 font-semibold text-lg border-b border-border pb-2">
                <Coffee size={20} /> 1 thing you can TASTE
              </div>
              <div className="grid gap-2">
                {senses.taste.map((val, i) => (
                  <input key={`taste-${i}`} type="text" value={val} onChange={(e) => updateSense('taste', i, e.target.value)} placeholder={`Thing ${i+1}...`} className="w-full px-4 py-2 rounded-xl border border-border bg-background/50 focus:ring-2 focus:ring-rose-400 focus:outline-none" />
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolkitPage;
