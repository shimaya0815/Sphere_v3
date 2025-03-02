import { FC, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiHome, 
  FiList, 
  FiUsers, 
  FiClock, 
  FiMessageSquare, 
  FiFileText,
  FiSettings,
  FiHelpCircle,
  FiPieChart,
  FiGrid,
  FiUserPlus
} from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { useBusiness } from '@/context/BusinessContext';

// サイドバーナビゲーションアイテムの型定義
interface NavItem {
  path: string;
  label: string;
  icon: JSX.Element;
  submenu?: NavItem[];
}

const Sidebar: FC = () => {
  const { user } = useAuth();
  const { currentBusiness } = useBusiness();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  // ナビゲーションアイテムのリスト
  const navItems: NavItem[] = [
    {
      path: '/dashboard',
      label: 'ダッシュボード',
      icon: <FiHome className="w-5 h-5" />,
    },
    {
      path: '/business',
      label: '事業所管理',
      icon: <FiGrid className="w-5 h-5" />,
      submenu: [
        {
          path: '/business',
          label: '事業所一覧',
          icon: <FiGrid className="w-4 h-4" />,
        },
        {
          path: '/business/new',
          label: '新規事業所',
          icon: <FiGrid className="w-4 h-4" />,
        },
        {
          path: currentBusiness ? `/business/${currentBusiness.id}/members` : '/business',
          label: 'メンバー管理',
          icon: <FiUserPlus className="w-4 h-4" />,
        }
      ]
    },
    {
      path: '/tasks',
      label: 'タスク管理',
      icon: <FiList className="w-5 h-5" />,
      submenu: [
        {
          path: '/tasks',
          label: 'タスク一覧',
          icon: <FiList className="w-4 h-4" />,
        },
        {
          path: '/tasks/new',
          label: '新規タスク',
          icon: <FiList className="w-4 h-4" />,
        }
      ]
    },
    {
      path: '/clients',
      label: 'クライアント管理',
      icon: <FiUsers className="w-5 h-5" />,
      submenu: [
        {
          path: '/clients',
          label: 'クライアント一覧',
          icon: <FiUsers className="w-4 h-4" />,
        },
        {
          path: '/clients/new',
          label: '新規クライアント',
          icon: <FiUsers className="w-4 h-4" />,
        }
      ]
    },
    {
      path: '/time',
      label: '時間管理',
      icon: <FiClock className="w-5 h-5" />,
    },
    {
      path: '/chat',
      label: 'チャット',
      icon: <FiMessageSquare className="w-5 h-5" />,
    },
    {
      path: '/wiki',
      label: 'Wiki',
      icon: <FiFileText className="w-5 h-5" />,
    },
    {
      path: '/reports',
      label: 'レポート',
      icon: <FiPieChart className="w-5 h-5" />,
    },
  ];

  // ユーティリティリンク
  const utilityLinks: NavItem[] = [
    {
      path: '/settings',
      label: '設定',
      icon: <FiSettings className="w-5 h-5" />,
    },
    {
      path: '/help',
      label: 'ヘルプ',
      icon: <FiHelpCircle className="w-5 h-5" />,
    },
  ];

  // サブメニューの表示/非表示を切り替え
  const toggleSubmenu = (path: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  // サブメニューを持つアイテムかどうかを判定
  const hasSubmenu = (item: NavItem) => {
    return item.submenu && item.submenu.length > 0;
  };

  // サブメニューのレンダリング
  const renderSubmenu = (item: NavItem) => {
    if (!hasSubmenu(item) || !expandedItems[item.path]) return null;

    return (
      <ul className="mt-1 ml-6 space-y-1">
        {item.submenu?.map(subItem => (
          <li key={subItem.path}>
            <NavLink
              to={subItem.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-2 text-sm text-gray-700 rounded-lg ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'hover:bg-gray-100'
                }`
              }
            >
              {subItem.icon}
              <span className="ml-3">{subItem.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <aside className="w-64 fixed inset-y-0 left-0 bg-white shadow-md pt-16 z-10">
      <div className="h-full flex flex-col overflow-y-auto">
        {/* ユーザー情報 */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-medium">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{user?.username || 'ユーザー'}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email || 'email@example.com'}</p>
            </div>
          </div>
          
          {/* 現在の事業所 */}
          {currentBusiness && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-md bg-blue-50 flex items-center justify-center">
                    <FiGrid className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-xs text-gray-500">現在の事業所</p>
                  <p className="text-sm font-medium text-gray-900 truncate">{currentBusiness.name}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* メインナビゲーション */}
        <nav className="flex-1 px-4 py-6">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            メインメニュー
          </h2>
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <div>
                  <div className="flex items-center justify-between">
                    <NavLink
                      to={item.path}
                      end={hasSubmenu(item)}
                      className={({ isActive }) =>
                        `flex items-center flex-grow px-4 py-3 text-gray-700 rounded-lg ${
                          isActive
                            ? 'bg-blue-50 text-blue-700'
                            : 'hover:bg-gray-100'
                        }`
                      }
                    >
                      {item.icon}
                      <span className="ml-3">{item.label}</span>
                    </NavLink>
                    {hasSubmenu(item) && (
                      <button
                        onClick={() => toggleSubmenu(item.path)}
                        className="px-2 py-1 text-gray-500 hover:text-gray-700 rounded"
                      >
                        {expandedItems[item.path] ? '−' : '+'}
                      </button>
                    )}
                  </div>
                  {renderSubmenu(item)}
                </div>
              </li>
            ))}
          </ul>
        </nav>

        {/* ユーティリティナビゲーション */}
        <div className="px-4 py-4 border-t border-gray-200">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            その他
          </h2>
          <ul className="space-y-1">
            {utilityLinks.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 text-gray-700 rounded-lg ${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'hover:bg-gray-100'
                    }`
                  }
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;