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
}
