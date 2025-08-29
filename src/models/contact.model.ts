import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/infra/database';
import Phone from './phone.model';

type ContactAttributes = {
  id: number;
  name: string;
  address: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
};

type ContactCreation = Optional<ContactAttributes, 'id'>;

class Contact
  extends Model<ContactAttributes, ContactCreation>
  implements ContactAttributes
{
  public id!: number;
  public name!: string;
  public address!: string;
  public email!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;
}

Contact.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING(120), allowNull: false },
    address: { type: DataTypes.STRING(255), allowNull: false },
    email: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: { isEmail: true },
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  {
    tableName: 'contacts',
    sequelize,
    paranoid: true,
  }
);

Contact.hasMany(Phone, {
  as: 'phones',
  foreignKey: 'contactId',
  onDelete: 'CASCADE',
});
Phone.belongsTo(Contact, { foreignKey: 'contactId', as: 'contact' });

export default Contact;
export type { ContactAttributes, ContactCreation };
