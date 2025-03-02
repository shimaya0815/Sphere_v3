import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const Layout: FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex flex-1">
        {isAuthenticated && (
          <Sidebar />
        )}
        
        <main className={`flex-1 p-6 ${isAuthenticated ? 'ml-64' : ''}`}>
          <Outlet />
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default Layout;