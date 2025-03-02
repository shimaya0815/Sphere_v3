import axios from 'axios';

// APIのベースURL
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Axiosインスタンスの作成
const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// リクエストインターセプター: トークンをヘッダーに追加
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// レスポンスインターセプター: エラーハンドリング
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 認証エラー（401）の場合、ログアウト処理
    if (error.response && error.response.status === 401) {
      // ログインページにリダイレクト
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('business');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;