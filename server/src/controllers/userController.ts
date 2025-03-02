import { Request, Response } from 'express';
import { User } from '../models/User';
import { Business } from '../models/Business';
import { Invitation } from '../models/Invitation';
import sequelize from '../config/database';

// ビジネス内のユーザー一覧を取得
export const getBusinessUsers = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: '認証が必要です' });
    }

    const users = await User.findAll({
      where: { businessId: req.user.businessId },
      attributes: ['id', 'username', 'email', 'role', 'createdAt', 'updatedAt']
    });

    res.json(users);
  } catch (error) {
    console.error('Get business users error:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
};

// ユーザーの権限を更新
export const updateUserRole = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: '認証が必要です' });
    }

    // 管理者権限があるか確認
    const currentUser = await User.findByPk(req.user.id);
    if (!currentUser || currentUser.role !== 'admin') {
      return res.status(403).json({ message: '権限がありません' });
    }

    const { userId } = req.params;
    const { role } = req.body;

    // 変更対象のユーザーが同じビジネスに所属しているか確認
    const targetUser = await User.findOne({
      where: { 
        id: userId,
        businessId: req.user.businessId
      }
    });

    if (!targetUser) {
      return res.status(404).json({ message: 'ユーザーが見つかりません' });
    }

    // ビジネスオーナーの権限は変更できない
    const business = await Business.findByPk(targetUser.businessId);
    if (business && business.ownerId === targetUser.id) {
      return res.status(403).json({ message: 'ビジネスオーナーの権限は変更できません' });
    }

    // ユーザーの権限を更新
    await targetUser.update({ role });

    res.json({
      id: targetUser.id,
      username: targetUser.username,
      email: targetUser.email,
      role: targetUser.role,
      createdAt: targetUser.createdAt,
      updatedAt: targetUser.updatedAt
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
};

// ユーザーを削除
export const removeUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: '認証が必要です' });
    }

    // 管理者権限があるか確認
    const currentUser = await User.findByPk(req.user.id);
    if (!currentUser || currentUser.role !== 'admin') {
      return res.status(403).json({ message: '権限がありません' });
    }

    const { userId } = req.params;

    // 変更対象のユーザーが同じビジネスに所属しているか確認
    const targetUser = await User.findOne({
      where: { 
        id: userId,
        businessId: req.user.businessId
      }
    });

    if (!targetUser) {
      return res.status(404).json({ message: 'ユーザーが見つかりません' });
    }

    // 自分自身は削除できない
    if (targetUser.id === req.user.id) {
      return res.status(403).json({ message: '自分自身を削除することはできません' });
    }

    // ビジネスオーナーは削除できない
    const business = await Business.findByPk(targetUser.businessId);
    if (business && business.ownerId === targetUser.id) {
      return res.status(403).json({ message: 'ビジネスオーナーを削除することはできません' });
    }

    // ユーザーを削除
    await targetUser.destroy();

    res.json({ message: 'ユーザーを削除しました' });
  } catch (error) {
    console.error('Remove user error:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
};

// 新しいユーザーを招待
export const inviteUser = async (req: Request, res: Response) => {
  const t = await sequelize.transaction();

  try {
    if (!req.user) {
      await t.rollback();
      return res.status(401).json({ message: '認証が必要です' });
    }

    // 管理者権限があるか確認
    const currentUser = await User.findByPk(req.user.id, { transaction: t });
    if (!currentUser || currentUser.role !== 'admin') {
      await t.rollback();
      return res.status(403).json({ message: '権限がありません' });
    }

    const { email, role } = req.body;

    // 同じメールアドレスのユーザーが既に存在するか確認
    const existingUser = await User.findOne({ 
      where: { email },
      transaction: t
    });
    
    if (existingUser) {
      await t.rollback();
      return res.status(400).json({ message: 'このメールアドレスは既に使用されています' });
    }

    // 同じメールアドレスの招待が既に存在するか確認
    const existingInvitation = await Invitation.findOne({
      where: {
        email,
        businessId: req.user.businessId,
        used: false
      },
      transaction: t
    });

    // 既存の招待があれば、それを使用
    let invitation;
    if (existingInvitation && existingInvitation.isValid()) {
      invitation = existingInvitation;
      await invitation.update({ role }, { transaction: t });
    } else {
      // 新しい招待を作成
      invitation = await Invitation.create({
        email,
        role,
        businessId: req.user.businessId
      }, { transaction: t });
    }

    await t.commit();

    res.status(201).json({
      id: invitation.id,
      email: invitation.email,
      role: invitation.role,
      invitationCode: invitation.invitationCode,
      expiresAt: invitation.expiresAt
    });
  } catch (error) {
    await t.rollback();
    console.error('Invite user error:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
};