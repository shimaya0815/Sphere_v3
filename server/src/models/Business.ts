import { Table, Column, Model, DataType, HasMany, BeforeCreate } from 'sequelize-typescript';
import { User } from './User';
import { generateBusinessCode } from '../utils/codeGenerator';

@Table({
  tableName: 'businesses'
})
export class Business extends Model {
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
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    field: 'business_code'
  })
  businessCode!: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'owner_id'
  })
  ownerId!: string;

  @HasMany(() => User)
  users!: User[];

  // ビジネスコードを自動生成
  @BeforeCreate
  static generateBusinessCodeIfNotSet(instance: Business) {
    if (!instance.businessCode) {
      instance.businessCode = generateBusinessCode();
    }
  }
}