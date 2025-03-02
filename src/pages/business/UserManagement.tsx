import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiUserPlus, FiUserX } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';

// モックユーザー型定義
interface BusinessUser {
  id: string;
  email: string;
  username: string;
  role: 'admin' | 'manager' | 'user';
  createdAt: string;
}

const UserManagement: FC = () => {
  const { user, business, loading, inviteUser } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<BusinessUser[]>([]);
  const [userLoading, setUserLoading] = useState(true);
  const [inviteMode, setInviteMode] = useState(false);
  const [inviteForm, setInviteForm] = useState({ email: '', role: 'user' as 'admin' | 'manager' | 'user' });
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [removeConfirmation, setRemoveConfirmation] = useState<string | null>(null);

  // ユーザー一覧を取得
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // 本来はAPIから取得するが、今回はモックデータを使用
        const mockUsers: BusinessUser[] = [
          {
            id: '1',
            email: user?.email || 'admin@example.com',
            username: user?.username || 'Admin',
            role: 'admin',
            createdAt: new Date().toISOString(),
          },
          {
            id: '2',
            email: 'manager@example.com',
            username: 'Manager',
            role: 'manager',
            createdAt: new Date(Date.now() - 86400000).toISOString(), // 1日前
          },
          {
            id: '3',
            email: 'user@example.com',
            username: 'User',
            role: 'user',
            createdAt: new Date(Date.now() - 172800000).toISOString(), // 2日前
          },
        ];
        
        setUsers(mockUsers);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setUserLoading(false);
      }
    };
    
    fetchUsers();
  }, [user]);

  // 会社情報ページへ戻る
  const handleGoBack = () => {
    navigate('/business');
  };

  // メンバー招待処理
  const handleInviteUser = async () => {
    try {
      setInviteLoading(true);
      setInviteError(null);
      
      if (!inviteForm.email) {
        setInviteError('メールアドレスを入力してください');
        return;
      }
      
      const code = await inviteUser(inviteForm.email, inviteForm.role);
      setInviteCode(code);
      setInviteForm({ email: '', role: 'user' });
      
      // 実際にユーザーが登録されるのはサインアップ時だが、UIの反応を良くするために
      // 新しいユーザーをリストに追加しておく
      const newUser: BusinessUser = {
        id: `temp-${Date.now()}`,
        email: inviteForm.email,
        username: inviteForm.email.split('@')[0],
        role: inviteForm.role,
        createdAt: new Date().toISOString(),
      };
      
      setUsers(prev => [...prev, newUser]);
    } catch (error) {
      setInviteError('招待処理に失敗しました');
      console.error('Failed to invite user:', error);
    } finally {
      setInviteLoading(false);
    }
  };

  // 招待フォームをリセット
  const resetInviteForm = () => {
    setInviteMode(false);
    setInviteCode(null);
    setInviteError(null);
    setInviteForm({ email: '', role: 'user' });
  };

  // ユーザー削除の確認
  const handleRemoveConfirmation = (userId: string) => {
    setRemoveConfirmation(userId);
  };

  // ユーザー削除処理
  const handleRemoveUser = (userId: string) => {
    try {
      // 本来はAPIリクエストで削除処理を行う
      setUsers(prev => prev.filter(u => u.id !== userId));
      setRemoveConfirmation(null);
    } catch (error) {
      console.error('Failed to remove user:', error);
    }
  };

  // ユーザーの権限を日本語表示
  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'admin':
        return '管理者';
      case 'manager':
        return 'マネージャー';
      case 'user':
        return '一般ユーザー';
      default:
        return role;
    }
  };

  if (loading || userLoading) return <LoadingSpinner />;

  if (!business) {
    return (
      <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
        会社情報が見つかりません。
      </div>
    );
  }

  // 自分自身のユーザーID
  const currentUserId = user?.id;
  // ユーザーが管理者かどうか
  const isAdmin = user?.role === 'admin';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <button
            onClick={handleGoBack}
            className="mr-4 text-gray-600 hover:text-gray-900"
          >
            <FiArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold">ユーザー管理</h1>
        </div>
        
        {isAdmin && !inviteMode && (
          <button
            onClick={() => setInviteMode(true)}
            className="btn btn-primary flex items-center"
          >
            <FiUserPlus className="mr-2" /> メンバーを招待
          </button>
        )}
      </div>

      {/* 招待フォーム */}
      {inviteMode && !inviteCode && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-lg font-semibold mb-4">新しいメンバーを招待</h2>
          
          {inviteError && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {inviteError}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                メールアドレス <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                placeholder="例: user@example.com"
                value={inviteForm.email}
                onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                required
              />
            </div>
            
            <div>
              <label htmlFor="role" className="block text-gray-700 font-medium mb-2">
                権限 <span className="text-red-500">*</span>
              </label>
              <select
                id="role"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                value={inviteForm.role}
                onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value as 'admin' | 'manager' | 'user' })}
              >
                <option value="user">一般ユーザー</option>
                <option value="manager">マネージャー</option>
                <option value="admin">管理者</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={resetInviteForm}
              className="btn btn-outline"
              disabled={inviteLoading}
            >
              キャンセル
            </button>
            <button
              type="button"
              onClick={handleInviteUser}
              className="btn btn-primary"
              disabled={inviteLoading}
            >
              {inviteLoading ? '処理中...' : '招待する'}
            </button>
          </div>
        </div>
      )}
      
      {/* 招待コード表示 */}
      {inviteCode && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-lg font-semibold mb-4">招待コードが発行されました</h2>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-600 mb-2">以下の情報を招待するメンバーに共有してください：</p>
            <div className="bg-white p-4 rounded border border-gray-300 font-mono">
              <p className="mb-2">ビジネスコード: <strong>{business.businessCode}</strong></p>
              <p>招待コード: <strong>{inviteCode}</strong></p>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={resetInviteForm}
              className="btn btn-primary"
            >
              完了
            </button>
          </div>
        </div>
      )}
      
      {/* ユーザーリスト */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">メンバー一覧</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-sm font-medium text-gray-500">ユーザー名</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-500">メールアドレス</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-500">権限</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-500">登録日</th>
                  {isAdmin && (
                    <th className="px-4 py-3 text-sm font-medium text-gray-500 text-right">アクション</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map(user => {
                  // 自分自身は削除できない
                  const isSelf = user.id === currentUserId;
                  // 管理者は他の管理者を削除できない（本当は自分以外の管理者も削除できますが、デモのため制限）
                  const isAdminUser = user.role === 'admin';
                  const canRemove = isAdmin && !isSelf && !isAdminUser;
                  
                  return (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{user.username}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{user.email}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          user.role === 'admin' 
                            ? 'bg-purple-100 text-purple-800' 
                            : user.role === 'manager'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                        }`}>
                          {getRoleDisplay(user.role)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString('ja-JP')}
                      </td>
                      {isAdmin && (
                        <td className="px-4 py-3 text-right">
                          {canRemove ? (
                            removeConfirmation === user.id ? (
                              <div className="flex items-center justify-end space-x-2">
                                <button
                                  onClick={() => handleRemoveUser(user.id)}
                                  className="text-xs text-red-600 hover:text-red-900"
                                >
                                  確認
                                </button>
                                <button
                                  onClick={() => setRemoveConfirmation(null)}
                                  className="text-xs text-gray-500 hover:text-gray-700"
                                >
                                  キャンセル
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleRemoveConfirmation(user.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <FiUserX size={18} />
                              </button>
                            )
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {users.length === 0 && (
            <p className="text-center py-4 text-gray-500">メンバーが登録されていません</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;