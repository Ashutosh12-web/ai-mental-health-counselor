import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Trash2, Shield, Settings2, Sparkles, Activity } from 'lucide-react';

const SettingsPage = ({ userName, settings, updateSettings }) => {
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [nameInput, setNameInput] = useState(settings.aiName);
  const [toneInput, setToneInput] = useState(settings.aiTone);
  const [showSaved, setShowSaved] = useState(false);

  // Get conversation count
  const savedMessages = localStorage.getItem(`counselor_messages_${userName}`);
  const messageCount = savedMessages ? JSON.parse(savedMessages).length : 0;

  const handleSavePersona = (e) => {
    e.preventDefault();
    updateSettings({ aiName: nameInput, aiTone: toneInput });
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  const handleExport = () => {
    if (!savedMessages) return;
    const blob = new Blob([savedMessages], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `haven_transcript_${userName}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteAll = () => {
    localStorage.removeItem(`counselor_messages_${userName}`);
    localStorage.removeItem('counselor_userName');
    localStorage.removeItem('counselor_settings');
    localStorage.removeItem(`counselor_mood_history_${userName}`);
    window.location.href = '/'; // Hard reload to clear all states and restart
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-card/60 backdrop-blur-xl border border-border rounded-3xl shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
      <div className="px-6 py-4 border-b border-border flex items-center gap-4 bg-card/40">
        <button 
          onClick={() => navigate('/chat')}
          className="p-2 rounded-full hover:bg-accent/10 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h2 className="font-semibold text-foreground m-0 text-xl flex items-center gap-2">
            <Settings2 size={24} className="text-primary" /> Settings
          </h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8 custom-scrollbar">
        
        {/* Persona Settings */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-primary font-semibold text-lg">
            <Sparkles size={20} />
            <h3>Counselor Persona</h3>
          </div>
          <form onSubmit={handleSavePersona} className="bg-background/50 border border-border rounded-2xl p-5 space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground block">AI Name</label>
              <input 
                type="text" 
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground block">Conversational Tone</label>
              <select 
                value={toneInput.toLowerCase()}
                onChange={(e) => setToneInput(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:outline-none cursor-pointer"
              >
                <option value="empathetic">Empathetic</option>
                <option value="warm">Warm</option>
                <option value="casual">Casual</option>
                <option value="professional">Professional</option>
                <option value="clinical">Clinical</option>
                <option value="direct">Direct</option>
              </select>
            </div>
            <div className="flex items-center gap-3">
              <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors">
                Save Persona
              </button>
              {showSaved && <span className="text-sm font-medium text-primary animate-in fade-in slide-in-from-left-2">Saved!</span>}
            </div>
          </form>
        </section>

        {/* Appearance & Motion */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-primary font-semibold text-lg">
            <Activity size={20} />
            <h3>Appearance & Motion</h3>
          </div>
          <div className="bg-background/50 border border-border rounded-2xl p-5 flex items-center justify-between">
            <div>
              <div className="font-medium">Reduce Motion</div>
              <div className="text-sm text-muted-foreground">Disable all UI animations and transitions.</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={settings.reduceMotion}
                onChange={(e) => updateSettings({ reduceMotion: e.target.checked })}
              />
              <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </section>

        {/* Data & Privacy */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-primary font-semibold text-lg">
            <Shield size={20} />
            <h3>Data & Privacy</h3>
          </div>
          <div className="bg-background/50 border border-border rounded-2xl p-5 space-y-5">
            <p className="text-sm text-foreground/90 leading-relaxed">
              <strong>Your privacy matters.</strong> Your conversation history is stored strictly in your browser's local storage. When you send a message, the text is sent securely to Google's Gemini API for processing to generate a response, but your message content is <em>never logged or stored on our backend servers.</em>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button 
                onClick={handleExport}
                disabled={messageCount === 0}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-xl font-medium hover:bg-secondary/80 transition-colors disabled:opacity-50"
              >
                <Download size={18} /> Export Data as JSON
              </button>

              {showDeleteConfirm ? (
                <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4">
                  <span className="text-sm font-medium text-destructive">Delete {messageCount} messages?</span>
                  <button onClick={handleDeleteAll} className="px-3 py-2 bg-destructive text-destructive-foreground rounded-lg text-sm font-medium hover:bg-destructive/90">Yes</button>
                  <button onClick={() => setShowDeleteConfirm(false)} className="px-3 py-2 bg-muted text-muted-foreground rounded-lg text-sm font-medium hover:bg-muted/80">Cancel</button>
                </div>
              ) : (
                <button 
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={messageCount === 0}
                  className="flex items-center justify-center gap-2 px-4 py-2 border border-destructive/30 text-destructive rounded-xl font-medium hover:bg-destructive/10 transition-colors disabled:opacity-50"
                >
                  <Trash2 size={18} /> Delete All Data
                </button>
              )}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default SettingsPage;
