import { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';

// 新規会社作成と通常サインアップを切り替えるタブの型
type SignupTab = 'newBusiness' | 'joinBusiness';

// 新規会社作成バリデーションスキーマ
const createBusinessSchema = z.object({
  businessName: z
    .string()
    .min(1, '会社名を入力してください')
    .max(50, '会社名は50文字以内で入力してください'),
  email: z
    .string()
    .email('有効なメールアドレスを入力してください'),
  username: z
    .string()
    .min(2, 'ユーザー名は2文字以上で入力してください')
    .max(50, 'ユーザー名は50文字以内で入力してください'),
  password: z
    .string()
    .min(8, 'パスワードは8文字以上で入力してください')
    .regex(/[A-Z]/, 'パスワードには少なくとも1つの大文字を含める必要があります')
    .regex(/[a-z]/, 'パスワードには少なくとも1つの小文字を含める必要があります')
    .regex(/[0-9]/, 'パスワードには少なくとも1つの数字を含める必要があります'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'パスワードが一致しません',
  path: ['confirmPassword'],
});

// 招待経由のサインアップバリデーションスキーマ
const joinBusinessSchema = z.object({
  businessCode: z
    .string()
    .min(1, 'ビジネスコードを入力してください'),
  invitationCode: z
    .string()
    .min(1, '招待コードを入力してください'),
  email: z
    .string()
    .email('有効なメールアドレスを入力してください'),
  username: z
    .string()
    .min(2, 'ユーザー名は2文字以上で入力してください')
    .max(50, 'ユーザー名は50文字以内で入力してください'),
  password: z
    .string()
    .min(8, 'パスワードは8文字以上で入力してください')
    .regex(/[A-Z]/, 'パスワードには少なくとも1つの大文字を含める必要があります')
    .regex(/[a-z]/, 'パスワードには少なくとも1つの小文字を含める必要があります')
    .regex(/[0-9]/, 'パスワードには少なくとも1つの数字を含める必要があります'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'パスワードが一致しません',
  path: ['confirmPassword'],
});

// フォームの型定義
type CreateBusinessFormData = z.infer<typeof createBusinessSchema>;
type JoinBusinessFormData = z.infer<typeof joinBusinessSchema>;

const SignUp: FC = () => {
  const { createBusiness, signup } = useAuth();
  const [activeTab, setActiveTab] = useState<SignupTab>('newBusiness');
  const [signupError, setSignupError] = useState<string | null>(null);
  
  // 新規会社作成フォームの初期化
  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    formState: { errors: errorsCreate, isSubmitting: isSubmittingCreate },
  } = useForm<CreateBusinessFormData>({
    resolver: zodResolver(createBusinessSchema),
    defaultValues: {
      businessName: '',
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    },
  });
  
  // 招待経由のサインアップフォームの初期化
  const {
    register: registerJoin,
    handleSubmit: handleSubmitJoin,
    formState: { errors: errorsJoin, isSubmitting: isSubmittingJoin },
  } = useForm<JoinBusinessFormData>({
    resolver: zodResolver(joinBusinessSchema),
    defaultValues: {
      businessCode: '',
      invitationCode: '',
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    },
  });

  // 新規会社作成処理
  const onSubmitCreate = async (data: CreateBusinessFormData) => {
    try {
      setSignupError(null);
      await createBusiness(
        data.businessName,
        data.email,
        data.password,
        data.username
      );
    } catch (error) {
      console.error('Business creation error:', error);
      setSignupError('会社作成に失敗しました。もう一度お試しください。');
    }
  };

  // 招待経由のサインアップ処理
  const onSubmitJoin = async (data: JoinBusinessFormData) => {
    try {
      setSignupError(null);
      await signup(
        data.email,
        data.password,
        data.username,
        data.businessCode,
        data.invitationCode
      );
    } catch (error) {
      console.error('Signup error:', error);
      setSignupError('サインアップに失敗しました。ビジネスコードと招待コードを確認してください。');
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Sphereにサインアップ</h1>
      
      {/* タブナビゲーション */}
      <div className="flex mb-6">
        <button
          className={`flex-1 py-2 px-4 text-center border-b-2 ${
            activeTab === 'newBusiness'
              ? 'border-blue-500 text-blue-600 font-medium'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('newBusiness')}
        >
          新規会社を作成
        </button>
        <button
          className={`flex-1 py-2 px-4 text-center border-b-2 ${
            activeTab === 'joinBusiness'
              ? 'border-blue-500 text-blue-600 font-medium'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('joinBusiness')}
        >
          招待から参加
        </button>
      </div>
      
      {signupError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {signupError}
        </div>
      )}
      
      {/* 新規会社作成フォーム */}
      {activeTab === 'newBusiness' && (
        <form onSubmit={handleSubmitCreate(onSubmitCreate)}>
          {/* 会社名 */}
          <div className="mb-4">
            <label htmlFor="businessName" className="block text-gray-700 font-medium mb-2">
              会社名
            </label>
            <input
              id="businessName"
              type="text"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errorsCreate.businessName ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500 border-gray-300'
              }`}
              placeholder="例: 株式会社サンプル"
              {...registerCreate('businessName')}
            />
            {errorsCreate.businessName && (
              <p className="mt-1 text-red-500 text-sm">{errorsCreate.businessName.message}</p>
            )}
          </div>

          {/* メールアドレス */}
          <div className="mb-4">
            <label htmlFor="create-email" className="block text-gray-700 font-medium mb-2">
              メールアドレス
            </label>
            <input
              id="create-email"
              type="email"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errorsCreate.email ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500 border-gray-300'
              }`}
              placeholder="例: user@example.com"
              {...registerCreate('email')}
            />
            {errorsCreate.email && (
              <p className="mt-1 text-red-500 text-sm">{errorsCreate.email.message}</p>
            )}
          </div>

          {/* ユーザー名 */}
          <div className="mb-4">
            <label htmlFor="create-username" className="block text-gray-700 font-medium mb-2">
              ユーザー名
            </label>
            <input
              id="create-username"
              type="text"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errorsCreate.username ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500 border-gray-300'
              }`}
              placeholder="例: yamada_taro"
              {...registerCreate('username')}
            />
            {errorsCreate.username && (
              <p className="mt-1 text-red-500 text-sm">{errorsCreate.username.message}</p>
            )}
          </div>

          {/* パスワード */}
          <div className="mb-4">
            <label htmlFor="create-password" className="block text-gray-700 font-medium mb-2">
              パスワード
            </label>
            <input
              id="create-password"
              type="password"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errorsCreate.password ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500 border-gray-300'
              }`}
              {...registerCreate('password')}
            />
            {errorsCreate.password && (
              <p className="mt-1 text-red-500 text-sm">{errorsCreate.password.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              ※ 8文字以上で、大文字、小文字、数字を含む必要があります
            </p>
          </div>
          
          {/* パスワード確認 */}
          <div className="mb-6">
            <label htmlFor="create-confirmPassword" className="block text-gray-700 font-medium mb-2">
              パスワード（確認）
            </label>
            <input
              id="create-confirmPassword"
              type="password"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errorsCreate.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500 border-gray-300'
              }`}
              {...registerCreate('confirmPassword')}
            />
            {errorsCreate.confirmPassword && (
              <p className="mt-1 text-red-500 text-sm">{errorsCreate.confirmPassword.message}</p>
            )}
          </div>

          {/* サインアップボタン */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            disabled={isSubmittingCreate}
          >
            {isSubmittingCreate ? '処理中...' : '会社を作成してサインアップ'}
          </button>
        </form>
      )}
      
      {/* 招待経由のサインアップフォーム */}
      {activeTab === 'joinBusiness' && (
        <form onSubmit={handleSubmitJoin(onSubmitJoin)}>
          {/* ビジネスコード */}
          <div className="mb-4">
            <label htmlFor="businessCode" className="block text-gray-700 font-medium mb-2">
              ビジネスコード
            </label>
            <input
              id="businessCode"
              type="text"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errorsJoin.businessCode ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500 border-gray-300'
              }`}
              placeholder="例: BUSINESS123"
              {...registerJoin('businessCode')}
            />
            {errorsJoin.businessCode && (
              <p className="mt-1 text-red-500 text-sm">{errorsJoin.businessCode.message}</p>
            )}
          </div>

          {/* 招待コード */}
          <div className="mb-4">
            <label htmlFor="invitationCode" className="block text-gray-700 font-medium mb-2">
              招待コード
            </label>
            <input
              id="invitationCode"
              type="text"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errorsJoin.invitationCode ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500 border-gray-300'
              }`}
              placeholder="例: INVITE456"
              {...registerJoin('invitationCode')}
            />
            {errorsJoin.invitationCode && (
              <p className="mt-1 text-red-500 text-sm">{errorsJoin.invitationCode.message}</p>
            )}
          </div>

          {/* メールアドレス */}
          <div className="mb-4">
            <label htmlFor="join-email" className="block text-gray-700 font-medium mb-2">
              メールアドレス
            </label>
            <input
              id="join-email"
              type="email"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errorsJoin.email ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500 border-gray-300'
              }`}
              placeholder="例: user@example.com"
              {...registerJoin('email')}
            />
            {errorsJoin.email && (
              <p className="mt-1 text-red-500 text-sm">{errorsJoin.email.message}</p>
            )}
          </div>

          {/* ユーザー名 */}
          <div className="mb-4">
            <label htmlFor="join-username" className="block text-gray-700 font-medium mb-2">
              ユーザー名
            </label>
            <input
              id="join-username"
              type="text"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errorsJoin.username ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500 border-gray-300'
              }`}
              placeholder="例: yamada_taro"
              {...registerJoin('username')}
            />
            {errorsJoin.username && (
              <p className="mt-1 text-red-500 text-sm">{errorsJoin.username.message}</p>
            )}
          </div>

          {/* パスワード */}
          <div className="mb-4">
            <label htmlFor="join-password" className="block text-gray-700 font-medium mb-2">
              パスワード
            </label>
            <input
              id="join-password"
              type="password"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errorsJoin.password ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500 border-gray-300'
              }`}
              {...registerJoin('password')}
            />
            {errorsJoin.password && (
              <p className="mt-1 text-red-500 text-sm">{errorsJoin.password.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              ※ 8文字以上で、大文字、小文字、数字を含む必要があります
            </p>
          </div>
          
          {/* パスワード確認 */}
          <div className="mb-6">
            <label htmlFor="join-confirmPassword" className="block text-gray-700 font-medium mb-2">
              パスワード（確認）
            </label>
            <input
              id="join-confirmPassword"
              type="password"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errorsJoin.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500 border-gray-300'
              }`}
              {...registerJoin('confirmPassword')}
            />
            {errorsJoin.confirmPassword && (
              <p className="mt-1 text-red-500 text-sm">{errorsJoin.confirmPassword.message}</p>
            )}
          </div>

          {/* サインアップボタン */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            disabled={isSubmittingJoin}
          >
            {isSubmittingJoin ? '処理中...' : 'サインアップ'}
          </button>
        </form>
      )}

      {/* ログインリンク */}
      <div className="mt-6 text-center">
        <p className="text-gray-600">
          すでにアカウントをお持ちですか？{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            ログイン
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;