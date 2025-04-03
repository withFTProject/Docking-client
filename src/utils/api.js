// src/utils/api.js

const API_BASE_URL = 'https://7dd6-210-94-220-229.ngrok-free.app'; // 백엔드 주소

const getAuthToken = () => localStorage.getItem('token');

const apiRequest = async (endpoint, method = 'GET', body = null) => {
    const token = getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      'ngrok-skip-browser-warning': 'true'  // ngrok 경고 우회를 위한 헤더 추가
    };
  
    const config = {
      method,
      headers,
      ...(body && { body: JSON.stringify(body) }),
    };
  
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'API 요청 실패');
      }
      if (response.status === 204) {
        return null; // 빈 응답 본문이므로 null 반환
      }
      return response.json();
    } catch (error) {
      console.error(`API 요청 실패 (${endpoint}):`, error);
      throw error;
    }
  };

// ✅ CRUD + 행성 관련 API
export const createLetter = (letterData) => apiRequest('/letter', 'POST', letterData);
export const getLetter = (id) => apiRequest(`/letter/${id}`);
export const updateLetter = (id, letterData) => apiRequest(`/letter/${id}`, 'PUT', letterData);
export const deleteLetter = (id) => apiRequest(`/letter/${id}`, 'DELETE');

export const getPlanets = (page = 0, size = 15) =>
  apiRequest(`/planet/main?page=${page}&size=${size}`);



export const choosePlanet = (letterId, planetNumber) => 
    apiRequest(`/planet/${letterId}`, 'PUT', { planetUrl: planetNumber });
