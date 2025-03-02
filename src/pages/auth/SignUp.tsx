import { FC } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';

// バリデーションスキーマ
const signupSchema = z.object({
  username: z
    .string()
    .min(3, 'ユーザー名は3文字以上で入力してください')
    .max(50, 'ユーザー名は50文字以下で入力してください'),
  email: z
    .string()
    .email('有効なメールアドレスを入力してください'),
  password: z
    .string()
    .min(8, 'パスワードは8文字以上で入力してください')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'パスワードには少なくとも1つの大文字、小文字、数字、特殊文字を含める必要があります'
    ),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'パスワードが一致しません',
  path: ['confirmPassword'],
});

// フォームの型定義
type SignupFormData = z.infer<typeof signupSchema>;

const SignUp: FC = () => {
  const { signup } = useAuth();
  
  // フォームの初期化
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  // サインアップ処理
  const onSubmit = async (data: SignupFormData) => {
    try {
      await signup(data.email, data.password, data.username);
    } catch (error) {
      console.error('Signup error:', error);
      // エラー処理はここで行う
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Sphereにサインアップ</h1>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* ユーザー名 */}
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
            ユーザー名
          </label>
          <input
            id="username"
            type="text"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.username ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500 border-gray-300'
            }`}
            {...register('username')}
          />
          {errors.username && (
            <p className="mt-1 text-red-500 text-sm">{errors.username.message}</p>
          )}
        </div>

        {/* メールアドレス */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
            メールアドレス
          </label>
          <input
            id="email"
            type="email"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.email ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500 border-gray-300'
            }`}
            {...register('email')}
          />
          {errors.email && (
            <p className="mt-1 text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        {/* パスワード */}
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
            パスワード
          </label>
          <input
            id="password"
            type="password"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.password ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500 border-gray-300'
            }`}
            {...register('password')}
          />
          {errors.password && (
            <p className="mt-1 text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        {/* パスワード確認 */}
        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
            パスワード（確認）
          </label>
          <input
            id="confirmPassword"
            type="password"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500 border-gray-300'
            }`}
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-red-500 text-sm">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* サインアップボタン */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'サインアップ中...' : 'サインアップ'}
        </button>
      </form>

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