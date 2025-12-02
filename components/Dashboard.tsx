import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard: React.FC = () => {
  const { transactions, taxSummary, setManualIncome } = useAppContext();
  const [manualInput, setManualInput] = useState('');

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(val);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(manualInput);
    if (!isNaN(val) && val > 0) {
      setManualIncome(val);
      setManualInput('');
    }
  };

  if (!taxSummary) return null;

  // Check if we have any data (transactions or manual income)
  const hasData = transactions.length > 0 || taxSummary.totalIncome > 0;

  // Prepare chart data (cumulative balance or monthly flow - keeping simple for MVP)
  const chartData = transactions
    .slice() // copy
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(t => ({
      date: t.date,
      amount: t.amount,
      flow: t.amount > 0 ? t.amount : 0 // Just showing inflow for "Income Trend"
    }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Tax Exposure Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400">Overview for 2026 Nigerian Personal Income Tax.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full text-sm font-medium">
            2026 Tax Year
          </span>
        </div>
      </div>

      {!hasData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Upload Option */}
          <div className="bg-white dark:bg-slate-850 rounded-xl border border-dashed border-gray-300 dark:border-slate-700 p-8 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/10 rounded-full flex items-center justify-center mb-4">
              <span className="material-icons-outlined text-primary-600 dark:text-primary-400 text-3xl">upload_file</span>
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Upload Statement</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm max-w-xs">Upload your bank statement (PDF/Image) to auto-extract transactions.</p>
            <Link to="/upload" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 shadow-sm w-full sm:w-auto">
              Upload Files
            </Link>
          </div>

          {/* Manual Option */}
          <div className="bg-white dark:bg-slate-850 rounded-xl border border-dashed border-gray-300 dark:border-slate-700 p-8 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/10 rounded-full flex items-center justify-center mb-4">
              <span className="material-icons-outlined text-blue-600 dark:text-blue-400 text-3xl">edit</span>
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Enter Estimate</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm max-w-xs">Don't have a statement? Enter your total estimated annual income manually.</p>
            <form onSubmit={handleManualSubmit} className="w-full max-w-xs flex gap-2">
              <input 
                type="number" 
                placeholder="e.g. 5000000" 
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white"
                required
              />
              <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">
                Go
              </button>
            </form>
          </div>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Total Inflow', value: formatCurrency(taxSummary.totalIncome), color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
              { label: 'Total Outflow', value: formatCurrency(taxSummary.totalExpense), color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20' },
              { label: 'Chargeable Income', value: formatCurrency(taxSummary.chargeableIncome), color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
              { label: 'Est. Tax Payable', value: formatCurrency(taxSummary.taxPayable), color: 'text-slate-900 dark:text-white', bg: 'bg-gray-100 dark:bg-slate-800' },
            ].map((card, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-850 p-6 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">{card.label}</p>
                <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
              </div>
            ))}
          </div>

          {/* Chart Section - Only show if we have transactions to plot */}
          {transactions.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white dark:bg-slate-850 p-6 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Income Trend</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorFlow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="date" tick={{fontSize: 12}} stroke="#94a3b8" />
                      <YAxis hide />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                      />
                      <Area type="monotone" dataKey="flow" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorFlow)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Quick Summary / Breakdown */}
              <div className="bg-white dark:bg-slate-850 p-6 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Tax Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-slate-700">
                    <span className="text-slate-600 dark:text-slate-400">Effective Rate</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{taxSummary.effectiveTaxRate.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-slate-700">
                    <span className="text-slate-600 dark:text-slate-400">Total Deductions</span>
                    <span className="font-semibold text-emerald-600">{formatCurrency(taxSummary.totalReliefs)}</span>
                  </div>
                  <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg">
                    <p className="text-xs text-yellow-800 dark:text-yellow-500">
                      Disclaimer: This is an estimate based on projected 2026 rules (e.g. 0% on first ₦800k).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* If manual income only, show a simpler layout */}
          {transactions.length === 0 && (
             <div className="bg-white dark:bg-slate-850 p-6 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm text-center">
               <span className="material-icons-outlined text-blue-500 text-4xl mb-2">edit</span>
               <h3 className="text-lg font-bold text-slate-900 dark:text-white">Manual Estimate Active</h3>
               <p className="text-slate-500 dark:text-slate-400 mb-4">
                 You are viewing a tax estimate based on a manually entered income of <strong>{formatCurrency(taxSummary.totalIncome)}</strong>.
               </p>
               <Link to="/upload" className="text-primary-600 hover:text-primary-700 font-medium">
                 Upload a statement for more accuracy &rarr;
               </Link>
             </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;