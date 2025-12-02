import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Transaction, UploadedFile, OCRStatus, TaxCalculationResult } from '../types';
import { calculateTax } from '../services/taxService';

interface AppContextType {
  transactions: Transaction[];
  addTransactions: (txs: Transaction[]) => void;
  updateTransactionNote: (id: string, note: string) => void;
  uploadedFiles: UploadedFile[];
  addFile: (file: UploadedFile) => void;
  updateFileStatus: (id: string, status: OCRStatus) => void;
  deleteFile: (id: string) => void;
  clearAll: () => void;
  taxSummary: TaxCalculationResult | null;
  annualRent: number;
  setAnnualRent: (amount: number) => void;
  manualIncome: number;
  setManualIncome: (amount: number) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [taxSummary, setTaxSummary] = useState<TaxCalculationResult | null>(null);
  const [annualRent, setAnnualRent] = useState<number>(0);
  const [manualIncome, setManualIncome] = useState<number>(0);

  useEffect(() => {
    // Recalculate tax whenever transactions, rent, or manual income changes
    const summary = calculateTax(transactions, annualRent, manualIncome);
    setTaxSummary(summary);
  }, [transactions, annualRent, manualIncome]);

  const addTransactions = (txs: Transaction[]) => {
    setTransactions(prev => [...prev, ...txs]);
  };

  const updateTransactionNote = (id: string, note: string) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, note } : t));
  };

  const addFile = (file: UploadedFile) => {
    setUploadedFiles(prev => [file, ...prev]);
  };

  const updateFileStatus = (id: string, status: OCRStatus) => {
    setUploadedFiles(prev => prev.map(f => f.id === id ? { ...f, status } : f));
  };

  const deleteFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
    // Remove transactions associated with this file
    setTransactions(prev => prev.filter(t => t.fileId !== id));
  };

  const clearAll = () => {
    setTransactions([]);
    setUploadedFiles([]);
    setAnnualRent(0);
    setManualIncome(0);
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <AppContext.Provider value={{
      transactions, addTransactions, updateTransactionNote,
      uploadedFiles, addFile, updateFileStatus, deleteFile, clearAll,
      taxSummary,
      annualRent, setAnnualRent,
      manualIncome, setManualIncome,
      darkMode, toggleDarkMode
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within an AppProvider');
  return context;
};