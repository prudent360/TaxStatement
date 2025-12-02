import React from 'react';
import { useAppContext } from '../context/AppContext';
import { TaxBand } from '../types';
import { jsPDF } from 'jspdf';

const TaxSummary: React.FC = () => {
  const { taxSummary, annualRent, setAnnualRent, manualIncome, setManualIncome } = useAppContext();

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(val);

  const handleDownloadPDF = () => {
    if (!taxSummary) return;

    const doc = new jsPDF();
    
    // Helper to format numbers for PDF (avoiding unicode currency symbol issues in default font)
    const formatForPDF = (val: number) => 
      new Intl.NumberFormat('en-NG', { style: 'decimal', minimumFractionDigits: 2 }).format(val);

    // Header
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text("TaxStatement OCR - Tax Report", 20, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Nigeria Personal Income Tax Estimate (2026)`, 20, 28);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 34);
    
    // Divider
    doc.setDrawColor(200);
    doc.line(20, 40, 190, 40);
    
    // Summary Data
    let y = 55;
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("Summary", 20, y);
    y += 10;
    
    doc.setFontSize(12);
    const summaryData = [
      ["Gross Income", `NGN ${formatForPDF(taxSummary.grossIncome)}`],
      ["Consolidated Reliefs (Pension + Rent)", `NGN ${formatForPDF(taxSummary.totalReliefs)}`],
      ["Chargeable Income", `NGN ${formatForPDF(taxSummary.chargeableIncome)}`],
      ["Effective Tax Rate", `${taxSummary.effectiveTaxRate.toFixed(2)}%`],
    ];

    summaryData.forEach(([label, value]) => {
      doc.text(label, 20, y);
      doc.text(value, 120, y);
      y += 8;
    });

    // Highlight Tax Payable
    y += 5;
    doc.setFillColor(240, 253, 244); // light green bg
    doc.rect(20, y-5, 170, 14, 'F');
    doc.setFont("helvetica", "bold");
    doc.text("Estimated Tax Payable", 25, y+2);
    doc.setTextColor(22, 163, 74); // green text
    doc.text(`NGN ${formatForPDF(taxSummary.taxPayable)}`, 120, y+2);
    
    // Reset font
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0);
    y += 20;

    // Breakdown Table Header
    doc.setFontSize(14);
    doc.text("Tax Band Breakdown", 20, y);
    y += 10;
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    
    doc.text("Band / Income Range", 20, y);
    doc.text("Rate", 90, y);
    doc.text("Taxable Amt", 120, y);
    doc.text("Tax", 160, y);
    
    y += 4;
    doc.line(20, y, 190, y);
    y += 8;

    doc.setTextColor(0);
    taxSummary.breakdown.forEach((band) => {
        const min = formatForPDF(band.min);
        const max = band.max ? formatForPDF(band.max) : "Above";
        const range = band.max ? `${min} - ${max}` : `> ${min}`;
        
        doc.text(range, 20, y);
        doc.text(`${(band.rate * 100).toFixed(0)}%`, 90, y);
        doc.text(formatForPDF(band.taxableAmount), 120, y);
        doc.text(formatForPDF(band.taxAmount), 160, y);
        y += 8;
    });

    // Footer
    y = 280;
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("Disclaimer: This is an automated estimate based on 2026 projections. Consult a tax professional.", 20, y);

    doc.save("Nigeria_Tax_Report_2026.pdf");
  };

  if (!taxSummary) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Tax Liability Summary</h1>
        <p className="text-slate-500 dark:text-slate-400">Projection based on Nigeria 2026 Personal Income Tax rules.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-850 p-6 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Calculation Base</h3>
          
          <div className="space-y-4">
            {/* Income */}
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-300">Transaction Income</span>
              <span className="font-medium text-slate-900 dark:text-white">{formatCurrency(taxSummary.grossIncome - manualIncome)}</span>
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Additional / Manual Income</label>
              <input 
                type="number"
                value={manualIncome || ''}
                onChange={(e) => setManualIncome(Number(e.target.value))}
                placeholder="Enter extra income"
                className="w-full text-sm p-2 border border-gray-200 dark:border-slate-600 rounded bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            
            <div className="flex justify-between pt-2 border-t border-gray-100 dark:border-slate-700 font-bold">
               <span className="text-slate-900 dark:text-white">Total Gross Income</span>
               <span className="text-emerald-600">{formatCurrency(taxSummary.grossIncome)}</span>
            </div>

            <div className="border-t border-gray-100 dark:border-slate-700 my-2"></div>

            {/* Deductions Inputs */}
            <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-lg space-y-3">
              <p className="text-xs font-semibold text-gray-500 uppercase">Deductions & Reliefs</p>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-300">Pension (8%)</span>
                <span className="text-sm font-medium text-emerald-600">-{formatCurrency(taxSummary.pension)}</span>
              </div>

              <div className="flex flex-col space-y-1">
                <div className="flex justify-between items-center">
                   <label className="text-sm text-slate-600 dark:text-slate-300">Rent Relief</label>
                   <span className="text-sm font-medium text-emerald-600">-{formatCurrency(taxSummary.rentRelief)}</span>
                </div>
                <div className="flex items-center space-x-2">
                   <input 
                     type="number"
                     value={annualRent || ''}
                     onChange={(e) => setAnnualRent(Number(e.target.value))}
                     placeholder="Enter Annual Rent"
                     className="w-full text-sm p-2 border border-gray-200 dark:border-slate-600 rounded bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
                   />
                </div>
                <p className="text-[10px] text-gray-400">Lower of 20% Rent or ₦500,000</p>
              </div>
            </div>

            <div className="flex justify-between pt-2 font-bold text-lg border-t border-gray-100 dark:border-slate-700">
              <span className="text-slate-900 dark:text-white">Chargeable Income</span>
              <span className="text-slate-900 dark:text-white">{formatCurrency(taxSummary.chargeableIncome)}</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg flex flex-col justify-center">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Estimated Tax Payable</h3>
          <div className="text-4xl font-bold mb-4 text-emerald-400">{formatCurrency(taxSummary.taxPayable)}</div>
          <div className="flex items-center space-x-2 text-sm text-slate-300">
            <span className="material-icons-outlined text-base">info</span>
            <span>Effective Tax Rate: {taxSummary.effectiveTaxRate.toFixed(2)}% of total income</span>
          </div>
          
          <div className="mt-8 space-y-3">
             <div className="flex justify-between text-sm text-slate-400 border-b border-slate-700 pb-2">
                <span>First ₦800k (Tax Free)</span>
                <span>₦0.00 Tax</span>
             </div>
             <button 
               onClick={handleDownloadPDF}
               className="w-full bg-primary-600 hover:bg-primary-500 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
             >
               <span className="material-icons-outlined">picture_as_pdf</span>
               Download Tax Report (PDF)
            </button>
          </div>
        </div>
      </div>

      {/* Breakdown Table */}
      <div className="bg-white dark:bg-slate-850 rounded-xl border border-gray-100 dark:border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700">
           <h3 className="font-semibold text-slate-900 dark:text-white">Tax Band Breakdown (2026)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-gray-400">
              <tr>
                <th className="px-6 py-3 font-medium">Income Band</th>
                <th className="px-6 py-3 font-medium">Rate</th>
                <th className="px-6 py-3 font-medium text-right">Taxable Amount</th>
                <th className="px-6 py-3 font-medium text-right">Tax</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {taxSummary.breakdown.map((band: TaxBand, index: number) => (
                <tr key={index}>
                  <td className="px-6 py-3 text-slate-600 dark:text-slate-400">
                    {band.max ? 
                      `${formatCurrency(band.min)} - ${formatCurrency(band.max)}` : 
                      `Above ${formatCurrency(band.min)}`
                    }
                  </td>
                  <td className="px-6 py-3 text-slate-600 dark:text-slate-400">{(band.rate * 100).toFixed(0)}%</td>
                  <td className="px-6 py-3 text-right text-slate-900 dark:text-white">{formatCurrency(band.taxableAmount)}</td>
                  <td className="px-6 py-3 text-right text-slate-900 dark:text-white font-medium">{formatCurrency(band.taxAmount)}</td>
                </tr>
              ))}
              <tr className="bg-gray-50 dark:bg-slate-800/50 font-bold">
                <td className="px-6 py-3 text-slate-900 dark:text-white">Total Chargeable</td>
                <td className="px-6 py-3"></td>
                <td className="px-6 py-3 text-right text-slate-900 dark:text-white">{formatCurrency(taxSummary.chargeableIncome)}</td>
                <td className="px-6 py-3 text-right text-emerald-600">{formatCurrency(taxSummary.taxPayable)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TaxSummary;