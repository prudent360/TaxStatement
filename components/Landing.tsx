import React from 'react';
import { Link } from 'react-router-dom';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col">
      <header className="py-6 px-4 sm:px-6 lg:px-8 border-b border-gray-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="material-icons-outlined text-primary-600 text-3xl">account_balance</span>
            <span className="text-2xl font-bold text-slate-900 dark:text-white">TaxStatement</span>
          </div>
          <div className="space-x-4">
            <Link to="/login" className="text-slate-600 dark:text-slate-300 hover:text-primary-600 font-medium">Log In</Link>
            <Link to="/signup" className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">Get Started</Link>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-8">
              Nigerian Tax Estimates, <span className="text-primary-600">Simplified.</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
              Upload your bank statements. Our AI extracts transactions and calculates your Personal Income Tax exposure instantly based on 2026 rules.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 md:min-w-[200px] shadow-lg shadow-primary-500/30">
                Start Free Trial
              </Link>
              <a href="#how-it-works" className="flex items-center justify-center px-8 py-4 border border-gray-300 dark:border-slate-700 text-lg font-medium rounded-lg text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 md:min-w-[200px]">
                Learn More
              </a>
            </div>
          </div>

          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8" id="how-it-works">
            {[
              { icon: 'document_scanner', title: 'AI OCR Extraction', desc: 'Upload PDF or Image statements. Our Gemini-powered engine digitizes every line item instantly.' },
              { icon: 'calculate', title: '2026 Tax Rules', desc: 'Auto-calculates tax based on the latest projected Nigerian Personal Income Tax bands and reliefs.' },
              { icon: 'lock', title: 'Private & Secure', desc: 'Your financial data is processed securely. We don\'t store your data longer than your session.' },
            ].map((feature, i) => (
              <div key={i} className="p-8 bg-gray-50 dark:bg-slate-850 rounded-2xl border border-gray-100 dark:border-slate-800">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mb-6">
                  <span className="material-icons-outlined text-primary-600 text-2xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 dark:text-slate-500">
          <p>&copy; 2025 TaxStatement OCR Nigeria. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
