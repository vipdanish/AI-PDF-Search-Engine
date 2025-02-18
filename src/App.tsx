import React, { useState } from 'react';
import { FileText, Search, Upload, X, Loader2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import * as pdfjsLib from 'pdfjs-dist';
import toast, { Toaster } from 'react-hot-toast';

// Ensure the worker is properly loaded
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

function App() {
  const [files, setFiles] = useState<File[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = async (acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => {
      toast.success(`Uploaded ${file.name}`, {
        icon: '📄',
        duration: 2000
      });
      return file;
    });
    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || files.length === 0) return;

    setIsSearching(true);
    try {
      // Simulated search delay - replace with actual search implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Searching for:', searchQuery);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleDelete = (index: number, fileName: string) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    toast.success(`Deleted ${fileName}`, {
      icon: '🗑️',
      duration: 2000
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Toaster position="top-right" />
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <FileText size={40} className="text-blue-400 mr-2" />
            <h1 className="text-4xl font-bold">AI PDF Search Engine</h1>
          </div>
          <p className="text-gray-400">Upload PDFs and search through them using AI-powered technology</p>
        </header>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search through your PDFs..."
              className="w-full px-4 py-3 pl-12 pr-12 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
            <button
              type="submit"
              disabled={isSearching || files.length === 0 || !searchQuery.trim()}
              className="absolute right-3 top-2.5 p-1 rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:hover:bg-transparent"
            >
              {isSearching ? (
                <Loader2 className="animate-spin text-blue-400" size={24} />
              ) : (
                <Search className="text-blue-400" size={24} />
              )}
            </button>
          </div>
        </form>

        {/* Upload Area */}
        <div 
          {...getRootProps()} 
          className={`max-w-2xl mx-auto p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-all duration-300
            ${isDragActive ? 'border-blue-500 bg-blue-500/10 scale-105' : 'border-gray-700 hover:border-gray-600'}`}
        >
          <input {...getInputProps()} />
          <Upload className={`mx-auto mb-4 text-gray-400 transition-transform duration-300 ${isDragActive ? 'scale-110' : ''}`} size={40} />
          <p className="text-gray-400">
            {isDragActive
              ? "Drop your PDFs here..."
              : "Drag & drop PDFs here, or click to select files"}
          </p>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="max-w-2xl mx-auto mt-8">
            <h2 className="text-xl font-semibold mb-4">Uploaded Files</h2>
            <div className="space-y-2">
              {files.map((file, index) => (
                <div 
                  key={index} 
                  className="flex items-center p-3 bg-gray-800 rounded-lg group animate-slideIn hover:bg-gray-700/50 transition-all duration-200"
                >
                  <FileText className="text-blue-400 mr-3" size={20} />
                  <span className="flex-1 truncate">{file.name}</span>
                  <span className="text-sm text-gray-400 mr-4">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                  <button
                    onClick={() => handleDelete(index, file.name)}
                    className="p-1 rounded-full hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="text-red-400" size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;