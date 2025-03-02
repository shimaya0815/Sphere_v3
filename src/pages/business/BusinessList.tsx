import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEdit2, FiUserPlus, FiUsers } from 'react-icons/fi';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useAuth } from '@/context/AuthContext';

const BusinessManagement: FC = () => {
  const { business, user, loading, inviteUser } = useAuth();
  const navigate = useNavigate();
  const [inviteMode, setInviteMode] = useState(false);
  const [inviteForm, setInviteForm] = useState({ email: '', role: 'user' as 'admin' | 'manager' | 'user' });
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);

  // 会社情報編集ページへ遷移
  const handleEditBusiness = () => {
    navigate('/business/edit');
  };

  // ユーザー管理ページへ遷移
  const handleManageUsers = () => {
    navigate('/business/users');
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

  if (loading) return <LoadingSpinner />;

  if (!business) {
    return (
      <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
        会社情報が見つかりません。
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">会社情報</h1>
        {user?.role === 'admin' && (
          <button
            onClick={() => setInviteMode(true)}
            className="btn btn-primary flex items-center"
          >
            <FiUserPlus className="mr-2" /> メンバーを招待
          </button>
        )}
      </div>

      {/* 会社情報カード */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{business.name}</h2>
              <p className="text-sm text-gray-600">
                ビジネスコード: <span className="font-mono">{business.businessCode}</span>
              </p>
            </div>
            
            {user?.role === 'admin' && (
              <button
                onClick={handleEditBusiness}
                className="btn btn-sm btn-outline btn-info flex items-center"
              >
                <FiEdit2 className="mr-2" /> 編集
              </button>
            )}
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center gap-4 mt-4">
            <div className="flex-1">
              <p className="text-sm text-gray-500">
                作成日: {new Date(business.createdAt).toLocaleDateString('ja-JP')}
              </p>
            </div>
            
            {user?.role === 'admin' && (
              <button
                onClick={handleManageUsers}
                className="btn btn-outline btn-primary flex items-center"
              >
                <FiUsers className="mr-2" /> ユーザー管理
              </button>
            )}
          </div>
        </div>
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
    </div>
  );
};

export default BusinessManagement;