import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './components/LandingPage';
import ChatInterface from './components/ChatInterface';
import SettingsPage from './components/SettingsPage';
import JournalPage from './components/JournalPage';
import ToolkitPage from './components/ToolkitPage';
import HelpPage from './components/HelpPage';
import NotFoundPage from './components/NotFoundPage';
import { useSettings } from './hooks/useSettings';

function AppContent() {
  const { settings, updateSettings } = useSettings();
  const [userName, setUserName] = useState(() => localStorage.getItem('counselor_userName') || '');

  const ChatWrapper = () => (
    <ChatInterface userName={userName} settings={settings} />
  );

  const SettingsWrapper = () => (
    <SettingsPage userName={userName} settings={settings} updateSettings={updateSettings} />
  );

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<LandingPage userName={userName} setUserName={setUserName} />} />
        <Route path="/chat" element={<ChatWrapper />} />
        <Route path="/journal" element={<JournalPage userName={userName} />} />
        <Route path="/toolkit" element={<ToolkitPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/settings" element={<SettingsWrapper />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
