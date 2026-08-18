import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomeScreen from './components/WelcomeScreen';
import MoodSelector from './components/MoodSelector';
import ChatInterface from './components/ChatInterface';
import LandingPage from './components/LandingPage';

function ChatApp() {
  const [appState, setAppState] = useState(() => {
    return localStorage.getItem('counselor_userName') ? 'mood' : 'welcome';
  });
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('counselor_userName') || '';
  });
  const [userMood, setUserMood] = useState('');

  const handleNameSubmit = (name) => {
    setUserName(name);
    localStorage.setItem('counselor_userName', name);
    setAppState('mood');
  };

  const handleMoodSelect = (mood) => {
    setUserMood(mood);
    setAppState('chat');
  };

  const handleReset = () => {
    localStorage.removeItem('counselor_userName');
    // We do NOT remove counselor_messages so that if the same user returns, their history is preserved
    setUserName('');
    setUserMood('');
    setAppState('welcome');
  };

  return (
    <div className="w-full max-w-3xl mx-auto h-screen p-4 md:p-8 flex flex-col relative">
      {appState === 'welcome' && (
        <WelcomeScreen onComplete={handleNameSubmit} />
      )}
      
      {appState === 'mood' && (
        <MoodSelector userName={userName} onSelect={handleMoodSelect} onReset={handleReset} />
      )}
      
      {appState === 'chat' && (
        <ChatInterface userName={userName} initialMood={userMood} onReset={handleReset} />
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<ChatApp />} />
      </Routes>
    </Router>
  );
}

export default App;
