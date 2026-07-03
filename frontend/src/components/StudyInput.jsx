import React, { useState, useRef } from 'react';
import { FileText, UploadCloud, Sparkles, Trash2, FileUp } from 'lucide-react';

export default function StudyInput({ onSubmit, isLoading }) {
  const [activeTab, setActiveTab] = useState('text'); // 'text' or 'pdf'
  const [notesText, setNotesText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        setSelectedFile(file);
      } else {
        alert("Please upload a PDF file only.");
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        setSelectedFile(file);
      } else {
        alert("Please upload a PDF file only.");
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === 'text') {
      if (notesText.trim().length < 50) return;
      onSubmit({ type: 'text', data: notesText });
    } else {
      if (!selectedFile) return;
      onSubmit({ type: 'pdf', data: selectedFile });
    }
  };

  const isTextValid = notesText.trim().length >= 50;
  const isPdfValid = !!selectedFile;
  const isValid = activeTab === 'text' ? isTextValid : isPdfValid;

  return (
    <div className="input-panel">
      <h3 className="panel-title">
        <Sparkles size={18} className="text-indigo-400" />
        Study Material
      </h3>

      <div className="input-tabs">
        <button
          type="button"
          className={`input-tab-btn ${activeTab === 'text' ? 'active' : ''}`}
          onClick={() => setActiveTab('text')}
        >
          <FileText size={14} />
          Paste Notes
        </button>
        <button
          type="button"
          className={`input-tab-btn ${activeTab === 'pdf' ? 'active' : ''}`}
          onClick={() => setActiveTab('pdf')}
        >
          <FileUp size={14} />
          Upload PDF
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {activeTab === 'text' ? (
          <div>
            <textarea
              className="notes-textarea"
              placeholder="Paste your lecture notes, summaries, textbook paragraphs, or key concepts here (minimum 50 characters)..."
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
              disabled={isLoading}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>Min. 50 characters</span>
              <span style={{ color: isTextValid ? 'var(--accent-success)' : 'var(--text-muted)' }}>
                {notesText.length} chars
              </span>
            </div>
          </div>
        ) : (
          <div style={{ width: '100%' }}>
            {!selectedFile ? (
              <div
                className={`upload-zone ${dragActive ? 'drag-active' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={triggerFileInput}
              >
                <input
                  type="file"
                  className="file-input"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf"
                  disabled={isLoading}
                />
                <div className="upload-icon-wrapper">
                  <UploadCloud size={40} />
                </div>
                <div>
                  <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>Drag & drop your PDF file</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>or click to browse from device</p>
                </div>
              </div>
            ) : (
              <div className="selected-file-card">
                <div className="file-info">
                  <FileText size={20} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                  <span className="file-name">{selectedFile.name}</span>
                </div>
                <button
                  type="button"
                  className="remove-file-btn"
                  onClick={removeFile}
                  disabled={isLoading}
                  title="Remove file"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </div>
        )}

        <button
          type="submit"
          className="submit-btn"
          disabled={!isValid || isLoading}
        >
          <Sparkles size={16} />
          {isLoading ? 'Processing Material...' : 'Generate Study Buddy'}
        </button>
      </form>
    </div>
  );
}
