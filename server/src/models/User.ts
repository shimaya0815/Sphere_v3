import { Table, Column, Model, DataType, ForeignKey, BelongsTo, BeforeCreate, BeforeUpdate } from 'sequelize-typescript';
import { Business } from './Business';
import bcrypt from 'bcryptjs';

@Table({
  tableName: 'users'
})
export class User extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true
  })
  id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  username!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  password!: string;

  @Column({
    type: DataType.ENUM('admin', 'manager', 'user'),
    allowNull: false,
    defaultValue: 'user'
  })
  role!: 'admin' | 'manager' | 'user';

  @ForeignKey(() => Business)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'business_id'
  })
  businessId!: string;

  @BelongsTo(() => Business)
  business!: Business;

  // パスワードのハッシュ化
  @BeforeCreate
  @BeforeUpdate
  static async hashPassword(instance: User) {
    // パスワードが変更された場合のみハッシュ化
    if (instance.changed('password')) {
      const salt = await bcrypt.genSalt(10);
      instance.password = await bcrypt.hash(instance.password, salt);
    }
  }

  // パスワード検証メソッド
  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}