import jwt from 'jsonwebtoken';
import { User } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'sphere_secret_key_change_in_production';
const TOKEN_EXPIRES_IN = '24h';

interface TokenPayload {
  id: string;
  email: string;
  businessId: string;
  role: string;
}

// JWTトークンを生成する関数
export const generateToken = (user: User): string => {
  const payload: TokenPayload = {
    id: user.id,
    email: user.email,
    businessId: user.businessId,
    role: user.role
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN });
};

// JWTトークンを検証する関数
export const verifyToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    throw new Error('Invalid token');
  }
};