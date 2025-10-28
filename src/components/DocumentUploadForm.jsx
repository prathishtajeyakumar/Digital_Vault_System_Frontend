import React, { useState, useRef } from 'react';
import { uploadDocument } from '../api';

const DocumentUploadForm = ({ onUpload }) => {
  const [documentTitle, setDocumentTitle] = useState('');
  const [category, setCategory] = useState('');
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const categories = [
    'Documents', 'Images', 'Reports', 'Presentations', 
    'Spreadsheets', 'Archives', 'Other'
  ];

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      if (!documentTitle) {
        setDocumentTitle(droppedFile.name.split('.')[0]);
      }
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (!documentTitle) {
        setDocumentTitle(selectedFile.name.split('.')[0]);
      }
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !documentTitle || !category) {
      alert('Please fill all fields and select a file.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentTitle', documentTitle);
    formData.append('category', category);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 20;
      });
    }, 200);

    try {
      const response = await uploadDocument(formData);
      setUploadProgress(100);
      setTimeout(() => {
        alert('Document uploaded successfully!');
        onUpload(response.data);
        setDocumentTitle('');
        setCategory('');
        setFile(null);
        setUploadProgress(0);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 500);
    } catch (error) {
      clearInterval(progressInterval);
      setUploadProgress(0);
      console.error(error);
      alert('Failed to upload document: ' + (error.response?.data?.message || error.message));
    } finally {
      setTimeout(() => setIsUploading(false), 500);
    }
  };

  return (
    <div className="upload-form">
      <div className="upload-header">
        <h3>📄 Upload New Document</h3>
        <p>Drag and drop your file or click to browse</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Document Title"
          value={documentTitle}
          onChange={(e) => setDocumentTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        
        <div 
          className={`file-drop-zone ${
            isDragOver ? 'drag-over' : ''
          } ${file ? 'has-file' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
            style={{ display: 'none' }}
          />
          
          {file ? (
            <div className="file-info">
              <div className="file-icon">📁</div>
              <div className="file-details">
                <div className="file-name">{file.name}</div>
                <div className="file-size">{formatFileSize(file.size)}</div>
              </div>
              <button 
                type="button" 
                className="remove-file"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
              >
                ❌
              </button>
            </div>
          ) : (
            <div className="drop-zone-content">
              <div className="drop-icon">📁</div>
              <div className="drop-text">
                <strong>Drop your file here</strong>
                <span>or click to browse</span>
              </div>
              <div className="supported-formats">
                Supports: PDF, DOC, DOCX, TXT, JPG, PNG, GIF
              </div>
            </div>
          )}
        </div>
        
        {isUploading && (
          <div className="upload-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <div className="progress-text">
              Uploading... {Math.round(uploadProgress)}%
            </div>
          </div>
        )}
        
        <button type="submit" disabled={isUploading}>
          {isUploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  );
};

export default DocumentUploadForm;
