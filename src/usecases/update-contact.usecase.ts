import { IContactRepository } from '../infra/structs';

export class UpdateContactUseCase {
  constructor(private readonly contactRepository: IContactRepository) {}
  async execute(
    id: number,
    data: {
      name?: string;
      address?: string;
      email?: string;
      phone?: string;
    }
  ) {
    return this.contactRepository.update(id, data);
  }
}
