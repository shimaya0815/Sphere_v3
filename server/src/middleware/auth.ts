import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

// リクエストにユーザー情報を追加する型定義
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        businessId: string;
        role: string;
      };
    }
  }
}

// 認証ミドルウェア
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Authorizationヘッダーからトークンを取得
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: '認証が必要です' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: '認証トークンが必要です' });
    }

    // トークンを検証
    const decoded = verifyToken(token);
    
    // リクエストにユーザー情報を追加
    req.user = {
      id: decoded.id,
      email: decoded.email,
      businessId: decoded.businessId,
      role: decoded.role
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: '認証に失敗しました' });
  }
};

// 管理者権限を持つユーザーのみアクセスを許可するミドルウェア
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: '認証が必要です' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: '権限がありません' });
  }

  next();
};

// 管理者またはマネージャー権限を持つユーザーのみアクセスを許可するミドルウェア
export const requireManager = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: '認証が必要です' });
  }

  if (req.user.role !== 'admin' && req.user.role !== 'manager') {
    return res.status(403).json({ message: '権限がありません' });
  }

  next();
};