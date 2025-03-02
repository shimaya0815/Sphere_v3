import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiUsers } from 'react-icons/fi';
import { useBusiness } from '@/context/BusinessContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useAuth } from '@/context/AuthContext';

const BusinessList: FC = () => {
  const { businesses, currentBusiness, loading, error, switchBusiness, deleteBusiness } = useBusiness();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null);

  // ビジネス切り替え
  const handleSwitchBusiness = (id: string) => {
    switchBusiness(id);
  };

  // ビジネス編集ページへ遷移
  const handleEditBusiness = (id: string) => {
    navigate(`/business/${id}/edit`);
  };

  // ビジネス削除の確認
  const handleDeleteConfirmation = (id: string) => {
    setDeleteConfirmation(id);
  };

  // ビジネス削除の実行
  const handleDeleteBusiness = async (id: string) => {
    try {
      await deleteBusiness(id);
      setDeleteConfirmation(null);
    } catch (error) {
      console.error('Failed to delete business:', error);
    }
  };

  // ビジネスメンバー管理ページへ遷移
  const handleManageMembers = (id: string) => {
    navigate(`/business/${id}/members`);
  };

  // 新規ビジネス作成ページへ遷移
  const handleCreateBusiness = () => {
    navigate('/business/new');
  };

  // ユーザーのビジネスでの役割を取得
  const getUserRoleInBusiness = (businessId: string) => {
    const business = businesses.find(b => b.id === businessId);
    if (!business || !user) return null;
    
    const member = business.members.find(m => m.userId === user.id);
    return member?.role;
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
        エラーが発生しました: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">事業所一覧</h1>
        <button
          onClick={handleCreateBusiness}
          className="btn btn-primary flex items-center"
        >
          <FiPlus className="mr-2" /> 新規事業所を作成
        </button>
      </div>

      {businesses.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-gray-600 mb-4">事業所がまだ登録されていません。</p>
          <button
            onClick={handleCreateBusiness}
            className="btn btn-primary"
          >
            最初の事業所を作成する
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map(business => {
            const isCurrentBusiness = currentBusiness?.id === business.id;
            const userRole = getUserRoleInBusiness(business.id);
            const isOwnerOrAdmin = userRole === 'owner' || userRole === 'admin';
            
            return (
              <div
                key={business.id}
                className={`bg-white rounded-lg shadow-md overflow-hidden ${
                  isCurrentBusiness ? 'border-2 border-blue-500' : ''
                }`}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">{business.name}</h2>
                    {isCurrentBusiness && (
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        現在選択中
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">
                    事業所ID: {business.businessId}
                  </p>
                  
                  <p className="text-sm text-gray-600 mb-4">
                    メンバー数: {business.members.length}人
                  </p>
                  
                  <p className="text-xs text-gray-500 mb-6">
                    作成日: {new Date(business.createdAt).toLocaleDateString('ja-JP')}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {!isCurrentBusiness && (
                      <button
                        onClick={() => handleSwitchBusiness(business.id)}
                        className="btn btn-sm btn-outline btn-primary flex-1"
                      >
                        この事業所に切り替え
                      </button>
                    )}
                    
                    {isOwnerOrAdmin && (
                      <>
                        <button
                          onClick={() => handleEditBusiness(business.id)}
                          className="btn btn-sm btn-outline btn-info flex items-center justify-center"
                        >
                          <FiEdit2 />
                        </button>
                        
                        <button
                          onClick={() => handleManageMembers(business.id)}
                          className="btn btn-sm btn-outline btn-success flex items-center justify-center"
                        >
                          <FiUsers />
                        </button>
                        
                        {userRole === 'owner' && (
                          <button
                            onClick={() => handleDeleteConfirmation(business.id)}
                            className="btn btn-sm btn-outline btn-error flex items-center justify-center"
                          >
                            <FiTrash2 />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
                
                {/* 削除確認ダイアログ */}
                {deleteConfirmation === business.id && (
                  <div className="p-4 bg-red-50 border-t border-red-200">
                    <p className="text-red-700 text-sm mb-3">
                      この事業所を削除しますか？この操作は元に戻せません。
                    </p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDeleteBusiness(business.id)}
                        className="btn btn-sm btn-error flex-1"
                      >
                        削除する
                      </button>
                      <button
                        onClick={() => setDeleteConfirmation(null)}
                        className="btn btn-sm btn-outline flex-1"
                      >
                        キャンセル
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BusinessList;