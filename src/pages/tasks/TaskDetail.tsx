import { FC, useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  FiCalendar,
  FiClock,
  FiTag,
  FiUser,
  FiMessageSquare,
  FiPaperclip,
  FiEdit,
  FiTrash2,
  FiChevronLeft,
  FiPlay,
  FiPause,
  FiCheck,
} from 'react-icons/fi';

// タスクの型定義
interface Task {
  id: number;
  title: string;
  description: string;
  status: 'todo' | 'inProgress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  assignee: string;
  category?: string;
  comments?: Comment[];
  timeRecords?: TimeRecord[];
}

// コメントの型定義
interface Comment {
  id: number;
  author: string;
  content: string;
  createdAt: string;
}

// 時間記録の型定義
interface TimeRecord {
  id: number;
  startTime: string;
  endTime?: string;
  duration?: number; // 分単位
  note?: string;
}

// カテゴリーのデータ
const categories = {
  tax: { name: '税務', color: 'bg-blue-100 text-blue-800' },
  accounting: { name: '会計', color: 'bg-green-100 text-green-800' },
  meeting: { name: 'ミーティング', color: 'bg-purple-100 text-purple-800' },
  admin: { name: '管理', color: 'bg-yellow-100 text-yellow-800' },
  other: { name: 'その他', color: 'bg-gray-100 text-gray-800' },
};

// モックデータ
const mockTasks: Task[] = [
  {
    id: 1,
    title: '法人税申告の準備',
    description: 'A社の法人税申告の資料の準備と確認',
    status: 'todo',
    priority: 'high',
    dueDate: '2023-06-30',
    assignee: '山田太郎',
    category: 'tax',
    comments: [
      {
        id: 1,
        author: '鈴木一郎',
        content: '前年度の資料を参考にしてください',
        createdAt: '2023-06-10T09:00:00',
      },
    ],
    timeRecords: [],
  },
  {
    id: 2,
    title: '月次決算の入力',
    description: 'B社の5月度の月次決算の入力と確認',
    status: 'todo',
    priority: 'medium',
    dueDate: '2023-06-25',
    assignee: '鈴木一郎',
    category: 'accounting',
    comments: [],
    timeRecords: [],
  },
];

const TaskDetail: FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [activeTimer, setActiveTimer] = useState<TimeRecord | null>(null);

  // 優先度に応じたクラス名を取得
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

  // 優先度のテキストを取得
  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return '高';
      case 'medium':
        return '中';
      case 'low':
        return '低';
      default:
        return '';
    }
  };

  // ステータスのテキストとクラスを取得
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'todo':
        return { text: '未着手', class: 'bg-gray-100 text-gray-800' };
      case 'inProgress':
        return { text: '進行中', class: 'bg-blue-100 text-blue-800' };
      case 'review':
        return { text: 'レビュー中', class: 'bg-yellow-100 text-yellow-800' };
      case 'done':
        return { text: '完了', class: 'bg-green-100 text-green-800' };
      default:
        return { text: '', class: '' };
    }
  };

  // 編集用フォームの設定
  const { register, handleSubmit, control, reset } = useForm<Task>();

  // タスクデータの取得
  useEffect(() => {
    // 実際のアプリではAPIからデータを取得
    const fetchTask = async () => {
      try {
        setLoading(true);
        // モックデータから該当のタスクを検索
        const foundTask = mockTasks.find(
          (t) => t.id === Number(taskId)
        );

        if (foundTask) {
          setTask(foundTask);
          reset(foundTask); // フォームの初期値を設定
        } else {
          // タスクが見つからない場合はリダイレクト
          navigate('/tasks');
        }
      } catch (error) {
        console.error('Error fetching task:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId, navigate, reset]);

  // タスクの更新処理
  const onSubmit = (data: Task) => {
    // 実際のアプリではAPIを使ってデータを更新
    setTask({ ...task, ...data } as Task);
    setEditMode(false);
  };

  // コメントの追加処理
  const addComment = () => {
    if (!newComment.trim() || !task) return;

    const comment: Comment = {
      id: Date.now(),
      author: '現在のユーザー', // 実際には認証ユーザー名を使用
      content: newComment,
      createdAt: new Date().toISOString(),
    };

    setTask({
      ...task,
      comments: [...(task.comments || []), comment],
    });
    setNewComment('');
  };

  // タイマーの開始
  const startTimer = () => {
    if (activeTimer || !task) return;

    const newTimer: TimeRecord = {
      id: Date.now(),
      startTime: new Date().toISOString(),
    };

    setActiveTimer(newTimer);
  };

  // タイマーの停止
  const stopTimer = () => {
    if (!activeTimer || !task) return;

    const endTime = new Date().toISOString();
    const startDate = new Date(activeTimer.startTime);
    const endDate = new Date(endTime);
    const durationMinutes = Math.round((endDate.getTime() - startDate.getTime()) / 60000);

    const completedTimer: TimeRecord = {
      ...activeTimer,
      endTime,
      duration: durationMinutes,
    };

    setTask({
      ...task,
      timeRecords: [...(task.timeRecords || []), completedTimer],
    });
    setActiveTimer(null);
  };

  // 日時のフォーマット
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // ローディング中の表示
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // タスクが見つからない場合
  if (!task) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600">タスクが見つかりませんでした</p>
        <Link to="/tasks" className="mt-4 inline-block text-blue-600 hover:underline">
          タスク一覧に戻る
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      {/* 戻るボタンとアクション */}
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/tasks"
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <FiChevronLeft className="mr-1" />
          タスク一覧に戻る
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

      {/* タスク詳細 */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* タスクヘッダー */}
        <div className="p-6 border-b border-gray-200">
          {editMode ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  タイトル
                </label>
                <input
                  {...register('title', { required: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    ステータス
                  </label>
                  <select
                    {...register('status')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="todo">未着手</option>
                    <option value="inProgress">進行中</option>
                    <option value="review">レビュー中</option>
                    <option value="done">完了</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    優先度
                  </label>
                  <select
                    {...register('priority')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">低</option>
                    <option value="medium">中</option>
                    <option value="high">高</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    期限日
                  </label>
                  <input
                    type="date"
                    {...register('dueDate')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    担当者
                  </label>
                  <input
                    {...register('assignee')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    カテゴリー
                  </label>
                  <select
                    {...register('category')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">選択なし</option>
                    <option value="tax">税務</option>
                    <option value="accounting">会計</option>
                    <option value="meeting">ミーティング</option>
                    <option value="admin">管理</option>
                    <option value="other">その他</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  説明
                </label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <ReactQuill
                      theme="snow"
                      value={field.value}
                      onChange={field.onChange}
                      className="bg-white"
                    />
                  )}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="btn btn-outline"
                >
                  キャンセル
                </button>
                <button type="submit" className="btn btn-primary">
                  保存
                </button>
              </div>
            </form>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{task.title}</h1>

              <div className="flex flex-wrap gap-3 mb-6">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusInfo(task.status).class}`}>
                  {getStatusInfo(task.status).text}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityClass(task.priority)}`}>
                  優先度: {getPriorityText(task.priority)}
                </span>
                {task.category && (
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${categories[task.category as keyof typeof categories]?.color || 'bg-gray-100 text-gray-800'}`}>
                    {categories[task.category as keyof typeof categories]?.name || task.category}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <FiCalendar className="mr-2" />
                  <span>期限: {task.dueDate}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FiUser className="mr-2" />
                  <span>担当: {task.assignee}</span>
                </div>
              </div>

              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: task.description }} />
              </div>
            </>
          )}
        </div>

        {/* タイマーセクション */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <FiClock className="mr-2" />
            時間管理
          </h2>

          <div className="mb-4">
            {activeTimer ? (
              <div className="flex items-center">
                <span className="text-gray-600 mr-4">
                  開始: {formatDate(activeTimer.startTime)}
                </span>
                <button
                  onClick={stopTimer}
                  className="btn btn-warning btn-sm flex items-center"
                >
                  <FiPause className="mr-1" />
                  停止
                </button>
              </div>
            ) : (
              <button
                onClick={startTimer}
                className="btn btn-success btn-sm flex items-center"
              >
                <FiPlay className="mr-1" />
                作業開始
              </button>
            )}
          </div>

          {(task.timeRecords?.length || 0) > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">作業履歴</h3>
              <div className="bg-white rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">開始時間</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">終了時間</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">作業時間</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {task.timeRecords?.map((record) => (
                      <tr key={record.id}>
                        <td className="px-4 py-2 text-sm text-gray-900">{formatDate(record.startTime)}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{record.endTime ? formatDate(record.endTime) : '-'}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {record.duration ? `${Math.floor(record.duration / 60)}時間 ${record.duration % 60}分` : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50">
                      <td colSpan={2} className="px-4 py-2 text-sm font-medium text-gray-700">合計</td>
                      <td className="px-4 py-2 text-sm font-medium text-gray-700">
                        {task.timeRecords?.reduce((total, record) => total + (record.duration || 0), 0) || 0}分
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* コメントセクション */}
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <FiMessageSquare className="mr-2" />
            コメント ({task.comments?.length || 0})
          </h2>

          {/* コメント入力 */}
          <div className="mb-6">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="コメントを入力..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            ></textarea>
            <div className="mt-2 flex justify-between items-center">
              <button className="flex items-center text-gray-600 hover:text-gray-900">
                <FiPaperclip className="mr-1" />
                添付ファイル
              </button>
              <button
                onClick={addComment}
                disabled={!newComment.trim()}
                className="btn btn-primary btn-sm"
              >
                <FiCheck className="mr-1" />
                コメント追加
              </button>
            </div>
          </div>

          {/* コメント一覧 */}
          {task.comments && task.comments.length > 0 ? (
            <ul className="space-y-4">
              {task.comments.map((comment) => (
                <li key={comment.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-gray-900">{comment.author}</span>
                    <span className="text-sm text-gray-500">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center py-4">コメントはまだありません</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;