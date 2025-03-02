import { Request, Response } from 'express';
import { Business } from '../models/Business';
import { User } from '../models/User';

// ビジネス情報を取得
export const getBusinessInfo = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: '認証が必要です' });
    }

    const business = await Business.findByPk(req.user.businessId);
    if (!business) {
      return res.status(404).json({ message: '会社情報が見つかりません' });
    }

    res.json({
      id: business.id,
      name: business.name,
      businessCode: business.businessCode,
      createdAt: business.createdAt
    });
  } catch (error) {
    console.error('Get business info error:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
};

// ビジネス情報を更新
export const updateBusinessInfo = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: '認証が必要です' });
    }

    const { name } = req.body;

    // ユーザーが管理者かどうか確認
    const user = await User.findByPk(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: '権限がありません' });
    }

    const business = await Business.findByPk(req.user.businessId);
    if (!business) {
      return res.status(404).json({ message: '会社情報が見つかりません' });
    }

    // ビジネス情報を更新
    await business.update({ name });

    res.json({
      id: business.id,
      name: business.name,
      businessCode: business.businessCode,
      createdAt: business.createdAt
    });
  } catch (error) {
    console.error('Update business info error:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
};