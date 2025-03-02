import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const PrivateRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  // ローディング中はローディングスピナーを表示
  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  // 認証されていない場合はログインページにリダイレクト
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // 認証されている場合は子ルートを表示
  return <Outlet />;
};

export default PrivateRoute;