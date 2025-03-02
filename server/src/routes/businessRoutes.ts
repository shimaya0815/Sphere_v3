import express from 'express';
import { getBusinessInfo, updateBusinessInfo } from '../controllers/businessController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = express.Router();

// すべてのルートに認証ミドルウェアを適用
router.use(authenticate);

// ビジネス情報を取得
router.get('/', getBusinessInfo);

// ビジネス情報を更新（管理者のみ）
router.put('/', requireAdmin, updateBusinessInfo);

export default router;