import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

// ビジネス（事業所）の型定義
export interface Business {
  id: string;
  name: string;
  businessId: string;
  ownerId: string;
  createdAt: string;
  members: Array<{
    userId: string;
    role: 'owner' | 'admin' | 'member';
    email: string;
    username: string;
  }>;
}

// ビジネスコンテキストの型定義
interface BusinessContextType {
  businesses: Business[];
  currentBusiness: Business | null;
  loading: boolean;
  error: string | null;
  createBusiness: (name: string) => Promise<void>;
  updateBusiness: (id: string, data: Partial<Business>) => Promise<void>;
  deleteBusiness: (id: string) => Promise<void>;
  switchBusiness: (id: string) => void;
  inviteMember: (businessId: string, email: string, role: 'admin' | 'member') => Promise<void>;
  removeMember: (businessId: string, userId: string) => Promise<void>;
}

// デフォルト値を持つビジネスコンテキストの作成
const BusinessContext = createContext<BusinessContextType>({
  businesses: [],
  currentBusiness: null,
  loading: false,
  error: null,
  createBusiness: async () => {},
  updateBusiness: async () => {},
  deleteBusiness: async () => {},
  switchBusiness: () => {},
  inviteMember: async () => {},
  removeMember: async () => {},
});

// BusinessProviderのprops型定義
interface BusinessProviderProps {
  children: ReactNode;
}

// ビジネスプロバイダーコンポーネント
export const BusinessProvider = ({ children }: BusinessProviderProps) => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [currentBusiness, setCurrentBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // 初期化: ユーザーが所属するビジネス一覧を取得
  useEffect(() => {
    const fetchBusinesses = async () => {
      if (!user) {
        setBusinesses([]);
        setCurrentBusiness(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // MEMO: 本来はAPIリクエストを行うが、今回はモックデータを使用
        const mockBusinesses: Business[] = [
          {
            id: '1',
            name: 'デモ事業所',
            businessId: 'demo-business',
            ownerId: user.id,
            createdAt: new Date().toISOString(),
            members: [
              {
                userId: user.id,
                role: 'owner',
                email: user.email,
                username: user.username,
              },
            ],
          },
        ];

        setBusinesses(mockBusinesses);

        // 現在のビジネスを設定
        const storedCurrentBusinessId = localStorage.getItem('currentBusinessId');
        if (storedCurrentBusinessId) {
          const currentBiz = mockBusinesses.find(b => b.id === storedCurrentBusinessId);
          if (currentBiz) {
            setCurrentBusiness(currentBiz);
          } else if (mockBusinesses.length > 0) {
            setCurrentBusiness(mockBusinesses[0]);
            localStorage.setItem('currentBusinessId', mockBusinesses[0].id);
          }
        } else if (mockBusinesses.length > 0) {
          setCurrentBusiness(mockBusinesses[0]);
          localStorage.setItem('currentBusinessId', mockBusinesses[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch businesses:', err);
        setError('事業所情報の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, [user]);

  // 新規ビジネス作成
  const createBusiness = async (name: string) => {
    if (!user) {
      throw new Error('ログインが必要です');
    }

    try {
      setLoading(true);
      setError(null);

      // MEMO: 本来はAPIリクエストを行うが、今回はモックデータを使用
      const newBusiness: Business = {
        id: Date.now().toString(),
        name,
        businessId: `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now().toString().substring(7)}`,
        ownerId: user.id,
        createdAt: new Date().toISOString(),
        members: [
          {
            userId: user.id,
            role: 'owner',
            email: user.email,
            username: user.username,
          },
        ],
      };

      setBusinesses(prev => [...prev, newBusiness]);
      setCurrentBusiness(newBusiness);
      localStorage.setItem('currentBusinessId', newBusiness.id);
    } catch (err) {
      console.error('Failed to create business:', err);
      setError('事業所の作成に失敗しました');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ビジネス更新
  const updateBusiness = async (id: string, data: Partial<Business>) => {
    try {
      setLoading(true);
      setError(null);

      // MEMO: 本来はAPIリクエストを行うが、今回はモックデータを更新
      setBusinesses(prev => 
        prev.map(business => 
          business.id === id ? { ...business, ...data } : business
        )
      );

      // 現在のビジネスが更新対象の場合、現在のビジネスも更新
      if (currentBusiness && currentBusiness.id === id) {
        setCurrentBusiness(prevBusiness => 
          prevBusiness ? { ...prevBusiness, ...data } : null
        );
      }
    } catch (err) {
      console.error('Failed to update business:', err);
      setError('事業所の更新に失敗しました');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ビジネス削除
  const deleteBusiness = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      // MEMO: 本来はAPIリクエストを行うが、今回はモックデータを更新
      setBusinesses(prev => prev.filter(business => business.id !== id));

      // 現在のビジネスが削除対象の場合、別のビジネスに切り替え
      if (currentBusiness && currentBusiness.id === id) {
        const remainingBusinesses = businesses.filter(business => business.id !== id);
        if (remainingBusinesses.length > 0) {
          setCurrentBusiness(remainingBusinesses[0]);
          localStorage.setItem('currentBusinessId', remainingBusinesses[0].id);
        } else {
          setCurrentBusiness(null);
          localStorage.removeItem('currentBusinessId');
        }
      }
    } catch (err) {
      console.error('Failed to delete business:', err);
      setError('事業所の削除に失敗しました');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ビジネス切り替え
  const switchBusiness = (id: string) => {
    const business = businesses.find(b => b.id === id);
    if (business) {
      setCurrentBusiness(business);
      localStorage.setItem('currentBusinessId', business.id);
    } else {
      console.error(`Business with id ${id} not found`);
    }
  };

  // メンバー招待
  const inviteMember = async (businessId: string, email: string, role: 'admin' | 'member') => {
    try {
      setLoading(true);
      setError(null);

      // MEMO: 本来はAPIリクエストを行うが、今回はモックデータを更新
      const mockInvitedUser = {
        userId: `invite-${Date.now()}`,
        role,
        email,
        username: email.split('@')[0],
      };

      setBusinesses(prev => 
        prev.map(business => 
          business.id === businessId
            ? { ...business, members: [...business.members, mockInvitedUser] }
            : business
        )
      );

      // 現在のビジネスが更新対象の場合、現在のビジネスも更新
      if (currentBusiness && currentBusiness.id === businessId) {
        setCurrentBusiness(prevBusiness => 
          prevBusiness
            ? { ...prevBusiness, members: [...prevBusiness.members, mockInvitedUser] }
            : null
        );
      }
    } catch (err) {
      console.error('Failed to invite member:', err);
      setError('メンバーの招待に失敗しました');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // メンバー削除
  const removeMember = async (businessId: string, userId: string) => {
    try {
      setLoading(true);
      setError(null);

      // MEMO: 本来はAPIリクエストを行うが、今回はモックデータを更新
      setBusinesses(prev => 
        prev.map(business => 
          business.id === businessId
            ? { 
                ...business, 
                members: business.members.filter(member => member.userId !== userId) 
              }
            : business
        )
      );

      // 現在のビジネスが更新対象の場合、現在のビジネスも更新
      if (currentBusiness && currentBusiness.id === businessId) {
        setCurrentBusiness(prevBusiness => 
          prevBusiness
            ? { 
                ...prevBusiness, 
                members: prevBusiness.members.filter(member => member.userId !== userId) 
              }
            : null
        );
      }
    } catch (err) {
      console.error('Failed to remove member:', err);
      setError('メンバーの削除に失敗しました');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // コンテキスト値の提供
  const value = {
    businesses,
    currentBusiness,
    loading,
    error,
    createBusiness,
    updateBusiness,
    deleteBusiness,
    switchBusiness,
    inviteMember,
    removeMember,
  };

  return <BusinessContext.Provider value={value}>{children}</BusinessContext.Provider>;
};

// ビジネスコンテキストを使用するためのフック
export const useBusiness = () => useContext(BusinessContext);