import apiClient from './apiClient';

// ログインAPI
export const login = async (email: string, password: string, businessCode: string) => {
  const response = await apiClient.post('/auth/login', {
    email,
    password,
    businessCode
  });
  return response.data;
};

// 新規ビジネス作成API
export const createBusiness = async (
  businessName: string,
  email: string,
  password: string,
  username: string
) => {
  const response = await apiClient.post('/auth/business/create', {
    businessName,
    email,
    password,
    username
  });
  return response.data;
};

// 招待からのサインアップAPI
export const signupWithInvitation = async (
  email: string,
  password: string,
  username: string,
  businessCode: string,
  invitationCode: string
) => {
  const response = await apiClient.post('/auth/signup/invitation', {
    email,
    password,
    username,
    businessCode,
    invitationCode
  });
  return response.data;
};