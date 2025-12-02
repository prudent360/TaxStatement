import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';

const Transactions: React.FC = () => {
  const { transactions, updateTransactionNote } = useAppContext();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'credit' | 'debit'>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(t => {
        const matchesSearch = 
          t.description.toLowerCase().includes(search.toLowerCase()) || 
          t.note.toLowerCase().includes(search.toLowerCase());
        const matchesType = filterType === 'all' || t.type === filterType;
        return matchesSearch && matchesType;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
      });
  }, [transactions, search, filterType, sortOrder]);

  const downloadCSV = () => {
    const headers = ['Date', 'Type', 'Amount', 'Description', 'Note'];
    const rows = filteredTransactions.map(t => [
      t.date,
      t.type,
      Math.abs(t.amount).toFixed(2),
      `"${t.description.replace(/"/g, '""')}"`, // Escape quotes
      `"${t.note.replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `transactions_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(val);

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Transactions</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage and annotate your extracted transactions.</p>
        </div>
        <button 
          onClick={downloadCSV}
          className="flex items-center justify-center px-4 py-2 bg-slate-800 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm font-medium"
        >
          <span className="material-icons-outlined text-sm mr-2">download</span>
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-850 p-4 rounded-xl border border-gray-100 dark:border-slate-700 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <span className="material-icons-outlined absolute left-3 top-2.5 text-gray-400">search</span>
          <input
            type="text"
            placeholder="Search description or notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="flex gap-2">
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="flex-1 md:flex-none px-4 py-2 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="credit">Credits Only</option>
            <option value="debit">Debits Only</option>
          </select>
          <button 
            onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
            className="px-4 py-2 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white flex items-center justify-center hover:bg-gray-50 dark:hover:bg-slate-700"
          >
            <span className="material-icons-outlined mr-1">sort</span>
            {sortOrder === 'desc' ? 'Newest' : 'Oldest'}
          </button>
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
         <div className="bg-white dark:bg-slate-850 p-12 rounded-xl border border-dashed border-gray-300 dark:border-slate-700 text-center text-slate-500">
           No transactions found matching your criteria.
         </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white dark:bg-slate-850 rounded-xl border border-gray-100 dark:border-slate-700 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700 text-gray-500 dark:text-gray-400">
                  <tr>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium">Description</th>
                    <th className="px-6 py-4 font-medium">Type</th>
                    <th className="px-6 py-4 font-medium text-right">Amount</th>
                    <th className="px-6 py-4 font-medium">Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">{tx.date}</td>
                      <td className="px-6 py-4 text-slate-900 dark:text-white max-w-xs truncate" title={tx.description}>{tx.description}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                          tx.type === 'credit' 
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {tx.type.toUpperCase()}
                        </span>
                      </td>
                      <td className={`px-6 py-4 text-right font-medium ${tx.type === 'credit' ? 'text-emerald-600' : 'text-slate-900 dark:text-white'}`}>
                        {formatCurrency(tx.amount)}
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={tx.note}
                          onChange={(e) => updateTransactionNote(tx.id, e.target.value)}
                          placeholder="Add note..."
                          className="w-full bg-transparent border-b border-transparent focus:border-primary-500 focus:outline-none text-slate-600 dark:text-slate-400 placeholder-gray-300 dark:placeholder-slate-600 text-xs py-1 transition-colors"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {filteredTransactions.map((tx) => (
              <div key={tx.id} className="bg-white dark:bg-slate-850 rounded-xl border border-gray-100 dark:border-slate-700 p-4 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">{tx.date}</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    tx.type === 'credit' 
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {tx.type.toUpperCase()}
                  </span>
                </div>
                <div className="mb-2">
                  <h3 className="text-slate-900 dark:text-white font-medium text-sm line-clamp-2">{tx.description}</h3>
                </div>
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-50 dark:border-slate-800">
                  <span className={`font-bold ${tx.type === 'credit' ? 'text-emerald-600' : 'text-slate-900 dark:text-white'}`}>
                    {formatCurrency(tx.amount)}
                  </span>
                </div>
                <div className="mt-3">
                  <input
                    type="text"
                    value={tx.note}
                    onChange={(e) => updateTransactionNote(tx.id, e.target.value)}
                    placeholder="Add a note to this transaction..."
                    className="w-full bg-gray-50 dark:bg-slate-800/50 rounded px-2 py-1.5 text-xs text-slate-600 dark:text-slate-300 border border-transparent focus:border-primary-500 focus:outline-none focus:bg-white dark:focus:bg-slate-800"
                  />
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination mock */}
          <div className="px-4 py-4 flex items-center justify-between text-sm text-slate-500">
            <span>Showing {filteredTransactions.length} items</span>
            <div className="flex space-x-2">
              <button className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 disabled:opacity-50" disabled>
                <span className="material-icons-outlined text-sm">chevron_left</span>
              </button>
              <button className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400" disabled>
                <span className="material-icons-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Transactions;