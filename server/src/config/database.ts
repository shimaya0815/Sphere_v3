import { Sequelize } from 'sequelize-typescript';
import path from 'path';
import dotenv from 'dotenv';

// 環境変数の読み込み
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// データベース接続情報
const databaseUrl = process.env.DATABASE_URL || 'postgres://postgres:postgres@db:5432/sphere';

// Sequelizeインスタンスの作成
const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  models: [path.join(__dirname, '../models')],
  logging: process.env.NODE_ENV !== 'production',
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' ? { require: true, rejectUnauthorized: false } : false
  },
  define: {
    timestamps: true,
    underscored: true
  }
});

// モデルの関連付けを定義する関数
export const initializeAssociations = () => {
  const models = sequelize.models;
  Object.keys(models).forEach(modelName => {
    if ('associate' in models[modelName]) {
      // @ts-ignore
      models[modelName].associate(models);
    }
  });
};

// データベース接続を初期化する関数
export const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // 開発環境の場合、テーブルを同期（必要に応じて作成・更新）
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('Database tables synchronized.');
    }
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
};

export default sequelize;