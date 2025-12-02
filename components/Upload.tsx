import React, { useState, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { parseBankStatement } from '../services/geminiService';
import { OCRStatus } from '../types';

const Upload: React.FC = () => {
  const { addFile, updateFileStatus, deleteFile, addTransactions, uploadedFiles } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const processFile = async (file: File) => {
    // 1. Add to upload list
    const fileId = Math.random().toString(36).substring(7);
    addFile({
      id: fileId,
      name: file.name,
      size: file.size,
      date: new Date(),
      status: OCRStatus.PROCESSING,
    });

    try {
      // 2. Convert to Base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        // Remove data URL prefix (e.g., "data:image/jpeg;base64," or "data:application/pdf;base64,")
        const base64Data = base64String.split(',')[1];
        
        try {
          // 3. Send to Gemini
          const transactions = await parseBankStatement(base64Data, file.type);
          
          // 4. Update State - Attach fileId to transactions
          const taggedTransactions = transactions.map(t => ({ ...t, fileId }));
          addTransactions(taggedTransactions);
          updateFileStatus(fileId, OCRStatus.COMPLETED);
        } catch (err) {
          console.error(err);
          updateFileStatus(fileId, OCRStatus.FAILED);
          const message = err instanceof Error ? err.message : "Gemini API failed to parse the document.";
          setErrorMsg(message);
        }
      };
      reader.readAsDataURL(file);

    } catch (e) {
      updateFileStatus(fileId, OCRStatus.FAILED);
      setErrorMsg("Failed to read file.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        setErrorMsg("Please upload an image (JPG, PNG) or PDF.");
        return;
      }
      setErrorMsg(null);
      processFile(file);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
       const file = e.dataTransfer.files[0];
       const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        setErrorMsg("Please upload an image (JPG, PNG) or PDF.");
        return;
      }
      setErrorMsg(null);
      processFile(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Upload Statement</h1>
        <p className="text-slate-500 dark:text-slate-400">Upload a PDF or photo of your bank statement to extract transactions automatically.</p>
      </div>

      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`
          border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer
          ${isDragging ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10' : 'border-gray-300 dark:border-slate-700 hover:border-primary-400'}
        `}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/png, image/jpeg, image/webp, application/pdf"
          onChange={handleFileChange}
        />
        <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="material-icons-outlined text-gray-500 dark:text-slate-400 text-3xl">cloud_upload</span>
        </div>
        <h3 className="text-lg font-medium text-slate-900 dark:text-white">Click to upload or drag and drop</h3>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">PDF, PNG, JPG up to 10MB</p>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg flex items-center">
          <span className="material-icons-outlined mr-2">error</span>
          {errorMsg}
        </div>
      )}

      {/* Upload List */}
      <div className="bg-white dark:bg-slate-850 rounded-xl border border-gray-100 dark:border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700">
          <h3 className="font-semibold text-slate-900 dark:text-white">Recent Uploads</h3>
        </div>
        {uploadedFiles.length === 0 ? (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400">
            No files uploaded yet.
          </div>
        ) : (
          <ul className="divide-y divide-gray-100 dark:divide-slate-700">
            {uploadedFiles.map((file) => (
              <li key={file.id} className="px-6 py-4 flex items-center justify-between group">
                <div className="flex items-center">
                  <span className="material-icons-outlined text-gray-400 text-3xl mr-4">description</span>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{file.name}</p>
                    <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(2)} KB • {file.date.toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div>
                    {file.status === OCRStatus.PROCESSING && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Processing...
                      </span>
                    )}
                    {file.status === OCRStatus.COMPLETED && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Completed
                      </span>
                    )}
                    {file.status === OCRStatus.FAILED && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Failed
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); deleteFile(file.id); }}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                    title="Delete file and transactions"
                  >
                    <span className="material-icons-outlined text-xl">delete_outline</span>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Upload;