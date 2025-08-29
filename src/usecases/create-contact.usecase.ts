import { IContactRepository } from '../infra/structs';

export class CreateContactUseCase {
  constructor(private readonly contactRepository: IContactRepository) {}
  async execute(input: {
    name: string;
    address: string;
    email: string;
    phones: string[];
  }) {
    return this.contactRepository.create(input);
  }
}
