import apiClient from './apiClient';

// ビジネス内のユーザー一覧を取得
export const getBusinessUsers = async () => {
  const response = await apiClient.get('/users');
  return response.data;
};

// 新しいユーザーを招待
export const inviteUser = async (email: string, role: 'admin' | 'manager' | 'user') => {
  const response = await apiClient.post('/users/invite', { email, role });
  return response.data;
};

// ユーザーの権限を更新
export const updateUserRole = async (userId: string, role: 'admin' | 'manager' | 'user') => {
  const response = await apiClient.put(`/users/${userId}/role`, { role });
  return response.data;
};

// ユーザーを削除
export const removeUser = async (userId: string) => {
  const response = await apiClient.delete(`/users/${userId}`);
  return response.data;
};