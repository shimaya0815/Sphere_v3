import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const BusinessEdit: FC = () => {
  const { business, loading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: business?.name || '',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // フォーム入力ハンドラ
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 会社情報保存処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSaving(true);
      setFormError(null);
      
      if (!formData.name.trim()) {
        setFormError('会社名を入力してください');
        return;
      }
      
      // 本来はAPIリクエストで会社情報を更新する
      console.log('Updating business info:', formData);
      
      // 処理が完了したら会社情報ページに戻る
      setTimeout(() => {
        navigate('/business');
      }, 1000);
    } catch (error) {
      console.error('Failed to save business info:', error);
      setFormError('保存に失敗しました');
    } finally {
      setIsSaving(false);
    }
  };

  // 会社情報ページへ戻る
  const handleGoBack = () => {
    navigate('/business');
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
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-8">
          <button
            onClick={handleGoBack}
            className="mr-4 text-gray-600 hover:text-gray-900"
          >
            <FiArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold">会社情報の編集</h1>
        </div>

        {formError && (
          <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
            {formError}
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-md">
          <form onSubmit={handleSubmit}>
            {/* 会社名 */}
            <div className="mb-6">
              <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                会社名 <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* ビジネスコード (読み取り専用) */}
            <div className="mb-6">
              <label htmlFor="businessCode" className="block text-gray-700 font-medium mb-2">
                ビジネスコード (変更不可)
              </label>
              <input
                id="businessCode"
                type="text"
                className="w-full px-4 py-2 border rounded-lg bg-gray-50 border-gray-300"
                value={business.businessCode}
                readOnly
                disabled
              />
              <p className="mt-1 text-sm text-gray-500">
                ビジネスコードはユーザー招待時に使用されます
              </p>
            </div>

            {/* 送信ボタン */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="btn btn-primary flex items-center"
                disabled={isSaving}
              >
                <FiSave className="mr-2" />
                {isSaving ? '保存中...' : '変更を保存'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BusinessEdit;