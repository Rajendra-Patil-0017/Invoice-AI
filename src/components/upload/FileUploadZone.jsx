import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, FileSpreadsheet, X, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

export const FileUploadZone = ({
  purpose = 'document', // 'document' | 'catalog'
  onFileSelected,
  selectedFile = null,
  onRemoveFile,
  isProcessing = false,
  className = '',
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  const isCatalog = purpose === 'catalog';
  const acceptedExtensions = isCatalog ? ['.csv'] : ['.pdf', '.csv'];
  const acceptAttr = isCatalog ? '.csv,text/csv' : '.pdf,.csv,application/pdf,text/csv';

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const validateAndProcessFile = (file) => {
    setErrorMsg('');
    if (!file) return;

    const fileName = file.name.toLowerCase();
    const isCsv = fileName.endsWith('.csv');
    const isPdf = fileName.endsWith('.pdf');

    if (isCatalog) {
      if (!isCsv) {
        setErrorMsg('Invalid file format. Service catalogs must be a valid CSV file (.csv) with required headers.');
        return;
      }
    } else {
      if (!isCsv && !isPdf) {
        setErrorMsg('Unsupported file type. Please upload an invoice document in PDF (.pdf) or CSV (.csv) format.');
        return;
      }
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('File size exceeds the 10 MB limit. Please select a smaller document.');
      return;
    }

    onFileSelected(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (isProcessing) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!isProcessing) setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const handleChooseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptAttr}
        onChange={handleInputChange}
        className="hidden"
        aria-label="Upload document"
      />

      {selectedFile ? (
        /* Selected File Card */
        <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`p-2.5 rounded-xl flex-shrink-0 ${
              selectedFile.name?.toLowerCase().endsWith('.csv')
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-rose-100 text-rose-700'
            }`}>
              {selectedFile.name?.toLowerCase().endsWith('.csv') ? (
                <FileSpreadsheet className="w-5 h-5" />
              ) : (
                <FileText className="w-5 h-5" />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold text-slate-900 truncate" title={selectedFile.name}>
                  {selectedFile.name}
                </p>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 uppercase">
                  {selectedFile.name?.split('.').pop() || 'FILE'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {formatFileSize(selectedFile.size)} • Session storage only
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleChooseClick}
              disabled={isProcessing}
              icon={RefreshCw}
              className="text-xs text-slate-700"
              title="Replace selected file"
            >
              <span className="hidden sm:inline">Replace</span>
            </Button>
            <button
              onClick={onRemoveFile}
              disabled={isProcessing}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              title="Remove file"
              aria-label="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Drag and drop zone */
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleChooseClick}
          className={`border-2 border-dashed rounded-xl p-5 sm:p-6 text-center cursor-pointer transition-all duration-150 ${
            isDragOver
              ? 'border-blue-500 bg-blue-50/60 ring-2 ring-blue-200'
              : 'border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-white'
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-2.5">
            <UploadCloud className="w-5 h-5" />
          </div>

          <p className="text-xs font-bold text-slate-800">
            {isCatalog ? 'Upload Service Catalog (CSV)' : 'Upload Invoice or Quotation (PDF/CSV)'}
          </p>
          <p className="text-[11px] text-slate-500 mt-1 max-w-sm mx-auto">
            {isCatalog
              ? 'Drag & drop your CSV price catalog or click to browse files'
              : 'Drag & drop an existing invoice/quote (PDF or CSV) to inspect and ask questions'}
          </p>

          <div className="mt-3 inline-flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              type="button"
              className="text-xs font-semibold text-blue-700 bg-white border-blue-200 hover:bg-blue-50"
            >
              Choose File ({acceptedExtensions.join(', ')})
            </Button>
          </div>
        </div>
      )}

      {/* Error display */}
      {errorMsg && (
        <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg('')} className="text-rose-500 font-bold p-0.5">
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
