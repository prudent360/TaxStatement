export interface Transaction {
  id: string;
  fileId?: string;
  date: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  note: string;
}

export interface TaxBand {
  min: number;
  max: number | null;
  rate: number;
  taxableAmount: number;
  taxAmount: number;
}

export interface TaxCalculationResult {
  totalIncome: number;
  totalExpense: number;
  grossIncome: number;
  pension: number;
  rentRelief: number;
  totalReliefs: number;
  chargeableIncome: number;
  taxPayable: number;
  effectiveTaxRate: number;
  breakdown: TaxBand[];
}

export enum OCRStatus {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  date: Date;
  status: OCRStatus;
}

export interface User {
  name: string;
  email: string;
}