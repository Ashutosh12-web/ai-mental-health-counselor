import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { MessageCircle, Book, Wrench, HelpCircle, Settings } from 'lucide-react';

const Layout = () => {
  const location = useLocation();
  
  // Hide nav on the landing page
  if (location.pathname === '/') {
    return <Outlet />;
  }

  return (
    <div className="w-full h-screen flex flex-col md:flex-row-reverse bg-background overflow-hidden relative">
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto w-full max-w-4xl mx-auto p-4 md:p-8 pb-24 md:pb-8 relative">
        <Outlet />
      </main>

      {/* Mobile Bottom Nav & Desktop Sidebar (left aligned by flex-row-reverse if we want it left, let's keep it simple) */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-card/90 backdrop-blur-md border-t border-border flex items-center justify-around md:static md:w-64 md:h-full md:flex-col md:justify-start md:border-t-0 md:border-r md:p-4 md:gap-2 z-50">
        <div className="hidden md:block pb-6 pt-2 px-2">
          <h1 className="text-2xl font-bold text-foreground">Haven</h1>
        </div>

        <NavLink to="/chat" className={({isActive}) => `flex flex-col md:flex-row items-center gap-1 md:gap-3 p-2 md:px-4 md:py-3 rounded-xl md:w-full transition-colors ${isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:bg-accent/10 hover:text-foreground'}`}>
          <MessageCircle size={24} />
          <span className="text-[10px] md:text-sm font-medium">Chat</span>
        </NavLink>
        <NavLink to="/journal" className={({isActive}) => `flex flex-col md:flex-row items-center gap-1 md:gap-3 p-2 md:px-4 md:py-3 rounded-xl md:w-full transition-colors ${isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:bg-accent/10 hover:text-foreground'}`}>
          <Book size={24} />
          <span className="text-[10px] md:text-sm font-medium">Journal</span>
        </NavLink>
        <NavLink to="/toolkit" className={({isActive}) => `flex flex-col md:flex-row items-center gap-1 md:gap-3 p-2 md:px-4 md:py-3 rounded-xl md:w-full transition-colors ${isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:bg-accent/10 hover:text-foreground'}`}>
          <Wrench size={24} />
          <span className="text-[10px] md:text-sm font-medium">Toolkit</span>
        </NavLink>
        <NavLink to="/help" className={({isActive}) => `flex flex-col md:flex-row items-center gap-1 md:gap-3 p-2 md:px-4 md:py-3 rounded-xl md:w-full transition-colors ${isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:bg-accent/10 hover:text-foreground'}`}>
          <HelpCircle size={24} />
          <span className="text-[10px] md:text-sm font-medium">Help</span>
        </NavLink>
        
        <div className="hidden md:block flex-1" />
        
        <NavLink to="/settings" className={({isActive}) => `flex flex-col md:flex-row items-center gap-1 md:gap-3 p-2 md:px-4 md:py-3 rounded-xl md:w-full transition-colors ${isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:bg-accent/10 hover:text-foreground'}`}>
          <Settings size={24} />
          <span className="text-[10px] md:text-sm font-medium">Settings</span>
        </NavLink>
      </nav>
      
    </div>
  );
};

export default Layout;
