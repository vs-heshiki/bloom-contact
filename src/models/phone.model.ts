import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/infra/database';

type PhoneAttributes = {
  id: number;
  number: string;
  contactId: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
};

type PhoneCreation = Optional<PhoneAttributes, 'id'>;

class Phone
  extends Model<PhoneAttributes, PhoneCreation>
  implements PhoneAttributes
{
  public id!: number;
  public number!: string;
  public contactId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;
}

Phone.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    number: { type: DataTypes.STRING(30), allowNull: false },
    contactId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  {
    tableName: 'phones',
    sequelize,
    paranoid: true,
    indexes: [{ unique: true, fields: ['contactId', 'number'] }],
  }
);

export default Phone;
export type { PhoneAttributes, PhoneCreation };
