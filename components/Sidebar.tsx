import React from 'react';
import { NavLink } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  closeMobileMenu: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeMobileMenu }) => {
  const navItems = [
    { label: 'Dashboard', icon: 'dashboard', path: '/' },
    { label: 'Upload Statement', icon: 'upload_file', path: '/upload' },
    { label: 'Transactions', icon: 'receipt_long', path: '/transactions' },
    { label: 'Tax Summary', icon: 'analytics', path: '/tax-summary' },
  ];

  const baseClasses = "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-850 border-r border-gray-200 dark:border-slate-700 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0";
  const mobileClasses = isOpen ? "translate-x-0" : "-translate-x-full";

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeMobileMenu}
        ></div>
      )}

      <aside className={`${baseClasses} ${mobileClasses}`}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-slate-700">
            <span className="material-icons-outlined text-primary-600 mr-2">account_balance</span>
            <span className="text-xl font-bold text-slate-800 dark:text-white">TaxStatement</span>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                      : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-slate-800'
                  }`
                }
              >
                <span className="material-icons-outlined mr-3">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;