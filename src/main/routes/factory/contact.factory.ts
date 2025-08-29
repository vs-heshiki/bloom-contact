import { ContactController } from '@/main/controllers/contact.controller';
import { ContactRepository } from '@/infra/repositories';
import { CreateContactUseCase, ListContactUseCase } from '@/usecases';

export function makeContactController() {
  const repository = new ContactRepository();
  const createContact = new CreateContactUseCase(repository);
  const listContact = new ListContactUseCase(repository);
  return new ContactController(createContact, listContact);
}
