import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

// 認証ユーザーの型定義
export interface User {
  id: string;
  email: string;
  username: string;
  businessId?: string;
  role: 'admin' | 'manager' | 'user';
}

// 認証コンテキストの型定義
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, username: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

// デフォルト値を持つ認証コンテキストの作成
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
  isAuthenticated: false,
});

// AuthProviderのprops型定義
interface AuthProviderProps {
  children: ReactNode;
}

// 認証プロバイダーコンポーネント
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 初期化時に保存されたユーザー情報を復元
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // ログイン処理
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // MEMO: 本来はAPIリクエストを行うが、今回はモックデータを使用
      const mockUser: User = {
        id: '1',
        email,
        username: email.split('@')[0],
        businessId: '1',
        role: 'admin',
      };
      
      // ユーザー情報をローカルストレージに保存
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      
      // ダッシュボードに遷移
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // サインアップ処理
  const signup = async (email: string, password: string, username: string) => {
    try {
      setLoading(true);
      
      // MEMO: 本来はAPIリクエストを行うが、今回はモックデータを使用
      const mockUser: User = {
        id: '1',
        email,
        username,
        role: 'user',
      };
      
      // ユーザー情報をローカルストレージに保存
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      
      // ダッシュボードに遷移
      navigate('/dashboard');
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ログアウト処理
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  // 認証状態の判定
  const isAuthenticated = !!user;

  // コンテキスト値の提供
  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 認証コンテキストを使用するためのフック
export const useAuth = () => useContext(AuthContext);