import { Request, Response, NextFunction } from 'express';
import { CreateContactUseCase, ListContactUseCase } from '@/usecases';
import { createContactSchema, listFiltersSchema } from './validations';
import { BadRequest } from '@/errors';

export class ContactController {
  constructor(
    private readonly createContactUseCase: CreateContactUseCase,
    private readonly listContactUseCase: ListContactUseCase
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
}
