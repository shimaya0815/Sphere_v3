import { Request, Response } from 'express';
import { User } from '../models/User';
import { Business } from '../models/Business';
import { Invitation } from '../models/Invitation';
import { generateToken } from '../utils/jwt';
import { generateBusinessCode } from '../utils/codeGenerator';
import sequelize from '../config/database';

// ログイン
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password, businessCode } = req.body;

    // ビジネスコードからビジネスを検索
    const business = await Business.findOne({ where: { businessCode } });
    if (!business) {
      return res.status(401).json({ message: 'ビジネスコードが無効です' });
    }

    // メールアドレスからユーザーを検索
    const user = await User.findOne({
      where: { 
        email,
        businessId: business.id
      }
    });

    if (!user) {
      return res.status(401).json({ message: 'メールアドレスまたはパスワードが無効です' });
    }

    // パスワードを検証
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'メールアドレスまたはパスワードが無効です' });
    }

    // JWTトークンを生成
    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        businessId: user.businessId,
        role: user.role
      },
      business: {
        id: business.id,
        name: business.name,
        businessCode: business.businessCode,
        createdAt: business.createdAt
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
};

// 新規ビジネス作成とユーザー登録
export const createBusinessWithUser = async (req: Request, res: Response) => {
  const t = await sequelize.transaction();

  try {
    const { businessName, email, password, username } = req.body;

    // 同じメールアドレスのユーザーが既に存在するか確認
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      await t.rollback();
      return res.status(400).json({ message: 'このメールアドレスは既に使用されています' });
    }

    // ビジネスコードを生成
    const businessCode = generateBusinessCode();

    // ビジネスを作成
    const business = await Business.create({
      name: businessName,
      businessCode,
      ownerId: 'temp' // 一時的な値（ユーザー作成後に更新）
    }, { transaction: t });

    // ユーザーを作成
    const user = await User.create({
      username,
      email,
      password,
      role: 'admin', // 最初のユーザーは管理者
      businessId: business.id
    }, { transaction: t });

    // ビジネスのオーナーIDを更新
    await business.update({ ownerId: user.id }, { transaction: t });

    // トランザクションをコミット
    await t.commit();

    // JWTトークンを生成
    const token = generateToken(user);

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        businessId: business.id,
        role: user.role
      },
      business: {
        id: business.id,
        name: business.name,
        businessCode: business.businessCode,
        createdAt: business.createdAt
      }
    });
  } catch (error) {
    // エラー時はトランザクションをロールバック
    await t.rollback();
    console.error('Create business error:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
};

// 招待からのサインアップ
export const signupWithInvitation = async (req: Request, res: Response) => {
  const t = await sequelize.transaction();

  try {
    const { email, password, username, businessCode, invitationCode } = req.body;

    // ビジネスコードからビジネスを検索
    const business = await Business.findOne({ 
      where: { businessCode },
      transaction: t
    });
    
    if (!business) {
      await t.rollback();
      return res.status(400).json({ message: 'ビジネスコードが無効です' });
    }

    // 招待コードから招待を検索
    const invitation = await Invitation.findOne({
      where: {
        invitationCode,
        businessId: business.id,
        used: false
      },
      transaction: t
    });

    if (!invitation || !invitation.isValid()) {
      await t.rollback();
      return res.status(400).json({ message: '招待コードが無効または期限切れです' });
    }

    // 招待されたメールアドレスと一致するか確認
    if (invitation.email.toLowerCase() !== email.toLowerCase()) {
      await t.rollback();
      return res.status(400).json({ message: '招待されたメールアドレスと一致しません' });
    }

    // 同じメールアドレスのユーザーが既に存在するか確認
    const existingUser = await User.findOne({ 
      where: { email },
      transaction: t
    });
    
    if (existingUser) {
      await t.rollback();
      return res.status(400).json({ message: 'このメールアドレスは既に使用されています' });
    }

    // ユーザーを作成
    const user = await User.create({
      username,
      email,
      password,
      role: invitation.role,
      businessId: business.id
    }, { transaction: t });

    // 招待を使用済みに更新
    await invitation.update({ used: true }, { transaction: t });

    // トランザクションをコミット
    await t.commit();

    // JWTトークンを生成
    const token = generateToken(user);

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        businessId: business.id,
        role: user.role
      },
      business: {
        id: business.id,
        name: business.name,
        businessCode: business.businessCode,
        createdAt: business.createdAt
      }
    });
  } catch (error) {
    // エラー時はトランザクションをロールバック
    await t.rollback();
    console.error('Signup error:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
};