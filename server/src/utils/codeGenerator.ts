/**
 * ビジネスコードを生成する関数
 * 形式: B + ランダムな英数字（大文字）6文字
 */
export const generateBusinessCode = (): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'B';
  
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return result;
};

/**
 * 招待コードを生成する関数
 * 形式: INV + ランダムな英数字（大文字）8文字
 */
export const generateInvitationCode = (): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'INV';
  
  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return result;
};