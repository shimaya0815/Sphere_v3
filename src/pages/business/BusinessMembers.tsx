import { FC, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiArrowLeft, FiUserPlus, FiUserX } from 'react-icons/fi';
import { useBusiness } from '@/context/BusinessContext';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';

// バリデーションスキーマ
const inviteSchema = z.object({
  email: z
    .string()
    .email('有効なメールアドレスを入力してください'),
  role: z
    .enum(['admin', 'member'], {
      invalid_type_error: '権限を選択してください',
    }),
});

// フォームの型定義
type InviteFormData = z.infer<typeof inviteSchema>;

const BusinessMembers: FC = () => {
  const { businessId } = useParams<{ businessId: string }>();
  const { 
    businesses, 
    loading, 
    error, 
    inviteMember, 
    removeMember 
  } = useBusiness();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [inviteMode, setInviteMode] = useState(false);
  const [removeConfirmation, setRemoveConfirmation] = useState<string | null>(null);

  // 対象のビジネス情報を取得
  const business = businessId ? businesses.find(b => b.id === businessId) : null;

  // ユーザーの権限チェック
  const userRole = business?.members.find(m => m.userId === user?.id)?.role;
  const isOwner = userRole === 'owner';
  const isAdmin = userRole === 'admin';
  const canManageMembers = isOwner || isAdmin;

  // フォームの初期化
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: '',
      role: 'member',
    },
  });

  // メンバー招待処理
  const handleInvite = async (data: InviteFormData) => {
    if (!businessId) return;
    
    try {
      await inviteMember(businessId, data.email, data.role as 'admin' | 'member');
      reset();
      setInviteMode(false);
    } catch (err) {
      console.error('Failed to invite member:', err);
    }
  };

  // メンバー削除の確認
  const handleRemoveConfirmation = (userId: string) => {
    setRemoveConfirmation(userId);
  };

  // メンバー削除の実行
  const handleRemoveMember = async (userId: string) => {
    if (!businessId) return;
    
    try {
      await removeMember(businessId, userId);
      setRemoveConfirmation(null);
    } catch (err) {
      console.error('Failed to remove member:', err);
    }
  };

  // 一覧ページへ戻る
  const handleGoBack = () => {
    navigate('/business');
  };

  if (loading) return <LoadingSpinner />;

  if (!business) {
    return (
      <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
        指定された事業所が見つかりません。
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={handleGoBack}
              className="mr-4 text-gray-600 hover:text-gray-900"
            >
              <FiArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold">メンバー管理: {business.name}</h1>
          </div>
          
          {canManageMembers && !inviteMode && (
            <button
              onClick={() => setInviteMode(true)}
              className="btn btn-primary flex items-center"
            >
              <FiUserPlus className="mr-2" /> メンバーを招待
            </button>
          )}
        </div>

        {error && (
          <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
            エラーが発生しました: {error}
          </div>
        )}

        {/* メンバー招待フォーム */}
        {inviteMode && canManageMembers && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-lg font-semibold mb-4">新しいメンバーを招待</h2>
            
            <form onSubmit={handleSubmit(handleInvite)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* メールアドレス */}
                <div>
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                    メールアドレス <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.email ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500 border-gray-300'
                    }`}
                    placeholder="例: user@example.com"
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="mt-1 text-red-500 text-sm">{errors.email.message}</p>
                  )}
                </div>
                
                {/* 権限 */}
                <div>
                  <label htmlFor="role" className="block text-gray-700 font-medium mb-2">
                    権限 <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="role"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.role ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500 border-gray-300'
                    }`}
                    {...register('role')}
                  >
                    <option value="member">メンバー</option>
                    {isOwner && <option value="admin">管理者</option>}
                  </select>
                  {errors.role && (
                    <p className="mt-1 text-red-500 text-sm">{errors.role.message}</p>
                  )}
                </div>
              </div>

              {/* ボタン */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setInviteMode(false)}
                  className="btn btn-outline"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? '招待中...' : '招待を送信'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* メンバーリスト */}
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
                    {canManageMembers && (
                      <th className="px-4 py-3 text-sm font-medium text-gray-500 text-right">アクション</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {business.members.map(member => {
                    // オーナーは削除できない
                    const isOwnerMember = member.role === 'owner';
                    // 自分自身は削除できない
                    const isSelf = member.userId === user?.id;
                    // 管理者は他の管理者を削除できない（オーナーのみ可能）
                    const isAdminMember = member.role === 'admin';
                    const canRemove = canManageMembers && !isOwnerMember && !(isAdminMember && !isOwner) && !isSelf;
                    
                    return (
                      <tr key={member.userId} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{member.username}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{member.email}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            member.role === 'owner' 
                              ? 'bg-purple-100 text-purple-800' 
                              : member.role === 'admin'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-green-100 text-green-800'
                          }`}>
                            {member.role === 'owner' 
                              ? 'オーナー' 
                              : member.role === 'admin' 
                                ? '管理者' 
                                : 'メンバー'}
                          </span>
                        </td>
                        {canManageMembers && (
                          <td className="px-4 py-3 text-right">
                            {canRemove ? (
                              removeConfirmation === member.userId ? (
                                <div className="flex items-center justify-end space-x-2">
                                  <button
                                    onClick={() => handleRemoveMember(member.userId)}
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
                                  onClick={() => handleRemoveConfirmation(member.userId)}
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
            
            {business.members.length === 0 && (
              <p className="text-center py-4 text-gray-500">メンバーが登録されていません</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessMembers;