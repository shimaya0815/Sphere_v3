import { FC } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiCheckCircle, 
  FiClock, 
  FiUsers, 
  FiAlertCircle, 
  FiBarChart2,
  FiCalendar
} from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';

// モックデータ
const mockStats = {
  totalTasks: 24,
  completedTasks: 16,
  pendingTasks: 8,
  totalClients: 5,
  todayHours: 6.5,
  weeklyHours: 32.5,
};

// モックのタスクデータ
const mockTasks = [
  { id: 1, title: '請求書の作成', dueDate: '2023-06-15', priority: 'high', status: 'pending' },
  { id: 2, title: 'クライアントミーティング', dueDate: '2023-06-14', priority: 'medium', status: 'pending' },
  { id: 3, title: '税務申告書の確認', dueDate: '2023-06-20', priority: 'high', status: 'pending' },
  { id: 4, title: '月次レポートの作成', dueDate: '2023-06-30', priority: 'medium', status: 'pending' },
];

const Dashboard: FC = () => {
  const { user } = useAuth();

  // 優先度に応じたクラス名を取得する関数
  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-orange-600 bg-orange-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">ダッシュボード</h1>
        <p className="text-gray-600 mt-2">
          ようこそ、{user?.username} さん！アプリの概要とステータスを確認できます。
        </p>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <FiCheckCircle className="text-blue-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-600">タスク完了率</p>
              <div className="flex items-end">
                <h3 className="text-2xl font-bold text-gray-900">
                  {Math.round((mockStats.completedTasks / mockStats.totalTasks) * 100)}%
                </h3>
                <p className="text-gray-500 ml-2">
                  ({mockStats.completedTasks}/{mockStats.totalTasks})
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${(mockStats.completedTasks / mockStats.totalTasks) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-full mr-4">
              <FiUsers className="text-purple-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-600">クライアント</p>
              <div className="flex items-end">
                <h3 className="text-2xl font-bold text-gray-900">
                  {mockStats.totalClients}
                </h3>
                <p className="text-gray-500 ml-2">社</p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/clients" className="text-purple-600 hover:underline text-sm">
              クライアント一覧を見る →
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <FiClock className="text-green-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-600">作業時間</p>
              <div className="flex items-end">
                <h3 className="text-2xl font-bold text-gray-900">
                  {mockStats.todayHours}
                </h3>
                <p className="text-gray-500 ml-2">時間（今日）</p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-gray-600">
              今週: <span className="font-bold">{mockStats.weeklyHours}</span> 時間
            </p>
          </div>
        </div>
      </div>

      {/* 残タスクとカレンダー */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">期限が近いタスク</h2>
            <Link to="/tasks" className="text-blue-600 hover:underline text-sm">
              すべてのタスクを見る →
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 text-left text-sm font-medium text-gray-500">タスク名</th>
                  <th className="py-3 text-left text-sm font-medium text-gray-500">期限</th>
                  <th className="py-3 text-left text-sm font-medium text-gray-500">優先度</th>
                  <th className="py-3 text-right text-sm font-medium text-gray-500">アクション</th>
                </tr>
              </thead>
              <tbody>
                {mockTasks.map((task) => (
                  <tr key={task.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-4 text-sm text-gray-900">{task.title}</td>
                    <td className="py-4 text-sm text-gray-900">{task.dueDate}</td>
                    <td className="py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityClass(task.priority)}`}>
                        {task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}
                      </span>
                    </td>
                    <td className="py-4 text-sm text-right">
                      <Link 
                        to={`/tasks/${task.id}`} 
                        className="text-blue-600 hover:underline"
                      >
                        詳細
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">通知</h2>
            <button className="text-blue-600 hover:underline text-sm">
              すべて既読にする
            </button>
          </div>
          
          <ul className="space-y-4">
            <li className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-start">
                <FiAlertCircle className="text-blue-600 mt-1 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-900">
                    <strong>請求書の期限が近づいています</strong>
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    株式会社Aの請求書の提出期限が3日後です
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    2時間前
                  </p>
                </div>
              </div>
            </li>
            <li className="p-3 rounded-lg">
              <div className="flex items-start">
                <FiCalendar className="text-gray-600 mt-1 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-900">
                    <strong>明日のミーティング</strong>
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    クライアントBとの月次ミーティング (10:00)
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    3時間前
                  </p>
                </div>
              </div>
            </li>
            <li className="p-3 rounded-lg">
              <div className="flex items-start">
                <FiBarChart2 className="text-gray-600 mt-1 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-900">
                    <strong>月次レポートが完了しました</strong>
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    5月の月次レポートが正常に生成されました
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    1日前
                  </p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;