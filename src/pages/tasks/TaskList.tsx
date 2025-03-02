import { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { FiPlus, FiFilter, FiSearch, FiClock, FiUser, FiTag } from 'react-icons/fi';

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
const initialTasks: Task[] = [
  {
    id: 1,
    title: '法人税申告の準備',
    description: 'A社の法人税申告の資料の準備と確認',
    status: 'todo',
    priority: 'high',
    dueDate: '2023-06-30',
    assignee: '山田太郎',
    category: 'tax',
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
  },
  {
    id: 3,
    title: 'クライアントミーティング',
    description: 'C社との定例ミーティング',
    status: 'inProgress',
    priority: 'medium',
    dueDate: '2023-06-20',
    assignee: '山田太郎',
    category: 'meeting',
  },
  {
    id: 4,
    title: '決算資料の作成',
    description: 'D社の決算資料の作成と確認',
    status: 'inProgress',
    priority: 'high',
    dueDate: '2023-06-18',
    assignee: '田中花子',
    category: 'accounting',
  },
  {
    id: 5,
    title: '源泉徴収の確認',
    description: 'E社の源泉徴収の確認と修正',
    status: 'review',
    priority: 'low',
    dueDate: '2023-06-28',
    assignee: '鈴木一郎',
    category: 'tax',
  },
  {
    id: 6,
    title: '事務所の備品発注',
    description: '事務所で使用する備品の発注',
    status: 'done',
    priority: 'low',
    dueDate: '2023-06-15',
    assignee: '田中花子',
    category: 'admin',
  },
];

// カンバンボードのカラム定義
const columns = {
  todo: {
    id: 'todo',
    title: '未着手',
    color: 'bg-gray-100',
  },
  inProgress: {
    id: 'inProgress',
    title: '進行中',
    color: 'bg-blue-100',
  },
  review: {
    id: 'review',
    title: 'レビュー中',
    color: 'bg-yellow-100',
  },
  done: {
    id: 'done',
    title: '完了',
    color: 'bg-green-100',
  },
};

const TaskList: FC = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterPriority, setFilterPriority] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterAssignee, setFilterAssignee] = useState<string>('');

  // ドラッグ&ドロップの処理
  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // ドロップ先がない場合は何もしない
    if (!destination) {
      return;
    }

    // 同じ場所にドロップした場合は何もしない
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // タスクのステータスを更新
    const updatedTasks = tasks.map((task) => {
      if (task.id === parseInt(draggableId)) {
        return {
          ...task,
          status: destination.droppableId as 'todo' | 'inProgress' | 'review' | 'done',
        };
      }
      return task;
    });

    setTasks(updatedTasks);
  };

  // フィルタリングされたタスクを取得
  const getFilteredTasks = () => {
    return tasks.filter((task) => {
      // 検索クエリでフィルタリング
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          task.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // 優先度でフィルタリング
      const matchesPriority = filterPriority ? task.priority === filterPriority : true;
      
      // カテゴリーでフィルタリング
      const matchesCategory = filterCategory ? task.category === filterCategory : true;
      
      // 担当者でフィルタリング
      const matchesAssignee = filterAssignee ? task.assignee === filterAssignee : true;
      
      return matchesSearch && matchesPriority && matchesCategory && matchesAssignee;
    });
  };

  // フィルタリングされたタスクを取得
  const filteredTasks = getFilteredTasks();

  // 各カラムのタスクを取得
  const getTasksByStatus = (status: string) => {
    return filteredTasks.filter((task) => task.status === status);
  };

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

  // 担当者の一覧（重複なし）
  const assignees = Array.from(new Set(tasks.map((task) => task.assignee)));
  
  // カテゴリーの一覧（重複なし）
  const taskCategories = Array.from(new Set(tasks.map((task) => task.category).filter(Boolean) as string[]));

  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">タスク管理</h1>
          <p className="text-gray-600">
            タスクの進行状況をドラッグ＆ドロップで管理できます
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link to="/tasks/new" className="btn btn-primary flex items-center">
            <FiPlus className="mr-2" />
            タスクを追加
          </Link>
        </div>
      </div>

      {/* 検索とフィルター */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="タスクを検索..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FiFilter className="mr-2" />
            フィルター
            {(filterPriority || filterCategory || filterAssignee) && (
              <span className="ml-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {(filterPriority ? 1 : 0) + (filterCategory ? 1 : 0) + (filterAssignee ? 1 : 0)}
              </span>
            )}
          </button>
        </div>

        {/* フィルターパネル */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 優先度フィルター */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FiClock className="mr-2" />
                  優先度
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                >
                  <option value="">すべて</option>
                  <option value="high">高</option>
                  <option value="medium">中</option>
                  <option value="low">低</option>
                </select>
              </div>

              {/* カテゴリーフィルター */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FiTag className="mr-2" />
                  カテゴリー
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="">すべて</option>
                  {taskCategories.map((category) => (
                    <option key={category} value={category}>
                      {categories[category as keyof typeof categories]?.name || category}
                    </option>
                  ))}
                </select>
              </div>

              {/* 担当者フィルター */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FiUser className="mr-2" />
                  担当者
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filterAssignee}
                  onChange={(e) => setFilterAssignee(e.target.value)}
                >
                  <option value="">すべて</option>
                  {assignees.map((assignee) => (
                    <option key={assignee} value={assignee}>
                      {assignee}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 mr-2"
                onClick={() => {
                  setFilterPriority('');
                  setFilterCategory('');
                  setFilterAssignee('');
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

      {/* カンバンボード */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.values(columns).map((column) => (
            <div key={column.id} className={`bg-white rounded-lg shadow-md overflow-hidden`}>
              <div className={`p-4 ${column.color}`}>
                <h3 className="font-medium">
                  {column.title} ({getTasksByStatus(column.id).length})
                </h3>
              </div>
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="p-2 min-h-[200px]"
                  >
                    {getTasksByStatus(column.id).map((task, index) => (
                      <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white border border-gray-200 p-4 rounded-lg mb-2 shadow-sm hover:shadow-md transition-shadow"
                          >
                            <Link to={`/tasks/${task.id}`} className="block">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium text-gray-900">{task.title}</h4>
                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPriorityClass(task.priority)}`}>
                                  {getPriorityText(task.priority)}
                                </span>
                              </div>
                              <div className="text-sm text-gray-600 mb-3 line-clamp-2">
                                {task.description}
                              </div>
                              <div className="flex flex-wrap items-center justify-between text-xs">
                                <div className="flex items-center text-gray-500 mb-1 md:mb-0">
                                  <FiClock className="mr-1" />
                                  <span>{task.dueDate}</span>
                                </div>
                                <div className="flex items-center text-gray-500">
                                  <FiUser className="mr-1" />
                                  <span>{task.assignee}</span>
                                </div>
                              </div>
                              {task.category && (
                                <div className="mt-2">
                                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${categories[task.category as keyof typeof categories]?.color || 'bg-gray-100 text-gray-800'}`}>
                                    {categories[task.category as keyof typeof categories]?.name || task.category}
                                  </span>
                                </div>
                              )}
                            </Link>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default TaskList;