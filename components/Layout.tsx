
import React from 'react';
import { AppScreen } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeScreen, onNavigate }) => {
  const navItems: { id: AppScreen; icon: React.ReactNode; label: string }[] = [
    { id: 'home', icon: <HomeIcon />, label: 'Home' },
    { id: 'chat', icon: <ChatIcon />, label: 'Voice' },
    { id: 'library', icon: <BookIcon />, label: 'Library' },
    { id: 'orders', icon: <HistoryIcon />, label: 'History' },
    { id: 'profile', icon: <UserIcon />, label: 'Account' }
  ];

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white app-shadow overflow-hidden relative border-x border-slate-100">
      <header className="px-6 py-4 flex items-center justify-between bg-white/80 backdrop-blur-lg border-b border-slate-50 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7 2a1 1 0 00-.707 1.707L14.586 11H3a1 1 0 100 2h11.586l-8.293 8.293a1 1 0 101.414 1.414l10-10a1 1 0 000-1.414l-10-10A1 1 0 007 2z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800 leading-tight">SmartRx</h1>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verified Pharmacy</span>
            </div>
          </div>
        </div>
        <button 
          onClick={() => onNavigate('profile')}
          className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden hover:bg-slate-100 transition-colors"
        >
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul" alt="User" className="w-full h-full object-cover" />
        </button>
      </header>
      
      <main className="flex-1 overflow-y-auto bg-slate-50/30 pb-24">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-xl border-t border-slate-100 flex items-center justify-around px-2 py-4 z-30">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center gap-1.5 transition-all relative ${activeScreen === item.id ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <div className={`p-1.5 rounded-xl transition-all ${activeScreen === item.id ? 'bg-emerald-50 scale-110' : 'bg-transparent'}`}>
              {item.icon}
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider transition-opacity ${activeScreen === item.id ? 'opacity-100' : 'opacity-60'}`}>
              {item.label}
            </span>
            {activeScreen === item.id && (
              <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-emerald-600"></div>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
  </svg>
);

const ChatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
  </svg>
);

const BookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
  </svg>
);

const HistoryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
  </svg>
);
