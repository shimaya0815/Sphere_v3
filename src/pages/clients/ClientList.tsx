import { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiSearch, FiFilter, FiUser, FiCalendar, FiFile, FiEdit, FiEye } from 'react-icons/fi';

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
  },
  {
    id: 3,
    name: '有限会社DEF',
    industry: '小売業',
    address: '福岡市博多区3-3-3',
    contactPerson: '鈴木一郎',
    email: 'suzuki@def.co.jp',
    phone: '092-555-1111',
    status: 'inactive',
    fiscalYearEnd: '09-30',
    createdAt: '2022-11-20T13:45:00',
    updatedAt: '2023-03-15T16:20:00',
  },
  {
    id: 4,
    name: '合同会社GHI',
    industry: 'サービス業',
    address: '名古屋市中区4-4-4',
    contactPerson: '田中誠',
    email: 'tanaka@ghi.co.jp',
    phone: '052-222-3333',
    status: 'active',
    fiscalYearEnd: '06-30',
    createdAt: '2023-03-05T09:30:00',
    updatedAt: '2023-05-10T10:00:00',
  },
  {
    id: 5,
    name: '株式会社JKL',
    industry: '建設業',
    address: '札幌市中央区5-5-5',
    contactPerson: '伊藤健太',
    email: 'ito@jkl.co.jp',
    phone: '011-444-5555',
    status: 'active',
    fiscalYearEnd: '03-31',
    createdAt: '2022-12-01T11:15:00',
    updatedAt: '2023-04-25T15:30:00',
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

const ClientList: FC = () => {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterIndustry, setFilterIndustry] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterFiscalYear, setFilterFiscalYear] = useState<string>('');

  // フィルタリングされたクライアントを取得
  const getFilteredClients = () => {
    return clients.filter((client) => {
      // 検索クエリでフィルタリング
      const matchesSearch =
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase());

      // 業種でフィルタリング
      const matchesIndustry = filterIndustry ? client.industry === filterIndustry : true;

      // ステータスでフィルタリング
      const matchesStatus = filterStatus ? client.status === filterStatus : true;

      // 決算期でフィルタリング
      const matchesFiscalYear = filterFiscalYear 
        ? client.fiscalYearEnd.startsWith(filterFiscalYear.padStart(2, '0'))
        : true;

      return matchesSearch && matchesIndustry && matchesStatus && matchesFiscalYear;
    });
  };

  // フィルタリングされたクライアントを取得
  const filteredClients = getFilteredClients();

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

  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">クライアント管理</h1>
          <p className="text-gray-600">
            クライアント情報の一覧と管理
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link to="/clients/new" className="btn btn-primary flex items-center">
            <FiPlus className="mr-2" />
            クライアントを追加
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
              placeholder="クライアントを検索..."
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
            {(filterIndustry || filterStatus || filterFiscalYear) && (
              <span className="ml-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {(filterIndustry ? 1 : 0) + (filterStatus ? 1 : 0) + (filterFiscalYear ? 1 : 0)}
              </span>
            )}
          </button>
        </div>

        {/* フィルターパネル */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 業種フィルター */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FiUser className="mr-2" />
                  業種
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filterIndustry}
                  onChange={(e) => setFilterIndustry(e.target.value)}
                >
                  <option value="">すべて</option>
                  {industryOptions.map((industry) => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>
              </div>

              {/* ステータスフィルター */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FiFile className="mr-2" />
                  ステータス
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="">すべて</option>
                  <option value="active">有効</option>
                  <option value="inactive">無効</option>
                </select>
              </div>

              {/* 決算期フィルター */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FiCalendar className="mr-2" />
                  決算月
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filterFiscalYear}
                  onChange={(e) => setFilterFiscalYear(e.target.value)}
                >
                  <option value="">すべて</option>
                  <option value="01">1月</option>
                  <option value="02">2月</option>
                  <option value="03">3月</option>
                  <option value="04">4月</option>
                  <option value="05">5月</option>
                  <option value="06">6月</option>
                  <option value="07">7月</option>
                  <option value="08">8月</option>
                  <option value="09">9月</option>
                  <option value="10">10月</option>
                  <option value="11">11月</option>
                  <option value="12">12月</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 mr-2"
                onClick={() => {
                  setFilterIndustry('');
                  setFilterStatus('');
                  setFilterFiscalYear('');
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

      {/* クライアント一覧 */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  クライアント名
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  業種
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  担当者
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  決算期
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ステータス
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  最終更新日
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  アクション
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{client.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{client.industry}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{client.contactPerson}</div>
                    <div className="text-sm text-gray-500">{client.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{formatFiscalYearEnd(client.fiscalYearEnd)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      client.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {client.status === 'active' ? '有効' : '無効'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(client.updatedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link 
                        to={`/clients/${client.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <FiEye />
                      </Link>
                      <Link 
                        to={`/clients/${client.id}/edit`}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <FiEdit />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredClients.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">クライアントが見つかりませんでした</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientList;