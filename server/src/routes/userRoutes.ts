import express from 'express';
import { getBusinessUsers, updateUserRole, removeUser, inviteUser } from '../controllers/userController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = express.Router();

// すべてのルートに認証ミドルウェアを適用
router.use(authenticate);

// ビジネス内のユーザー一覧を取得
router.get('/', getBusinessUsers);

// 新しいユーザーを招待（管理者のみ）
router.post('/invite', requireAdmin, inviteUser);

// ユーザーの権限を更新（管理者のみ）
router.put('/:userId/role', requireAdmin, updateUserRole);

// ユーザーを削除（管理者のみ）
router.delete('/:userId', requireAdmin, removeUser);

export default router;