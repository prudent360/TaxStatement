import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center items-center gap-2">
           <span className="material-icons-outlined text-primary-600 text-4xl">account_balance</span>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 dark:text-white">Sign in to your account</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-850 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100 dark:border-slate-800">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email address</label>
              <div className="mt-1">
                <input 
                  id="email" 
                  name="email" 
                  type="email" 
                  autoComplete="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-slate-800 dark:text-white" 
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
              <div className="mt-1">
                <input 
                  id="password" 
                  name="password" 
                  type="password" 
                  autoComplete="current-password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-slate-800 dark:text-white" 
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-900 dark:text-slate-300">Remember me</label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-primary-600 hover:text-primary-500">Forgot your password?</a>
              </div>
            </div>

            <div>
              <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 dark:text-white">Create your account</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-850 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100 dark:border-slate-800">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email address</label>
              <div className="mt-1">
                <input 
                  id="email" 
                  name="email" 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-slate-800 dark:text-white" 
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
              <div className="mt-1">
                <input 
                  id="password" 
                  name="password" 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-slate-800 dark:text-white" 
                />
              </div>
            </div>

             <div>
              <label htmlFor="password_confirm" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Confirm Password</label>
              <div className="mt-1">
                <input 
                  id="password_confirm" 
                  name="password_confirm" 
                  type="password" 
                  required 
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-slate-800 dark:text-white" 
                />
              </div>
            </div>

            <div className="flex items-center">
              <input id="terms" name="terms" type="checkbox" required className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
              <label htmlFor="terms" className="ml-2 block text-sm text-slate-900 dark:text-slate-300">I agree to the Terms and Privacy Policy</label>
            </div>

            <div>
              <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
