import { FC, useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  FiChevronLeft,
  FiEdit,
  FiTrash2,
  FiSave,
  FiUser,
  FiMapPin,
  FiPhone,
  FiMail,
  FiCalendar,
  FiClock,
  FiClipboard,
  FiFileText,
  FiTrendingUp,
} from 'react-icons/fi';

// クライアントの型定義
interface Client {
  id: number;
  name: string;
  industry: string;
  address: string;
  contactPerson: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  fiscalYearEnd: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

// モックデータ
const mockClients: Client[] = [
  {
    id: 1,
    name: '株式会社ABC',
    industry: '製造業',
    address: '東京都港区1-1-1',
    contactPerson: '山田太郎',
    email: 'yamada@abc.co.jp',
    phone: '03-1234-5678',
    status: 'active',
    fiscalYearEnd: '12-31',
    createdAt: '2023-01-15T09:00:00',
    updatedAt: '2023-05-20T14:30:00',
    notes: '2023年度の税務申告書類の準備中。来月中旬に打ち合わせ予定。',
  },
  {
    id: 2,
    name: '株式会社XYZ',
    industry: 'IT',
    address: '大阪市中央区2-2-2',
    contactPerson: '佐藤花子',
    email: 'sato@xyz.co.jp',
    phone: '06-8765-4321',
    status: 'active',
    fiscalYearEnd: '03-31',
    createdAt: '2023-02-10T10:15:00',
    updatedAt: '2023-04-05T11:45:00',
    notes: '新システム導入に伴う会計処理の変更について相談中。',
  },
];

// タスクの簡易型定義
interface Task {
  id: number;
  title: string;
  status: string;
  dueDate: string;
}

// モックタスクデータ
const mockTasks: Task[] = [
  {
    id: 101,
    title: '法人税申告書作成',
    status: 'inProgress',
    dueDate: '2023-06-20',
  },
  {
    id: 102,
    title: '月次決算資料確認',
    status: 'todo',
    dueDate: '2023-06-15',
  },
  {
    id: 103,
    title: '経費精算処理',
    status: 'done',
    dueDate: '2023-06-05',
  },
];

// 業種のオプション
const industryOptions = [
  '製造業',
  'IT',
  '小売業',
  'サービス業',
  '建設業',
  '金融業',
  '不動産業',
  '医療・福祉',
  'その他',
];

// バリデーションスキーマ
const clientSchema = z.object({
  name: z.string().min(1, '会社名は必須です'),
  industry: z.string().min(1, '業種は必須です'),
  address: z.string().min(1, '住所は必須です'),
  contactPerson: z.string().min(1, '担当者名は必須です'),
  email: z.string().email('有効なメールアドレスを入力してください'),
  phone: z.string().min(1, '電話番号は必須です'),
  status: z.enum(['active', 'inactive']),
  fiscalYearEnd: z.string().min(1, '決算期は必須です'),
  notes: z.string().optional(),
});

type ClientFormData = z.infer<typeof clientSchema>;

const ClientDetail: FC = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('info'); // 'info', 'tasks', 'notes'

  // タスクのステータスに応じたクラス名を取得
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'todo':
        return 'bg-gray-100 text-gray-800';
      case 'inProgress':
        return 'bg-blue-100 text-blue-800';
      case 'review':
        return 'bg-yellow-100 text-yellow-800';
      case 'done':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // 編集用フォームの設定
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: '',
      industry: '',
      address: '',
      contactPerson: '',
      email: '',
      phone: '',
      status: 'active',
      fiscalYearEnd: '',
      notes: '',
    },
  });

  // クライアントデータの取得
  useEffect(() => {
    // 実際のアプリではAPIからデータを取得
    const fetchClient = async () => {
      try {
        setLoading(true);
        // モックデータから該当のクライアントを検索
        const foundClient = mockClients.find(
          (c) => c.id === Number(clientId)
        );

        if (foundClient) {
          setClient(foundClient);
          reset({
            name: foundClient.name,
            industry: foundClient.industry,
            address: foundClient.address,
            contactPerson: foundClient.contactPerson,
            email: foundClient.email,
            phone: foundClient.phone,
            status: foundClient.status,
            fiscalYearEnd: foundClient.fiscalYearEnd,
            notes: foundClient.notes || '',
          });
        } else {
          // クライアントが見つからない場合はリダイレクト
          navigate('/clients');
        }
      } catch (error) {
        console.error('Error fetching client:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [clientId, navigate, reset]);

  // クライアントの更新処理
  const onSubmit = (data: ClientFormData) => {
    // 実際のアプリではAPIを使ってデータを更新
    if (client) {
      const updatedClient = {
        ...client,
        ...data,
        updatedAt: new Date().toISOString(),
      };
      setClient(updatedClient);
      setEditMode(false);
    }
  };

  // 日付のフォーマット
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  // 決算期の表示形式を変換
  const formatFiscalYearEnd = (fiscalYearEnd: string) => {
    const [month, day] = fiscalYearEnd.split('-');
    return `${month}月${day}日`;
  };

  // ローディング中の表示
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // クライアントが見つからない場合
  if (!client) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600">クライアントが見つかりませんでした</p>
        <Link to="/clients" className="mt-4 inline-block text-blue-600 hover:underline">
          クライアント一覧に戻る
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      {/* 戻るボタンとアクション */}
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/clients"
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <FiChevronLeft className="mr-1" />
          クライアント一覧に戻る
        </Link>
        <div className="flex space-x-2">
          {!editMode ? (
            <>
              <button
                onClick={() => setEditMode(true)}
                className="btn btn-outline btn-sm flex items-center"
              >
                <FiEdit className="mr-1" />
                編集
              </button>
              <button className="btn btn-outline btn-error btn-sm flex items-center">
                <FiTrash2 className="mr-1" />
                削除
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditMode(false)}
              className="btn btn-outline btn-sm"
            >
              キャンセル
            </button>
          )}
        </div>
      </div>

      {/* クライアント基本情報 */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="p-6 border-b border-gray-200">
          {editMode ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  クライアント名
                </label>
                <input
                  {...register('name')}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.name ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500 border-gray-300'
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    業種
                  </label>
                  <select
                    {...register('industry')}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.industry ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500 border-gray-300'
                    }`}
                  >
                    {industryOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {errors.industry && (
                    <p className="mt-1 text-red-500 text-sm">{errors.industry.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    ステータス
                  </label>
                  <select
                    {...register('status')}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.status ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500 border-gray-300'
                    }`}
                  >
                    <option value="active">有効</option>
                    <option value="inactive">無効</option>
                  </select>
                  {errors.status && (
                    <p className="mt-1 text-red-500 text-sm">{errors.status.message}</p>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  住所
                </label>
                <input
                  {...register('address')}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.address ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500 border-gray-300'
                  }`}
                />
                {errors.address && (
                  <p className="mt-1 text-red-500 text-sm">{errors.address.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    担当者
                  </label>
                  <input
                    {...register('contactPerson')}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.contactPerson ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500 border-gray-300'
                    }`}
                  />
                  {errors.contactPerson && (
                    <p className="mt-1 text-red-500 text-sm">{errors.contactPerson.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    メールアドレス
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.email ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500 border-gray-300'
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-red-500 text-sm">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    電話番号
                  </label>
                  <input
                    {...register('phone')}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.phone ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500 border-gray-300'
                    }`}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-red-500 text-sm">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  決算期（月-日）
                </label>
                <input
                  {...register('fiscalYearEnd')}
                  placeholder="MM-DD形式（例: 03-31）"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.fiscalYearEnd ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500 border-gray-300'
                  }`}
                />
                {errors.fiscalYearEnd && (
                  <p className="mt-1 text-red-500 text-sm">{errors.fiscalYearEnd.message}</p>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  備考
                </label>
                <textarea
                  {...register('notes')}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="btn btn-primary flex items-center"
                >
                  <FiSave className="mr-1" />
                  保存
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{client.name}</h1>
                  <div className="flex items-center">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      client.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {client.status === 'active' ? '有効' : '無効'}
                    </span>
                    <span className="ml-2 text-sm text-gray-500">{client.industry}</span>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  <div>登録日: {formatDate(client.createdAt)}</div>
                  <div>更新日: {formatDate(client.updatedAt)}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="flex items-start mb-4">
                    <FiMapPin className="text-gray-400 mt-1 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-gray-700">住所</div>
                      <div className="text-gray-900">{client.address}</div>
                    </div>
                  </div>

                  <div className="flex items-start mb-4">
                    <FiUser className="text-gray-400 mt-1 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-gray-700">担当者</div>
                      <div className="text-gray-900">{client.contactPerson}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-start mb-4">
                    <FiMail className="text-gray-400 mt-1 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-gray-700">メールアドレス</div>
                      <div className="text-gray-900">{client.email}</div>
                    </div>
                  </div>

                  <div className="flex items-start mb-4">
                    <FiPhone className="text-gray-400 mt-1 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-gray-700">電話番号</div>
                      <div className="text-gray-900">{client.phone}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start mb-4">
                <FiCalendar className="text-gray-400 mt-1 mr-2" />
                <div>
                  <div className="text-sm font-medium text-gray-700">決算期</div>
                  <div className="text-gray-900">{formatFiscalYearEnd(client.fiscalYearEnd)}</div>
                </div>
              </div>

              {client.notes && (
                <div className="flex items-start">
                  <FiFileText className="text-gray-400 mt-1 mr-2" />
                  <div>
                    <div className="text-sm font-medium text-gray-700">備考</div>
                    <div className="text-gray-900 whitespace-pre-line">{client.notes}</div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* タブナビゲーション */}
        {!editMode && (
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                className={`px-6 py-3 border-b-2 font-medium text-sm ${
                  activeTab === 'info'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('info')}
              >
                基本情報
              </button>
              <button
                className={`px-6 py-3 border-b-2 font-medium text-sm ${
                  activeTab === 'tasks'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('tasks')}
              >
                関連タスク
              </button>
              <button
                className={`px-6 py-3 border-b-2 font-medium text-sm ${
                  activeTab === 'reports'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('reports')}
              >
                レポート
              </button>
            </nav>
          </div>
        )}

        {/* タブコンテンツ */}
        {!editMode && (
          <div className="p-6">
            {activeTab === 'info' && (
              <div>
                <h2 className="text-lg font-semibold mb-4">アクティビティ履歴</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <FiClock className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-900">月次決算書類の提出完了</p>
                      <p className="text-xs text-gray-500">2023年5月10日 15:30</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <FiClipboard className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-900">電子申告システムの利用方法についてサポート</p>
                      <p className="text-xs text-gray-500">2023年4月22日 10:15</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <FiFileText className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-900">確定申告書類の提出完了</p>
                      <p className="text-xs text-gray-500">2023年3月15日 14:00</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tasks' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">関連タスク</h2>
                  <button className="btn btn-sm btn-outline">
                    新規タスク作成
                  </button>
                </div>
                <div className="bg-white rounded-lg border border-gray-200">
                  <ul className="divide-y divide-gray-200">
                    {mockTasks.map((task) => (
                      <li key={task.id} className="p-4 hover:bg-gray-50">
                        <div className="flex justify-between">
                          <div>
                            <Link to={`/tasks/${task.id}`} className="text-blue-600 hover:underline font-medium">
                              {task.title}
                            </Link>
                            <div className="mt-1 flex items-center">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(task.status)}`}>
                                {task.status === 'todo' ? '未着手' : 
                                  task.status === 'inProgress' ? '進行中' : 
                                  task.status === 'review' ? 'レビュー中' : '完了'}
                              </span>
                              <span className="ml-2 text-sm text-gray-500">
                                期限: {task.dueDate}
                              </span>
                            </div>
                          </div>
                          <Link to={`/tasks/${task.id}`} className="text-gray-400 hover:text-gray-600">
                            <FiEdit />
                          </Link>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                {mockTasks.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">関連タスクがありません</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reports' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">レポート</h2>
                  <div className="flex space-x-2">
                    <button className="btn btn-sm btn-outline">
                      CSVエクスポート
                    </button>
                    <button className="btn btn-sm btn-outline">
                      PDFエクスポート
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <FiClock className="mr-2" />
                      作業時間統計
                    </h3>
                    <div className="text-2xl font-bold text-gray-900 mb-1">42.5時間</div>
                    <div className="text-sm text-gray-500">過去3ヶ月間</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <FiClipboard className="mr-2" />
                      完了タスク数
                    </h3>
                    <div className="text-2xl font-bold text-gray-900 mb-1">18件</div>
                    <div className="text-sm text-gray-500">過去3ヶ月間</div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
                    <FiTrendingUp className="mr-2" />
                    月別作業時間推移
                  </h3>
                  <div className="h-64 flex items-center justify-center text-gray-400">
                    チャート表示エリア（実際の実装ではRechartsなどを使用）
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDetail;