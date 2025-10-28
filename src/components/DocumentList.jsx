import React from 'react';
import * as api from '../api';

const DocumentList = ({ documents, onDelete }) => {
  const handleDelete = async (id) => {
    try {
      await api.deleteDocument(id);
      onDelete(id);
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleDownload = async (id, documentTitle) => {
    try {
      await api.downloadDocument(id);
    } catch (error) {
      console.error('Download error:', error);
    }
  };



  return (
    <div>
      <h3>Documents ({documents.length})</h3>
      
      {documents.length === 0 ? (
        <p>No documents uploaded yet.</p>
      ) : (
        documents.map((doc) => (
          <div key={doc.id} className="document-item">
            <span><strong>{doc.documentTitle}</strong></span>
            <span>{doc.category}</span>
            <span>{doc.uploadDate}</span>
            <button onClick={() => handleDelete(doc.id)}>Delete</button>
            <button onClick={() => handleDownload(doc.id)}>Download</button>
          </div>
        ))
      )}
    </div>
  );
};

export default DocumentList;
