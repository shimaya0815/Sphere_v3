import { FC, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useForm, Controller } from 'react-hook-form';
import { debounce } from 'lodash';
import { 
  FiEdit, 
  FiSave, 
  FiClock, 
  FiUser, 
  FiArrowLeft, 
  FiHome, 
  FiChevronRight,
  FiSearch,
  FiCopy,
  FiTrash2,
  FiBookmark,
  FiEye,
  FiHeart,
  FiFileText,
  FiFolder,
  FiPlus
} from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';

// Wikiページの型定義
interface WikiPage {
  id: string;
  title: string;
  content: string;
  path: string[];
  createdBy: number;
  createdAt: string;
  updatedBy: number;
  updatedAt: string;
  tags: string[];
  version: number;
  versions?: WikiPageVersion[];
  isPublished: boolean;
}

// バージョン履歴の型定義
interface WikiPageVersion {
  version: number;
  content: string;
  updatedBy: number;
  updatedAt: string;
}

// ユーザーの型定義
interface WikiUser {
  id: number;
  name: string;
}

// モックデータ - ユーザー
const mockUsers: WikiUser[] = [
  { id: 1, name: '山田太郎' },
  { id: 2, name: '鈴木一郎' },
  { id: 3, name: '田中花子' },
  { id: 4, name: '佐藤次郎' },
];

// モックデータ - Wikiページ
const mockWikiPages: WikiPage[] = [
  {
    id: 'home',
    title: 'ホーム',
    content: '<h1>Sphere Wikiへようこそ</h1><p>このWikiは、社内の知識共有のためのプラットフォームです。</p><h2>主要コンテンツ</h2><ul><li><a href="/wiki/procedures">業務手順書</a></li><li><a href="/wiki/tools">利用ツール一覧</a></li><li><a href="/wiki/faq">よくある質問</a></li></ul>',
    path: [],
    createdBy: 1,
    createdAt: '2023-01-01T00:00:00',
    updatedBy: 1,
    updatedAt: '2023-06-01T09:00:00',
    tags: ['ホーム', 'インデックス'],
    version: 3,
    isPublished: true,
  },
  {
    id: 'procedures',
    title: '業務手順書',
    content: '<h1>業務手順書</h1><p>各種業務の標準的な手順をまとめています。</p><h2>目次</h2><ul><li><a href="/wiki/procedures/accounting">経理業務</a></li><li><a href="/wiki/procedures/tax">税務業務</a></li></ul>',
    path: ['home'],
    createdBy: 1,
    createdAt: '2023-01-15T10:30:00',
    updatedBy: 2,
    updatedAt: '2023-05-20T14:15:00',
    tags: ['手順', '業務'],
    version: 2,
    isPublished: true,
  },
  {
    id: 'procedures-accounting',
    title: '経理業務手順',
    content: '<h1>経理業務手順</h1><p>経理業務の標準的な手順を解説します。</p><h2>月次決算</h2><p>以下の手順で月次決算を実施します。</p><ol><li>仕訳データの入力確認</li><li>残高試算表の出力</li><li>勘定科目ごとの残高確認</li><li>月次報告書の作成</li></ol>',
    path: ['home', 'procedures'],
    createdBy: 2,
    createdAt: '2023-02-10T13:45:00',
    updatedBy: 3,
    updatedAt: '2023-06-05T11:20:00',
    tags: ['経理', '月次決算', '手順'],
    version: 4,
    isPublished: true,
  },
  {
    id: 'tools',
    title: '利用ツール一覧',
    content: '<h1>利用ツール一覧</h1><p>業務で利用する各種ツールの一覧です。</p><h2>経理・税務ソフトウェア</h2><ul><li>A社会計ソフト - 財務諸表作成用</li><li>B社税務ソフト - 法人税申告書作成用</li></ul><h2>コミュニケーションツール</h2><ul><li>Sphere - 社内コミュニケーション全般</li><li>C社Web会議システム - クライアントとの打ち合わせ用</li></ul>',
    path: ['home'],
    createdBy: 3,
    createdAt: '2023-03-05T09:10:00',
    updatedBy: 1,
    updatedAt: '2023-06-10T16:30:00',
    tags: ['ツール', 'ソフトウェア'],
    version: 2,
    isPublished: true,
  },
  {
    id: 'faq',
    title: 'よくある質問',
    content: '<h1>よくある質問</h1><p>業務に関するよくある質問と回答をまとめています。</p><h2>経理関連</h2><h3>Q: 経費精算の締め日はいつですか？</h3><p>A: 毎月末締めで、翌月5日までに申請してください。</p><h2>税務関連</h2><h3>Q: 法定調書の提出期限はいつですか？</h3><p>A: 翌年1月31日までです。</p>',
    path: ['home'],
    createdBy: 4,
    createdAt: '2023-04-15T11:00:00',
    updatedBy: 2,
    updatedAt: '2023-06-12T10:45:00',
    tags: ['FAQ', '質問'],
    version: 3,
    isPublished: true,
  },
  {
    id: 'procedures-tax',
    title: '税務業務手順',
    content: '<h1>税務業務手順</h1><p>税務業務の標準的な手順を解説します。</p><h2>法人税申告</h2><p>以下の手順で法人税申告を実施します。</p><ol><li>決算書の確認</li><li>税務調整の実施</li><li>法人税申告書の作成</li><li>電子申告の準備と実施</li></ol><h2>消費税申告</h2><p>以下の手順で消費税申告を実施します。</p><ol><li>課税売上・課税仕入の集計</li><li>申告書の作成</li><li>電子申告の実施</li></ol>',
    path: ['home', 'procedures'],
    createdBy: 2,
    createdAt: '2023-03-20T14:30:00',
    updatedBy: 1,
    updatedAt: '2023-05-25T09:15:00',
    tags: ['税務', '法人税', '消費税', '手順'],
    version: 2,
    isPublished: true,
  },
];

// モックデータ - サイドバー（フォルダ構造）
const mockSidebar = [
  {
    id: 'home',
    title: 'ホーム',
    icon: <FiHome />,
    path: [],
  },
  {
    id: 'procedures',
    title: '業務手順書',
    icon: <FiFileText />,
    path: ['home'],
    children: [
      {
        id: 'procedures-accounting',
        title: '経理業務手順',
        icon: <FiFileText />,
        path: ['home', 'procedures'],
      },
      {
        id: 'procedures-tax',
        title: '税務業務手順',
        icon: <FiFileText />,
        path: ['home', 'procedures'],
      },
    ],
  },
  {
    id: 'tools',
    title: '利用ツール一覧',
    icon: <FiFileText />,
    path: ['home'],
  },
  {
    id: 'faq',
    title: 'よくある質問',
    icon: <FiFileText />,
    path: ['home'],
  },
];

// 日付をフォーマットする関数
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Wikiページコンポーネント
const Wiki: FC = () => {
  const { pageId } = useParams<{ pageId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState<WikiPage | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<WikiPage[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState<Record<string, boolean>>({
    procedures: true,
  });

  // フォーム設定
  const { control, handleSubmit, setValue } = useForm<{ content: string }>({
    defaultValues: {
      content: '',
    },
  });

  // 編集時の一時保存のための自動保存（debounce処理）
  const autoSave = debounce((content: string) => {
    console.log('Auto saving...', content.substring(0, 50) + '...');
    // 実際のアプリではAPIを呼び出して一時保存
  }, 2000);

  // ページロード時の処理
  useEffect(() => {
    // ページIDが指定されていない場合はホームページを表示
    const targetPageId = pageId || 'home';
    const page = mockWikiPages.find((p) => p.id === targetPageId);
    
    if (page) {
      setCurrentPage(page);
      setValue('content', page.content);
    } else {
      // ページが見つからない場合はホームに戻る
      navigate('/wiki/home');
    }
  }, [pageId, navigate, setValue]);

  // 検索処理
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const results = mockWikiPages.filter((page) => 
      page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    setSearchResults(results);
    setShowSearch(true);
  };

  // ページ更新処理
  const onSubmit = (data: { content: string }) => {
    if (!currentPage) return;

    // 実際のアプリではAPIを呼び出して更新
    const updatedPage: WikiPage = {
      ...currentPage,
      content: data.content,
      updatedBy: user?.id ? Number(user.id) : 1,
      updatedAt: new Date().toISOString(),
      version: currentPage.version + 1,
    };

    setCurrentPage(updatedPage);
    setIsEditing(false);
  };

  // 編集キャンセル処理
  const handleCancelEdit = () => {
    if (currentPage) {
      setValue('content', currentPage.content);
    }
    setIsEditing(false);
  };

  // ユーザー情報を取得
  const getUserById = (userId: number) => {
    return mockUsers.find((u) => u.id === userId);
  };

  // サイドバー項目のトグル
  const toggleSidebarItem = (id: string) => {
    setSidebarExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // パンくずリストの生成
  const renderBreadcrumbs = () => {
    if (!currentPage) return null;

    const breadcrumbs = [
      { id: 'home', title: 'Wiki', path: '/wiki/home' },
      ...currentPage.path.slice(1).map((pathId, index) => {
        const page = mockWikiPages.find((p) => p.id === pathId);
        return {
          id: pathId,
          title: page?.title || pathId,
          path: `/wiki/${pathId}`,
        };
      }),
    ];

    if (currentPage.id !== 'home') {
      breadcrumbs.push({
        id: currentPage.id,
        title: currentPage.title,
        path: `/wiki/${currentPage.id}`,
      });
    }

    return (
      <div className="flex items-center text-sm text-gray-500 mb-4 overflow-x-auto">
        {breadcrumbs.map((crumb, index) => (
          <div key={crumb.id} className="flex items-center whitespace-nowrap">
            {index > 0 && <FiChevronRight className="mx-2" size={14} />}
            {index === breadcrumbs.length - 1 ? (
              <span className="font-medium text-gray-700">{crumb.title}</span>
            ) : (
              <a
                href={crumb.path}
                className="text-blue-600 hover:text-blue-800"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(crumb.path);
                }}
              >
                {crumb.title}
              </a>
            )}
          </div>
        ))}
      </div>
    );
  };

  // サイドバーの項目をレンダリング
  const renderSidebarItem = (item: any, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = sidebarExpanded[item.id];
    
    return (
      <div key={item.id} className="mb-1">
        <div
          className={`flex items-center px-3 py-2 rounded-lg ${
            currentPage?.id === item.id
              ? 'bg-blue-50 text-blue-600'
              : 'hover:bg-gray-100 text-gray-700'
          }`}
          style={{ paddingLeft: `${level * 12 + 12}px` }}
        >
          <div className="flex-1 flex items-center">
            <span className="mr-2 text-gray-500">{item.icon}</span>
            <a
              href={`/wiki/${item.id}`}
              className="flex-1 truncate"
              onClick={(e) => {
                e.preventDefault();
                navigate(`/wiki/${item.id}`);
              }}
            >
              {item.title}
            </a>
          </div>
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleSidebarItem(item.id);
              }}
              className="p-1 text-gray-500 hover:text-gray-700 rounded-full"
            >
              {isExpanded ? '−' : '+'}
            </button>
          )}
        </div>
        {hasChildren && isExpanded && (
          <div className="ml-2">
            {item.children.map((child: any) => renderSidebarItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (!currentPage) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden min-h-[calc(100vh-180px)]">
        {/* Wiki ヘッダー */}
        <div className="border-b border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Sphere Wiki</h1>
            <div className="mt-4 sm:mt-0 flex space-x-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Wikiを検索..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
              </div>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                onClick={handleSearch}
              >
                <FiSearch className="mr-2" />
                検索
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* サイドバー */}
          <div className="w-64 border-r border-gray-200 p-4 overflow-y-auto bg-gray-50">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="font-medium text-gray-700">ページ一覧</h2>
              <button className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-full">
                <FiPlus size={18} />
              </button>
            </div>
            <div className="space-y-1">
              {mockSidebar.map((item) => renderSidebarItem(item))}
            </div>
          </div>

          {/* メインコンテンツ */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* 検索結果 */}
            {showSearch && searchResults.length > 0 && (
              <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">検索結果: {searchResults.length}件</h2>
                  <button
                    onClick={() => setShowSearch(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    閉じる
                  </button>
                </div>
                <ul className="space-y-3">
                  {searchResults.map((page) => (
                    <li key={page.id} className="border-b border-gray-200 pb-3">
                      <a
                        href={`/wiki/${page.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/wiki/${page.id}`);
                          setShowSearch(false);
                          setSearchQuery('');
                        }}
                      >
                        {page.title}
                      </a>
                      <p className="text-sm text-gray-600 mt-1">
                        {page.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                      </p>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <span className="mr-3">
                          <FiClock className="inline mr-1" />
                          {formatDate(page.updatedAt)}
                        </span>
                        <span>
                          <FiUser className="inline mr-1" />
                          {getUserById(page.updatedBy)?.name}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* パンくずリスト */}
            {renderBreadcrumbs()}

            {/* ページヘッダー */}
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-3xl font-bold text-gray-900">{currentPage.title}</h1>
              <div className="flex space-x-2">
                {!isEditing ? (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                    >
                      <FiEdit className="mr-1" />
                      編集
                    </button>
                    <button
                      onClick={() => setShowHistory(!showHistory)}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center"
                    >
                      <FiClock className="mr-1" />
                      履歴
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleSubmit(onSubmit)}
                      className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                    >
                      <FiSave className="mr-1" />
                      保存
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                      キャンセル
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* メタ情報 */}
            <div className="flex items-center text-sm text-gray-500 mb-6">
              <span className="mr-4">
                <FiUser className="inline mr-1" />
                最終更新者: {getUserById(currentPage.updatedBy)?.name}
              </span>
              <span className="mr-4">
                <FiClock className="inline mr-1" />
                最終更新日: {formatDate(currentPage.updatedAt)}
              </span>
              <span>
                <span className="inline-block mr-1">🔄</span>
                バージョン: {currentPage.version}
              </span>
            </div>

            {/* タグ */}
            {currentPage.tags && currentPage.tags.length > 0 && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {currentPage.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* コンテンツ */}
            <div className="mb-6 border-t border-gray-200 pt-6">
              {isEditing ? (
                <Controller
                  name="content"
                  control={control}
                  render={({ field }) => (
                    <ReactQuill
                      theme="snow"
                      value={field.value}
                      onChange={(content) => {
                        field.onChange(content);
                        autoSave(content);
                      }}
                      modules={{
                        toolbar: [
                          [{ header: [1, 2, 3, 4, 5, 6, false] }],
                          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                          [{ list: 'ordered' }, { list: 'bullet' }],
                          ['link', 'image'],
                          ['clean'],
                        ],
                      }}
                      className="h-64 mb-12"
                    />
                  )}
                />
              ) : (
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: currentPage.content }}
                />
              )}
            </div>

            {/* バージョン履歴 */}
            {showHistory && (
              <div className="mt-8 border-t border-gray-200 pt-6">
                <h2 className="text-xl font-semibold mb-4">バージョン履歴</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-3">
                    {/* 現在のバージョン */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="bg-blue-100 text-blue-800 font-medium px-2.5 py-0.5 rounded-full text-xs mr-2">
                          v{currentPage.version}
                        </span>
                        <span className="text-gray-700">
                          {formatDate(currentPage.updatedAt)} by {getUserById(currentPage.updatedBy)?.name}
                        </span>
                      </div>
                      <span className="text-blue-600 text-sm">現在のバージョン</span>
                    </div>
                    
                    {/* 過去のバージョン（モックデータなので固定） */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="bg-gray-100 text-gray-700 font-medium px-2.5 py-0.5 rounded-full text-xs mr-2">
                          v{currentPage.version - 1}
                        </span>
                        <span className="text-gray-700">
                          {formatDate(new Date(new Date(currentPage.updatedAt).getTime() - 7 * 24 * 60 * 60 * 1000).toISOString())} by {getUserById(currentPage.updatedBy === 1 ? 2 : 1)?.name}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-blue-600 text-sm hover:text-blue-800">
                          <FiEye className="inline mr-1" />
                          表示
                        </button>
                        <button className="text-blue-600 text-sm hover:text-blue-800">
                          <FiCopy className="inline mr-1" />
                          復元
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="bg-gray-100 text-gray-700 font-medium px-2.5 py-0.5 rounded-full text-xs mr-2">
                          v{currentPage.version - 2}
                        </span>
                        <span className="text-gray-700">
                          {formatDate(new Date(new Date(currentPage.updatedAt).getTime() - 14 * 24 * 60 * 60 * 1000).toISOString())} by {getUserById(currentPage.createdBy)?.name}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-blue-600 text-sm hover:text-blue-800">
                          <FiEye className="inline mr-1" />
                          表示
                        </button>
                        <button className="text-blue-600 text-sm hover:text-blue-800">
                          <FiCopy className="inline mr-1" />
                          復元
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wiki;