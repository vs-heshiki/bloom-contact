import { ContactController } from '@/controllers/contact.controller';
import { ContactRepository } from '@/infra/repositories';
import { CreateContactUseCase } from '@/usecases';

export function makeContactController() {
  const repository = new ContactRepository();
  const createContact = new CreateContactUseCase(repository);
  return new ContactController(createContact);
}
