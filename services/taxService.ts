import { TaxCalculationResult, TaxBand, Transaction } from '../types';

/**
 * Nigeria Personal Income Tax (PIT) Logic - 2026 Estimates
 * Based on the new progressive tax bands and reliefs.
 */
export const calculateTax = (
  transactions: Transaction[], 
  annualRent: number = 0,
  manualIncome: number = 0
): TaxCalculationResult => {
  // 1. Calculate Gross Income
  const totalTransactionIncome = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
  // Combine transaction income with manual income estimate
  const totalIncome = totalTransactionIncome + manualIncome;
  const grossIncome = totalIncome;

  if (grossIncome === 0) {
    return {
      totalIncome: 0,
      totalExpense,
      grossIncome: 0,
      pension: 0,
      rentRelief: 0,
      totalReliefs: 0,
      chargeableIncome: 0,
      taxPayable: 0,
      effectiveTaxRate: 0,
      breakdown: [],
    };
  }

  // 2. Deductions / Reliefs
  // Pension: Statutory deduction is usually around 8% of Gross Income.
  const pension = grossIncome * 0.08;

  // Rent Relief: Lower of 20% of annual rent paid OR ₦500,000
  const rentRelief = Math.min(annualRent * 0.20, 500000);

  const totalReliefs = pension + rentRelief;

  // 3. Chargeable Income
  // Chargeable Income = Total Income – Pension – Rent Relief
  const chargeableIncome = Math.max(0, grossIncome - totalReliefs);

  // 4. Apply Tax Bands (2026 Regime)
  // 0 – 800,000 @ 0%
  // 800,001 – 3,000,000 @ 15%
  // 3,000,001 – 12,000,000 @ 18%
  // 12,000,001 – 25,000,000 @ 21%
  // 25,000,001 – 50,000,000 @ 23%
  // Above 50,000,000 @ 25%

  const bands = [
    { width: 800000, rate: 0.00 },
    { width: 2200000, rate: 0.15 }, // 3m - 800k
    { width: 9000000, rate: 0.18 }, // 12m - 3m
    { width: 13000000, rate: 0.21 }, // 25m - 12m
    { width: 25000000, rate: 0.23 }, // 50m - 25m
    { width: Infinity, rate: 0.25 }, // Remainder
  ];

  let remainingChargeable = chargeableIncome;
  let totalTax = 0;
  const breakdown: TaxBand[] = [];

  let previousLimitSum = 0;

  for (const band of bands) {
    const taxableInThisBand = Math.min(remainingChargeable, band.width);
    const taxInThisBand = taxableInThisBand * band.rate;

    totalTax += taxInThisBand;
    remainingChargeable = Math.max(0, remainingChargeable - band.width);

    breakdown.push({
      min: previousLimitSum,
      max: band.width === Infinity ? null : previousLimitSum + band.width,
      rate: band.rate,
      taxableAmount: taxableInThisBand,
      taxAmount: taxInThisBand
    });

    previousLimitSum += band.width;
    
    // Continue even if 0 to show the full table structure in UI, 
    // or break if we only want to show applicable bands. 
    // For UI completeness, we might want all, but usually we just show utilized + next or all.
    // Let's show all for clarity of the system.
    if (remainingChargeable <= 0 && breakdown.length >= bands.length) break; 
  }

  return {
    totalIncome,
    totalExpense,
    grossIncome,
    pension,
    rentRelief,
    totalReliefs,
    chargeableIncome,
    taxPayable: totalTax,
    effectiveTaxRate: totalIncome > 0 ? (totalTax / totalIncome) * 100 : 0,
    breakdown,
  };
};