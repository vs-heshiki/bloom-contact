import { Request, Response, NextFunction } from 'express';
import { CreateContactUseCase } from '@/usecases';
import { createContactSchema } from './validations';
import { BadRequest } from '@/errors';

export class ContactController {
  constructor(private readonly createContactUseCase: CreateContactUseCase) {}

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
}
