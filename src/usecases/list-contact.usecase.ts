import { IContactRepository } from '../infra/structs';

export class ListContactUseCase {
  constructor(private readonly contactRepository: IContactRepository) {}
  async execute(filters: {
    name?: string;
    address?: string;
    email?: string;
    phone?: string;
  }) {
    return this.contactRepository.list(filters);
  }
}
