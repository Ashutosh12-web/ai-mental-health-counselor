import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col h-full bg-card/60 backdrop-blur-xl border border-border rounded-3xl shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-500 items-center justify-center p-8 text-center">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <Map className="text-primary w-10 h-10" />
      </div>
      <h1 className="text-4xl font-bold text-foreground mb-4">Are you lost?</h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-md">
        It looks like you've wandered into an area that doesn't exist. Let's get you back to your safe space.
      </p>
      <button 
        onClick={() => navigate('/chat')}
        className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors w-full max-w-xs"
      >
        <ArrowLeft size={20} /> Back to Haven
      </button>
    </div>
  );
};

export default NotFoundPage;
