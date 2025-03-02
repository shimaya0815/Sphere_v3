import { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';

// バリデーションスキーマ
const loginSchema = z.object({
  email: z
    .string()
    .email('有効なメールアドレスを入力してください'),
  password: z
    .string()
    .min(1, 'パスワードを入力してください'),
});

// フォームの型定義
type LoginFormData = z.infer<typeof loginSchema>;

const Login: FC = () => {
  const { login } = useAuth();
  const [loginError, setLoginError] = useState<string | null>(null);
  
  // フォームの初期化
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // ログイン処理
  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoginError(null);
      await login(data.email, data.password);
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('メールアドレスまたはパスワードが正しくありません');
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Sphereにログイン</h1>
      
      {loginError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {loginError}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)}>
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
        <div className="mb-6">
          <div className="flex justify-between">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
              パスワード
            </label>
            <a href="#" className="text-sm text-blue-600 hover:underline">
              パスワードをお忘れですか？
            </a>
          </div>
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

        {/* ログインボタン */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'ログイン中...' : 'ログイン'}
        </button>
      </form>

      {/* サインアップリンク */}
      <div className="mt-6 text-center">
        <p className="text-gray-600">
          アカウントをお持ちでないですか？{' '}
          <Link to="/signup" className="text-blue-600 hover:underline">
            サインアップ
          </Link>
        </p>
      </div>

      {/* デモアカウント */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-center text-gray-600 mb-4">または、デモアカウントでログイン</p>
        <button
          type="button"
          className="w-full bg-gray-100 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
          onClick={() => onSubmit({ email: 'demo@example.com', password: 'password' })}
          disabled={isSubmitting}
        >
          デモアカウントでログイン
        </button>
      </div>
    </div>
  );
};

export default Login;