import express from 'express';
import { login, createBusinessWithUser, signupWithInvitation } from '../controllers/authController';

const router = express.Router();

// ログイン
router.post('/login', login);

// 新規ビジネス作成とサインアップ
router.post('/business/create', createBusinessWithUser);

// 招待からのサインアップ
router.post('/signup/invitation', signupWithInvitation);

export default router;