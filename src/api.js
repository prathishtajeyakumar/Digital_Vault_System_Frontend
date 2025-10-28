import axios from 'axios';

// Use port 8080 for backend
const getApiBaseUrl = () => {
  const hostname = window.location.hostname;
  if (hostname.includes('premiumproject.examly.io')) {
    return `https://8080-${hostname.split('-').slice(1).join('-')}/api/documents`;
  }
  return 'https://digital-vault-system-backend.onrender.com/api/documents';
};

const API_BASE_URL = getApiBaseUrl();

// Add axios interceptor for better error handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.code === 'ECONNREFUSED' ||
      error.code === 'ERR_NETWORK' ||
      error.message.includes('Network Error')
    ) {
      console.error(
        'Backend server is not running. Please start the Spring Boot application on port 8080.'
      );
    }
    return Promise.reject(error);
  }
);

// API Calls
export const getDocuments = (params = {}) => {
  const queryParams = new URLSearchParams();
  if (params.search) queryParams.append('search', params.search);
  if (params.sort) queryParams.append('sort', params.sort);
  const url = queryParams.toString() ? `${API_BASE_URL}?${queryParams}` : API_BASE_URL;
  return axios.get(url);
};

// Auth API
const AUTH_BASE_URL = API_BASE_URL.replace('/documents', '/auth');
export const register = (username, password) => 
  axios.post(`${AUTH_BASE_URL}/register`, { username, password });

export const login = (username, password) => 
  axios.post(`${AUTH_BASE_URL}/login`, { username, password });

export const uploadDocument = (formData) =>
  axios.post(API_BASE_URL, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 30000, // 30 second timeout for file uploads
  });

export const deleteDocument = (id) => axios.delete(`${API_BASE_URL}/${id}`);

export const downloadDocument = (id, documentTitle) =>
  axios
    .get(`${API_BASE_URL}/${id}/download`, { responseType: 'blob' })
    .then((response) => {
      const contentType = response.headers['content-type'] || 'application/octet-stream';
      const blob = new Blob([response.data], { type: contentType });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      let extension = '';
      const contentDisposition = response.headers['content-disposition'] || '';
      const filenameMatch = contentDisposition.match(/filename="(.+)"/i);
      if (filenameMatch && filenameMatch[1]) {
        const originalFileName = filenameMatch[1];
        const dotIndex = originalFileName.lastIndexOf('.');
        if (dotIndex >= 0) extension = originalFileName.substring(dotIndex);
      }

      // ✅ Safe fallback for documentTitle
      const safeTitle = (documentTitle || `document_${id}`).replace(/[^a-zA-Z0-9\-_ ]/g, "_");
      const downloadName = safeTitle + extension;

      link.setAttribute('download', downloadName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    });






