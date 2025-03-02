import apiClient from './apiClient';

// ビジネス情報を取得
export const getBusinessInfo = async () => {
  const response = await apiClient.get('/business');
  return response.data;
};

// ビジネス情報を更新
export const updateBusinessInfo = async (name: string) => {
  const response = await apiClient.put('/business', { name });
  return response.data;
};