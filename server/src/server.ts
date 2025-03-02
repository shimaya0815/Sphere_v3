import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { initializeDatabase, initializeAssociations } from './config/database';

// ルーターのインポート
import authRoutes from './routes/authRoutes';
import businessRoutes from './routes/businessRoutes';
import userRoutes from './routes/userRoutes';

// 環境変数の読み込み
dotenv.config();

// Expressアプリケーションの作成
const app = express();
const PORT = process.env.PORT || 4000;

// ミドルウェアの設定
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// ルートの設定
app.use('/api/auth', authRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/users', userRoutes);

// ヘルスチェックエンドポイント
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', environment: process.env.NODE_ENV });
});

// サーバーの起動
const startServer = async () => {
  try {
    // データベースの初期化
    initializeAssociations();
    await initializeDatabase();
    
    // サーバーの起動
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();