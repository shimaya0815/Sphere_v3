import { FC } from 'react';
import { Link } from 'react-router-dom';

const NotFound: FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">ページが見つかりません</h2>
        <p className="text-lg text-gray-600 mb-8">
          お探しのページは存在しないか、移動または削除された可能性があります。
        </p>
        <Link
          to="/"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          ホームに戻る
        </Link>
      </div>
    </div>
  );
};

export default NotFound;