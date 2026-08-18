import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HeartPulse, Shield, Sparkles } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl opacity-50 translate-x-1/3 -translate-y-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/15 rounded-full blur-3xl opacity-50 -translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <motion.div 
        className="text-center p-8 md:p-12 max-w-2xl flex flex-col items-center gap-6 bg-card/40 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl z-10 mx-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/10 p-6 rounded-full mb-4"
        >
          <Sparkles size={48} className="text-primary" />
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-5xl md:text-6xl font-extrabold text-foreground"
        >
          Meet Aura.
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg md:text-xl text-muted-foreground leading-relaxed"
        >
          Your personal, AI-powered mental health companion. Always here to listen, support, and help you find peace in a chaotic world.
        </motion.p>
        
        <motion.div 
          className="flex flex-wrap justify-center gap-6 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="flex items-center gap-2 text-primary font-medium">
            <HeartPulse size={24} />
            <span>Empathetic AI</span>
          </div>
          <div className="flex items-center gap-2 text-primary font-medium">
            <Shield size={24} />
            <span>Private & Secure</span>
          </div>
        </motion.div>

        <motion.button
          className="mt-8 text-lg font-semibold px-8 py-4 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          onClick={() => navigate('/app')}
        >
          Begin Your Journey
        </motion.button>
      </motion.div>
    </div>
  );
};

export default LandingPage;
