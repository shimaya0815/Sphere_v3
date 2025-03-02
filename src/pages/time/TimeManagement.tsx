import { FC, useState } from 'react';
import { 
  FiCalendar, 
  FiFilter, 
  FiUser, 
  FiClock, 
  FiPieChart, 
  FiDownload,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// 時間記録の型定義
interface TimeRecord {
  id: number;
  userId: number;
  userName: string;
  taskId: number;
  taskTitle: string;
  clientId: number;
  clientName: string;
  category: string;
  startTime: string;
  endTime: string;
  duration: number; // 分単位
  notes?: string;
}

// ユーザーの型定義
interface User {
  id: number;
  name: string;
}

// カテゴリーの型定義
interface Category {
  id: string;
  name: string;
  color: string;
}

// クライアントの型定義
interface Client {
  id: number;
  name: string;
}

// モックデータ - 時間記録
const mockTimeRecords: TimeRecord[] = [
  {
    id: 1,
    userId: 1,
    userName: '山田太郎',
    taskId: 101,
    taskTitle: '法人税申告書の作成',
    clientId: 1,
    clientName: '株式会社ABC',
    category: 'tax',
    startTime: '2023-06-10T09:00:00',
    endTime: '2023-06-10T12:30:00',
    duration: 210, // 3時間30分
    notes: '資料の不足があり、クライアントに追加資料の提出を依頼',
  },
  {
    id: 2,
    userId: 1,
    userName: '山田太郎',
    taskId: 102,
    taskTitle: '月次決算レポート作成',
    clientId: 2,
    clientName: '株式会社XYZ',
    category: 'accounting',
    startTime: '2023-06-10T13:30:00',
    endTime: '2023-06-10T17:00:00',
    duration: 210, // 3時間30分
  },
  {
    id: 3,
    userId: 2,
    userName: '鈴木一郎',
    taskId: 103,
    taskTitle: '給与計算',
    clientId: 3,
    clientName: '有限会社DEF',
    category: 'accounting',
    startTime: '2023-06-11T10:00:00',
    endTime: '2023-06-11T15:00:00',
    duration: 300, // 5時間
  },
  {
    id: 4,
    userId: 3,
    userName: '田中花子',
    taskId: 104,
    taskTitle: 'クライアントミーティング',
    clientId: 1,
    clientName: '株式会社ABC',
    category: 'meeting',
    startTime: '2023-06-12T14:00:00',
    endTime: '2023-06-12T15:30:00',
    duration: 90, // 1時間30分
    notes: '次回の打ち合わせは7月上旬に設定予定',
  },
  {
    id: 5,
    userId: 1,
    userName: '山田太郎',
    taskId: 105,
    taskTitle: '税務調査対応',
    clientId: 4,
    clientName: '合同会社GHI',
    category: 'tax',
    startTime: '2023-06-13T09:30:00',
    endTime: '2023-06-13T16:00:00',
    duration: 390, // 6時間30分
  },
];

// モックデータ - ユーザー
const mockUsers: User[] = [
  { id: 1, name: '山田太郎' },
  { id: 2, name: '鈴木一郎' },
  { id: 3, name: '田中花子' },
  { id: 4, name: '佐藤次郎' },
];

// モックデータ - カテゴリー
const mockCategories: Category[] = [
  { id: 'tax', name: '税務', color: '#3b82f6' },
  { id: 'accounting', name: '会計', color: '#10b981' },
  { id: 'meeting', name: 'ミーティング', color: '#8b5cf6' },
  { id: 'admin', name: '管理業務', color: '#f59e0b' },
  { id: 'other', name: 'その他', color: '#6b7280' },
];

// モックデータ - クライアント
const mockClients: Client[] = [
  { id: 1, name: '株式会社ABC' },
  { id: 2, name: '株式会社XYZ' },
  { id: 3, name: '有限会社DEF' },
  { id: 4, name: '合同会社GHI' },
  { id: 5, name: '株式会社JKL' },
];

// 日付範囲の型定義
interface DateRange {
  startDate: string;
  endDate: string;
}

// 週次範囲を取得する関数
const getWeekRange = (date: Date): DateRange => {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // 週の始まりを月曜日に調整
  const monday = new Date(date.setDate(diff));
  const sunday = new Date(new Date(monday).setDate(monday.getDate() + 6));
  
  return {
    startDate: monday.toISOString().split('T')[0],
    endDate: sunday.toISOString().split('T')[0],
  };
};

// 月次範囲を取得する関数
const getMonthRange = (date: Date): DateRange => {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  
  return {
    startDate: firstDay.toISOString().split('T')[0],
    endDate: lastDay.toISOString().split('T')[0],
  };
};

// 日付をフォーマットする関数
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

// 時間を時:分形式でフォーマットする関数
const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

// 時間（分）を時間:分形式でフォーマットする関数
const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}時間${mins > 0 ? ` ${mins}分` : ''}`;
};

// 週の日付を取得する関数
const getWeekDays = (startDate: string, endDate: string): string[] => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days: string[] = [];
  
  for (let day = new Date(start); day <= end; day.setDate(day.getDate() + 1)) {
    days.push(day.toISOString().split('T')[0]);
  }
  
  return days;
};

const TimeManagement: FC = () => {
  const today = new Date();
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  const [dateRange, setDateRange] = useState<DateRange>(getWeekRange(today));
  const [showFilters, setShowFilters] = useState(false);
  const [filterUser, setFilterUser] = useState<number | null>(null);
  const [filterClient, setFilterClient] = useState<number | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  // 日付範囲を前に移動
  const movePrevious = () => {
    const startDate = new Date(dateRange.startDate);
    
    if (viewMode === 'day') {
      startDate.setDate(startDate.getDate() - 1);
      const endDate = new Date(startDate);
      setDateRange({
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      });
    } else if (viewMode === 'week') {
      startDate.setDate(startDate.getDate() - 7);
      setDateRange(getWeekRange(startDate));
    } else {
      startDate.setMonth(startDate.getMonth() - 1);
      setDateRange(getMonthRange(startDate));
    }
  };

  // 日付範囲を次に移動
  const moveNext = () => {
    const startDate = new Date(dateRange.startDate);
    
    if (viewMode === 'day') {
      startDate.setDate(startDate.getDate() + 1);
      const endDate = new Date(startDate);
      setDateRange({
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      });
    } else if (viewMode === 'week') {
      startDate.setDate(startDate.getDate() + 7);
      setDateRange(getWeekRange(startDate));
    } else {
      startDate.setMonth(startDate.getMonth() + 1);
      setDateRange(getMonthRange(startDate));
    }
  };

  // 今日/今週/今月に移動
  const moveToday = () => {
    if (viewMode === 'day') {
      const todayStr = today.toISOString().split('T')[0];
      setDateRange({
        startDate: todayStr,
        endDate: todayStr,
      });
    } else if (viewMode === 'week') {
      setDateRange(getWeekRange(today));
    } else {
      setDateRange(getMonthRange(today));
    }
  };

  // 表示モードの変更時に日付範囲を調整
  const handleViewModeChange = (mode: 'day' | 'week' | 'month') => {
    setViewMode(mode);
    
    if (mode === 'day') {
      const todayStr = today.toISOString().split('T')[0];
      setDateRange({
        startDate: todayStr,
        endDate: todayStr,
      });
    } else if (mode === 'week') {
      setDateRange(getWeekRange(today));
    } else {
      setDateRange(getMonthRange(today));
    }
  };

  // フィルタリングされた時間記録を取得
  const getFilteredTimeRecords = () => {
    return mockTimeRecords.filter((record) => {
      // 日付範囲でフィルタリング
      const recordDate = record.startTime.split('T')[0];
      const withinDateRange = recordDate >= dateRange.startDate && recordDate <= dateRange.endDate;
      
      // ユーザーでフィルタリング
      const matchesUser = filterUser ? record.userId === filterUser : true;
      
      // クライアントでフィルタリング
      const matchesClient = filterClient ? record.clientId === filterClient : true;
      
      // カテゴリーでフィルタリング
      const matchesCategory = filterCategory ? record.category === filterCategory : true;
      
      return withinDateRange && matchesUser && matchesClient && matchesCategory;
    });
  };

  // フィルタリングされた時間記録
  const filteredRecords = getFilteredTimeRecords();

  // 合計時間（分）
  const totalMinutes = filteredRecords.reduce((sum, record) => sum + record.duration, 0);

  // カテゴリー別の時間集計データ
  const getCategoryData = () => {
    const categoryData: { [key: string]: number } = {};
    
    filteredRecords.forEach((record) => {
      if (categoryData[record.category]) {
        categoryData[record.category] += record.duration;
      } else {
        categoryData[record.category] = record.duration;
      }
    });
    
    return Object.keys(categoryData).map((key) => ({
      name: mockCategories.find((cat) => cat.id === key)?.name || key,
      value: categoryData[key],
      color: mockCategories.find((cat) => cat.id === key)?.color || '#6b7280',
    }));
  };

  // クライアント別の時間集計データ
  const getClientData = () => {
    const clientData: { [key: number]: number } = {};
    
    filteredRecords.forEach((record) => {
      if (clientData[record.clientId]) {
        clientData[record.clientId] += record.duration;
      } else {
        clientData[record.clientId] = record.duration;
      }
    });
    
    return Object.keys(clientData).map((key) => ({
      name: mockClients.find((client) => client.id === Number(key))?.name || `クライアント ${key}`,
      duration: clientData[Number(key)],
    }));
  };

  // 日別の時間集計データ
  const getDailyData = () => {
    const dailyData: { [key: string]: number } = {};
    
    // 日付範囲内のすべての日を初期化
    const days = getWeekDays(dateRange.startDate, dateRange.endDate);
    days.forEach((day) => {
      dailyData[day] = 0;
    });
    
    // 各記録の時間を集計
    filteredRecords.forEach((record) => {
      const day = record.startTime.split('T')[0];
      if (dailyData[day] !== undefined) {
        dailyData[day] += record.duration;
      }
    });
    
    // グラフ用データ形式に変換
    return Object.keys(dailyData).map((key) => ({
      date: key,
      formattedDate: formatDate(key),
      shortDate: new Date(key).toLocaleDateString('ja-JP', { weekday: 'short', day: 'numeric' }),
      minutes: dailyData[key],
      hours: Math.round(dailyData[key] / 60 * 10) / 10, // 小数点1桁まで
    }));
  };

  // グラフデータの準備
  const categoryData = getCategoryData();
  const clientData = getClientData();
  const dailyData = getDailyData();

  // 期間のタイトル表示
  const getDateRangeTitle = () => {
    if (viewMode === 'day') {
      return formatDate(dateRange.startDate);
    } else if (viewMode === 'week') {
      return `${formatDate(dateRange.startDate)} 〜 ${formatDate(dateRange.endDate)}`;
    } else {
      const date = new Date(dateRange.startDate);
      return date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' });
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">時間管理</h1>
          <p className="text-gray-600">
            作業時間の記録と分析
          </p>
        </div>
      </div>

      {/* 期間選択とフィルター */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <button
              className={`px-3 py-1 rounded ${viewMode === 'day' ? 'bg-blue-100 text-blue-800 font-medium' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => handleViewModeChange('day')}
            >
              日
            </button>
            <button
              className={`px-3 py-1 rounded ${viewMode === 'week' ? 'bg-blue-100 text-blue-800 font-medium' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => handleViewModeChange('week')}
            >
              週
            </button>
            <button
              className={`px-3 py-1 rounded ${viewMode === 'month' ? 'bg-blue-100 text-blue-800 font-medium' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => handleViewModeChange('month')}
            >
              月
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              className="p-1 text-gray-600 hover:text-gray-900"
              onClick={movePrevious}
            >
              <FiChevronLeft size={20} />
            </button>
            <h2 className="text-lg font-medium text-gray-900 w-48 text-center">
              {getDateRangeTitle()}
            </h2>
            <button
              className="p-1 text-gray-600 hover:text-gray-900"
              onClick={moveNext}
            >
              <FiChevronRight size={20} />
            </button>
            <button
              className="ml-2 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              onClick={moveToday}
            >
              今日
            </button>
          </div>
          
          <button
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FiFilter className="mr-2" />
            フィルター
            {(filterUser || filterClient || filterCategory) && (
              <span className="ml-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {(filterUser ? 1 : 0) + (filterClient ? 1 : 0) + (filterCategory ? 1 : 0)}
              </span>
            )}
          </button>
        </div>

        {/* フィルターパネル */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* ユーザーフィルター */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FiUser className="mr-2" />
                  ユーザー
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filterUser || ''}
                  onChange={(e) => setFilterUser(e.target.value ? Number(e.target.value) : null)}
                >
                  <option value="">すべてのユーザー</option>
                  {mockUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* クライアントフィルター */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FiCalendar className="mr-2" />
                  クライアント
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filterClient || ''}
                  onChange={(e) => setFilterClient(e.target.value ? Number(e.target.value) : null)}
                >
                  <option value="">すべてのクライアント</option>
                  {mockClients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* カテゴリーフィルター */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FiClock className="mr-2" />
                  カテゴリー
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filterCategory || ''}
                  onChange={(e) => setFilterCategory(e.target.value || null)}
                >
                  <option value="">すべてのカテゴリー</option>
                  {mockCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 mr-2"
                onClick={() => {
                  setFilterUser(null);
                  setFilterClient(null);
                  setFilterCategory(null);
                }}
              >
                リセット
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={() => setShowFilters(false)}
              >
                適用
              </button>
            </div>
          </div>
        )}
      </div>

      {/* サマリーカード */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">合計時間</h3>
            <FiClock className="text-blue-500 text-xl" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{formatDuration(totalMinutes)}</p>
          <p className="text-sm text-gray-500 mt-1">期間: {getDateRangeTitle()}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">記録数</h3>
            <FiCalendar className="text-green-500 text-xl" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{filteredRecords.length}件</p>
          <p className="text-sm text-gray-500 mt-1">期間: {getDateRangeTitle()}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">1日あたりの平均</h3>
            <FiPieChart className="text-purple-500 text-xl" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {formatDuration(Math.round(totalMinutes / (viewMode === 'day' ? 1 : getWeekDays(dateRange.startDate, dateRange.endDate).length)))}
          </p>
          <p className="text-sm text-gray-500 mt-1">期間: {getDateRangeTitle()}</p>
        </div>
      </div>

      {/* グラフ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* 日別時間グラフ */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">日別作業時間</h3>
            <button className="text-gray-500 hover:text-gray-700">
              <FiDownload />
            </button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="shortDate" />
                <YAxis label={{ value: '時間', angle: -90, position: 'insideLeft' }} />
                <Tooltip 
                  formatter={(value: number) => [`${value} 時間`, '作業時間']}
                  labelFormatter={(label) => `${label}`}
                />
                <Bar dataKey="hours" fill="#3b82f6" name="作業時間" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* カテゴリー別円グラフ */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">カテゴリー別時間</h3>
            <button className="text-gray-500 hover:text-gray-700">
              <FiDownload />
            </button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={(entry) => `${entry.name}: ${Math.round(entry.value / 60 * 10) / 10}時間`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`${formatDuration(value)}`, '作業時間']}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* クライアント別グラフ */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800">クライアント別作業時間</h3>
          <button className="text-gray-500 hover:text-gray-700">
            <FiDownload />
          </button>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={clientData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" label={{ value: '時間', position: 'insideBottom', offset: -5 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={100} />
              <Tooltip 
                formatter={(value: number) => [`${Math.round(value / 60 * 10) / 10} 時間`, '作業時間']}
              />
              <Bar dataKey="duration" name="作業時間（分）" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 時間記録一覧 */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">時間記録一覧</h3>
          <div className="flex space-x-2">
            <button className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
              CSVエクスポート
            </button>
            <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
              新規記録
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  日付
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  時間
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  担当者
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  クライアント
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  タスク
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  カテゴリー
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  作業時間
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(record.startTime)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatTime(record.startTime)} - {formatTime(record.endTime)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.userName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.clientName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.taskTitle}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                      style={{
                        backgroundColor: `${mockCategories.find((cat) => cat.id === record.category)?.color}20`,
                        color: mockCategories.find((cat) => cat.id === record.category)?.color,
                      }}
                    >
                      {mockCategories.find((cat) => cat.id === record.category)?.name || record.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDuration(record.duration)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredRecords.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">この期間の時間記録はありません</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeManagement;