import { FC, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiSave, FiArrowLeft } from 'react-icons/fi';
import { useBusiness } from '@/context/BusinessContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';

// バリデーションスキーマ
const businessSchema = z.object({
  name: z
    .string()
    .min(1, '事業所名を入力してください')
    .max(50, '事業所名は50文字以内で入力してください'),
});

// フォームの型定義
type BusinessFormData = z.infer<typeof businessSchema>;

const BusinessForm: FC = () => {
  const { businessId } = useParams<{ businessId: string }>();
  const isEditMode = !!businessId;
  const { 
    businesses, 
    loading, 
    error,
    createBusiness, 
    updateBusiness 
  } = useBusiness();
  const navigate = useNavigate();

  // 編集対象のビジネス情報を取得
  const businessToEdit = isEditMode
    ? businesses.find(b => b.id === businessId)
    : null;

  // フォームの初期化
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BusinessFormData>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      name: businessToEdit?.name || '',
    },
  });

  // 編集モードの場合、初期値をセット
  useEffect(() => {
    if (isEditMode && businessToEdit) {
      reset({
        name: businessToEdit.name,
      });
    }
  }, [isEditMode, businessToEdit, reset]);

  // フォーム送信処理
  const onSubmit = async (data: BusinessFormData) => {
    try {
      if (isEditMode && businessId) {
        // 既存ビジネスの更新
        await updateBusiness(businessId, {
          name: data.name,
        });
      } else {
        // 新規ビジネスの作成
        await createBusiness(data.name);
      }
      // 一覧ページへ遷移
      navigate('/business');
    } catch (err) {
      console.error('Business form submission error:', err);
    }
  };

  // 一覧ページへ戻る
  const handleGoBack = () => {
    navigate('/business');
  };

  if (loading) return <LoadingSpinner />;

  if (isEditMode && !businessToEdit) {
    return (
      <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
        指定された事業所が見つかりません。
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
          <h1 className="text-2xl font-bold">
            {isEditMode ? '事業所情報の編集' : '新規事業所の作成'}
          </h1>
        </div>

        {error && (
          <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
            エラーが発生しました: {error}
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-md">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* 事業所名 */}
            <div className="mb-6">
              <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                事業所名 <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.name ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500 border-gray-300'
                }`}
                placeholder="例: 株式会社サンプル"
                {...register('name')}
              />
              {errors.name && (
                <p className="mt-1 text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            {/* 送信ボタン */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="btn btn-primary flex items-center"
                disabled={isSubmitting}
              >
                <FiSave className="mr-2" />
                {isSubmitting ? '保存中...' : isEditMode ? '変更を保存' : '事業所を作成'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BusinessForm;