import { FC } from 'react';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const LoadingSpinner: FC<LoadingSpinnerProps> = ({ 
  fullScreen = false, 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  // フルスクリーン表示の場合
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
        <div className="flex flex-col items-center">
          <div className={`animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 ${sizeClasses[size]}`}></div>
          <p className="mt-4 text-gray-700">読み込み中...</p>
        </div>
      </div>
    );
  }

  // インライン表示の場合
  return (
    <div className="flex items-center justify-center">
      <div className={`animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 ${sizeClasses[size]}`}></div>
    </div>
  );
};

export default LoadingSpinner;