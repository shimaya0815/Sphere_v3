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
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  declare name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    field: 'business_code'
  })
  declare businessCode: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'owner_id'
  })
  declare ownerId: string;

  @HasMany(() => User)
  declare users: User[];

  // ビジネスコードを自動生成
  @BeforeCreate
  static generateBusinessCodeIfNotSet(instance: Business) {
    if (!instance.businessCode) {
      instance.businessCode = generateBusinessCode();
    }
  }
}