import { FC } from 'react';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiClock, FiUsers, FiMessageSquare, FiFileText } from 'react-icons/fi';

const Home: FC = () => {
  // 機能セクションのデータ
  const features = [
    {
      icon: <FiCheckCircle className="h-12 w-12 text-blue-600" />,
      title: 'タスク管理',
      description: 'タスクの作成、割り当て、進捗管理、ドラッグ＆ドロップでの並び替えなど、効率的なタスク管理を実現します。',
    },
    {
      icon: <FiUsers className="h-12 w-12 text-blue-600" />,
      title: 'クライアント管理',
      description: 'クライアント情報の一元管理、契約管理、決算期設定など、クライアントとの業務を円滑に進めるための機能を提供します。',
    },
    {
      icon: <FiClock className="h-12 w-12 text-blue-600" />,
      title: '時間管理',
      description: 'タスクの作業時間の記録、自動集計、レポート作成など、作業時間の可視化と分析を支援します。',
    },
    {
      icon: <FiMessageSquare className="h-12 w-12 text-blue-600" />,
      title: 'チャット',
      description: 'チーム内でのリアルタイムコミュニケーション、メンション機能、ファイル共有など、円滑なコミュニケーションをサポートします。',
    },
    {
      icon: <FiFileText className="h-12 w-12 text-blue-600" />,
      title: 'Wiki',
      description: 'ナレッジの蓄積と共有、バージョン管理、検索機能など、チームの知識を効率的に管理します。',
    },
  ];

  return (
    <div className="container mx-auto">
      {/* ヒーローセクション */}
      <div className="flex flex-col md:flex-row items-center justify-between py-12 md:py-20">
        <div className="md:w-1/2 md:pr-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            事業所の業務を効率化する<br />総合プラットフォーム
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Sphereは、タスク管理、クライアント管理、時間管理、コミュニケーションを一元化し、
            業務の効率化と透明性を高めます。
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/signup"
              className="btn btn-primary px-8 py-3"
            >
              無料で始める
            </Link>
            <Link
              to="/login"
              className="btn btn-outline border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3"
            >
              ログイン
            </Link>
          </div>
        </div>
        <div className="md:w-1/2 mt-12 md:mt-0">
          <img
            src="https://via.placeholder.com/600x400?text=Sphere+Dashboard"
            alt="Sphere Dashboard"
            className="rounded-lg shadow-xl"
          />
        </div>
      </div>

      {/* 機能セクション */}
      <div className="py-16 bg-gray-50 rounded-xl my-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Sphereの主要機能
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            事業所の業務を効率化するための包括的な機能を提供します
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTAセクション */}
      <div className="bg-blue-600 text-white py-16 rounded-xl mb-16 text-center">
        <h2 className="text-3xl font-bold mb-6">
          今すぐSphereで業務効率化を始めましょう
        </h2>
        <p className="text-xl mb-8 max-w-3xl mx-auto">
          無料トライアルで、Sphereがあなたの事業所にもたらす価値を体験してください。
        </p>
        <Link
          to="/signup"
          className="btn bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg"
        >
          無料で試してみる
        </Link>
      </div>
    </div>
  );
};

export default Home;