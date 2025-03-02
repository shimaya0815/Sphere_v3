import { Table, Column, Model, DataType, ForeignKey, BelongsTo, BeforeCreate } from 'sequelize-typescript';
import { Business } from './Business';
import { generateInvitationCode } from '../utils/codeGenerator';

@Table({
  tableName: 'invitations'
})
export class Invitation extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    field: 'invitation_code'
  })
  declare invitationCode: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  })
  declare email: string;

  @Column({
    type: DataType.ENUM('admin', 'manager', 'user'),
    allowNull: false,
    defaultValue: 'user'
  })
  declare role: 'admin' | 'manager' | 'user';

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false
  })
  declare used: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'expires_at'
  })
  declare expiresAt: Date | null;

  @ForeignKey(() => Business)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'business_id'
  })
  declare businessId: string;

  @BelongsTo(() => Business)
  declare business: Business;

  // 招待コードを自動生成
  @BeforeCreate
  static generateInvitationCodeIfNotSet(instance: Invitation) {
    if (!instance.invitationCode) {
      instance.invitationCode = generateInvitationCode();
    }

    // 有効期限を設定（デフォルトは7日間）
    if (!instance.expiresAt) {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 7);
      instance.expiresAt = expirationDate;
    }
  }

  // 招待が有効かどうかを判定
  isValid(): boolean {
    if (this.used) {
      return false;
    }

    if (this.expiresAt && new Date() > this.expiresAt) {
      return false;
    }

    return true;
  }
}