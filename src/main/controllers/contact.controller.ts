import { Request, Response, NextFunction } from 'express';
import {
  CreateContactUseCase,
  DeleteContactUseCase,
  GetContactWithWeatherUseCase,
  ListContactUseCase,
  UpdateContactUseCase,
} from '@/usecases';
import {
  createContactSchema,
  listFiltersSchema,
  updateContactSchema,
} from './validations';
import { BadRequest } from '@/errors';

export class ContactController {
  constructor(
    private readonly createContactUseCase: CreateContactUseCase,
    private readonly listContactUseCase: ListContactUseCase,
    private readonly getContactWithWeatherUseCase: GetContactWithWeatherUseCase,
    private readonly updateContactUseCase: UpdateContactUseCase,
    private readonly deleteContactUseCase: DeleteContactUseCase
  ) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { error, value } = createContactSchema.validate(req.body, {
        abortEarly: false,
      });
      if (error)
        throw BadRequest(
          'Validation error',
          error.details.map((d) => d.message)
        );

      const contact = await this.createContactUseCase.execute(value);
      res.status(201).json(contact);
    } catch (err) {
      next(err);
    }
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { error, value } = listFiltersSchema.validate(req.query, {
        abortEarly: false,
      });
      if (error) throw BadRequest('Validation error', error.details);

      const contacts = await this.listContactUseCase.execute(value);
      res.json(contacts);
    } catch (err) {
      next(err);
    }
  }

  async show(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) throw BadRequest('Invalid id');
      const data = await this.getContactWithWeatherUseCase.execute(id);
      res.json(data);
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) throw BadRequest('Invalid id');
      const { error, value } = updateContactSchema.validate(req.body, {
        abortEarly: false,
      });
      if (error) throw BadRequest('Validation error', error.details);

      const contact = await this.updateContactUseCase.execute(id, value);
      res.json(contact);
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) throw BadRequest('Invalid id');
      await this.deleteContactUseCase.execute(id);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }
}
