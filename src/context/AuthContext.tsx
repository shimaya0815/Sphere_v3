import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

// Business型定義
export interface Business {
  id: string;
  name: string;
  businessCode: string;
  createdAt: string;
}

// 認証ユーザーの型定義
export interface User {
  id: string;
  email: string;
  username: string;
  businessId: string;
  role: 'admin' | 'manager' | 'user';
  invitationCode?: string;
}

// 認証コンテキストの型定義
interface AuthContextType {
  user: User | null;
  business: Business | null;
  loading: boolean;
  login: (email: string, password: string, businessCode?: string) => Promise<void>;
  signup: (email: string, password: string, username: string, businessCode?: string, invitationCode?: string) => Promise<void>;
  createBusiness: (name: string, email: string, password: string, username: string) => Promise<void>;
  inviteUser: (email: string, role: 'admin' | 'manager' | 'user') => Promise<string>;
  logout: () => void;
  isAuthenticated: boolean;
}

// デフォルト値を持つ認証コンテキストの作成
const AuthContext = createContext<AuthContextType>({
  user: null,
  business: null,
  loading: true,
  login: async () => {},
  signup: async () => {},
  createBusiness: async () => {},
  inviteUser: async () => '',
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
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 初期化時に保存されたユーザー情報と会社情報を復元
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedBusiness = localStorage.getItem('business');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    if (storedBusiness) {
      setBusiness(JSON.parse(storedBusiness));
    }
    
    setLoading(false);
  }, []);

  // ログイン処理
  const login = async (email: string, password: string, businessCode?: string) => {
    try {
      setLoading(true);
      
      // MEMO: 本来はAPIリクエストを行うが、今回はモックデータを使用
      // 実際にはビジネスコードでの照合も行う
      if (!businessCode) {
        throw new Error('ビジネスコードが必要です');
      }
      
      // モックのビジネス情報
      const mockBusiness: Business = {
        id: '1',
        name: 'デモ会社',
        businessCode: businessCode,
        createdAt: new Date().toISOString(),
      };
      
      // モックのユーザー情報
      const mockUser: User = {
        id: '1',
        email,
        username: email.split('@')[0],
        businessId: mockBusiness.id,
        role: 'admin',
      };
      
      // 情報をローカルストレージに保存
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('business', JSON.stringify(mockBusiness));
      
      setUser(mockUser);
      setBusiness(mockBusiness);
      
      // ダッシュボードに遷移
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 新規ビジネス作成とユーザー登録
  const createBusiness = async (name: string, email: string, password: string, username: string) => {
    try {
      setLoading(true);
      
      // 会社IDとビジネスコードを生成
      const businessId = Date.now().toString();
      const businessCode = `B${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      
      // モックのビジネス情報
      const mockBusiness: Business = {
        id: businessId,
        name,
        businessCode,
        createdAt: new Date().toISOString(),
      };
      
      // モックのユーザー情報（管理者権限）
      const mockUser: User = {
        id: '1',
        email,
        username,
        businessId,
        role: 'admin',
      };
      
      // 情報をローカルストレージに保存
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('business', JSON.stringify(mockBusiness));
      
      setUser(mockUser);
      setBusiness(mockBusiness);
      
      // ダッシュボードに遷移
      navigate('/dashboard');
    } catch (error) {
      console.error('Business creation failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // サインアップ処理（招待経由）
  const signup = async (
    email: string, 
    password: string, 
    username: string, 
    businessCode?: string, 
    invitationCode?: string
  ) => {
    try {
      setLoading(true);
      
      // 本来はAPIリクエストで招待コードとビジネスコードの確認を行う
      if (!businessCode || !invitationCode) {
        throw new Error('ビジネスコードと招待コードが必要です');
      }
      
      // モックのビジネス情報（招待から取得したビジネス情報）
      const mockBusiness: Business = {
        id: '1',
        name: 'デモ会社',
        businessCode,
        createdAt: new Date().toISOString(),
      };
      
      // モックのユーザー情報
      const mockUser: User = {
        id: Date.now().toString(),
        email,
        username,
        businessId: mockBusiness.id,
        role: 'user', // デフォルトは一般ユーザー権限
      };
      
      // 情報をローカルストレージに保存
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('business', JSON.stringify(mockBusiness));
      
      setUser(mockUser);
      setBusiness(mockBusiness);
      
      // ダッシュボードに遷移
      navigate('/dashboard');
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ユーザー招待処理（招待コードを生成して返す）
  const inviteUser = async (email: string, role: 'admin' | 'manager' | 'user'): Promise<string> => {
    try {
      // 招待コードを生成
      const invitationCode = `INV${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      
      // 本来はAPIリクエストで招待情報を保存
      console.log(`Inviting user ${email} with role ${role}, invitation code: ${invitationCode}`);
      
      // メール送信処理は実装しないが、フロントエンドでは招待コードを表示
      return invitationCode;
    } catch (error) {
      console.error('Invitation failed:', error);
      throw error;
    }
  };

  // ログアウト処理
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('business');
    setUser(null);
    setBusiness(null);
    navigate('/');
  };

  // 認証状態の判定
  const isAuthenticated = !!user && !!business;

  // コンテキスト値の提供
  const value = {
    user,
    business,
    loading,
    login,
    signup,
    createBusiness,
    inviteUser,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 認証コンテキストを使用するためのフック
export const useAuth = () => useContext(AuthContext);