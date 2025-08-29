import { WhereOptions, Op, Includeable } from 'sequelize';
import { Phone, Contact, IContactRepository } from '../structs';

export class ContactRepository implements IContactRepository {
  async create(data: {
    name: string;
    address: string;
    email: string;
    phones: string[];
  }) {
    const uniquePhones = Array.from(new Set(data.phones));
    if (uniquePhones.length !== data.phones.length) {
      throw new Error('Phone numbers must be unique');
    }
    const contact = await Contact.create(
      {
        name: data.name,
        address: data.address,
        email: data.email,
      },
      { include: [{ model: Phone, as: 'phones' }] }
    );
    const phones = await Promise.all(
      uniquePhones.map((phone) =>
        Phone.create({ number: phone, contactId: contact.id })
      )
    );
    return { contact, phones };
  }

  async list(filters?: {
    name?: string;
    address?: string;
    email?: string;
    phone?: string;
  }) {
    const where: WhereOptions = {};
    if (filters?.name) where['name'] = { [Op.like]: `%${filters.name}%` };
    if (filters?.address)
      where['address'] = { [Op.like]: `%${filters.address}%` };
    if (filters?.email) where['email'] = { [Op.like]: `%${filters.email}%` };

    const include: Includeable[] = [
      {
        model: Phone,
        as: 'phones',
        where: filters?.phone
          ? { number: { [Op.like]: `%${filters.phone}%` } }
          : undefined,
        required: false,
      },
    ];

    const contacts = await Contact.findAll({
      where,
      include,
      order: [['name', 'ASC']],
    });

    return contacts;
  }
}
