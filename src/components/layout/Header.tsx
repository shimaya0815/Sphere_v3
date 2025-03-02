import { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { FiUser, FiLogOut, FiSettings, FiHelpCircle, FiBell, FiMenu } from 'react-icons/fi';

const Header: FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    setShowDropdown(false);
    logout();
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex-shrink-0 flex items-center">
              <img
                className="h-8 w-auto"
                src="/favicon.svg"
                alt="Sphere Logo"
              />
              <span className="ml-2 text-xl font-bold text-gray-900">Sphere</span>
            </Link>
            
            {isAuthenticated && (
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                <Link to="/dashboard" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  ダッシュボード
                </Link>
                <Link to="/tasks" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  タスク管理
                </Link>
                <Link to="/clients" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  クライアント管理
                </Link>
                <Link to="/time" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  時間管理
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          {isAuthenticated && (
            <div className="md:hidden flex items-center">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                <FiMenu className="h-6 w-6" />
              </button>
            </div>
          )}

          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center">
                {/* 通知アイコン */}
                <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 mr-2">
                  <FiBell className="h-5 w-5" />
                </button>
                
                {/* ユーザー名とプロフィールアイコン */}
                <div className="relative">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-700 mr-2 hidden md:block">
                      {user?.username} さん
                    </span>
                    <button 
                      className="flex text-sm bg-blue-100 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={() => setShowDropdown(!showDropdown)}
                    >
                      <span className="sr-only">ユーザーメニューを開く</span>
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {user?.username?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                    </button>
                  </div>
                  
                  {/* ドロップダウンメニュー */}
                  {showDropdown && (
                    <div 
                      className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5"
                      onBlur={() => setShowDropdown(false)}
                    >
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{user?.username}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                      <Link 
                        to="/dashboard" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowDropdown(false)}
                      >
                        <FiUser className="inline mr-2" />
                        プロフィール
                      </Link>
                      <Link 
                        to="/settings" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowDropdown(false)}
                      >
                        <FiSettings className="inline mr-2" />
                        設定
                      </Link>
                      <Link 
                        to="/help" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowDropdown(false)}
                      >
                        <FiHelpCircle className="inline mr-2" />
                        ヘルプ
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t border-gray-100"
                      >
                        <FiLogOut className="inline mr-2" />
                        ログアウト
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  ログイン
                </Link>
                <Link
                  to="/signup"
                  className="btn btn-primary"
                >
                  サインアップ
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* モバイルメニュー */}
      {isAuthenticated && showMobileMenu && (
        <div className="md:hidden bg-white shadow-sm border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link 
              to="/dashboard" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setShowMobileMenu(false)}
            >
              ダッシュボード
            </Link>
            <Link 
              to="/tasks" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setShowMobileMenu(false)}
            >
              タスク管理
            </Link>
            <Link 
              to="/clients" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setShowMobileMenu(false)}
            >
              クライアント管理
            </Link>
            <Link 
              to="/time" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setShowMobileMenu(false)}
            >
              時間管理
            </Link>
            <Link 
              to="/chat" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setShowMobileMenu(false)}
            >
              チャット
            </Link>
            <Link 
              to="/wiki" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setShowMobileMenu(false)}
            >
              Wiki
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;