import { IContactRepository } from '../infra/structs';

export class DeleteContactUseCase {
  constructor(private readonly contactRepository: IContactRepository) {}
  async execute(id: number) {
    await this.contactRepository.delete(id);
  }
}
