import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAppContext } from '../context/AppContext';

const Layout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toggleDarkMode, darkMode } = useAppContext();

  return (
    <div className={`flex h-screen bg-gray-50 dark:bg-slate-900 ${darkMode ? 'dark' : ''}`}>
      <Sidebar isOpen={isMobileMenuOpen} closeMobileMenu={() => setIsMobileMenuOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="bg-white dark:bg-slate-850 border-b border-gray-200 dark:border-slate-700 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400"
          >
            <span className="material-icons-outlined">menu</span>
          </button>

          <div className="flex-1"></div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleDarkMode}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            >
              <span className="material-icons-outlined">{darkMode ? 'light_mode' : 'dark_mode'}</span>
            </button>
            <div className="flex items-center">
               <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center font-bold text-sm">
                 <span className="material-icons-outlined text-sm">person</span>
               </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
        
        {/* Footer */}
        <footer className="bg-white dark:bg-slate-850 border-t border-gray-200 dark:border-slate-700 py-4 px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} TaxStatement OCR. Developed by Ifiok Akpan. Tel: +2348111961548
        </footer>
      </div>
    </div>
  );
};

export default Layout;