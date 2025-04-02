// src/utils/api.js

const API_BASE_URL = 'http://localhost:8080'; // 백엔드 주소

const getAuthToken = () => localStorage.getItem('token');

const apiRequest = async (endpoint, method = 'GET', body = null) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const config = {
    method,
    headers,
    ...(body && { body: JSON.stringify(body) }),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'API 요청 실패');
  }
  return response.json();
};

// ✅ CRUD + 행성 관련 API
export const createLetter = (letterData) => apiRequest('/letter', 'POST', letterData);
export const getLetter = (id) => apiRequest(`/letter/${id}`);
export const updateLetter = (id, letterData) => apiRequest(`/letter/${id}`, 'PUT', letterData);
export const deleteLetter = (id) => apiRequest(`/letter/${id}`, 'DELETE');

export const getPlanets = (page = 0, size = 15) =>
  apiRequest(`/planet/main?page=${page}&size=${size}`);

export const choosePlanet = (letterId, planetUrl) =>
  apiRequest(`/planet/${letterId}`, 'PUT', { planetUrl });
