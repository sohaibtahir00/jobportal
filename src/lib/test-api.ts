import api from './api';

export async function testConnection() {
  try {
    const response = await api.get('/api/health');
    console.log('✅ Backend connected:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Backend connection failed:', error);
    throw error;
  }
}
