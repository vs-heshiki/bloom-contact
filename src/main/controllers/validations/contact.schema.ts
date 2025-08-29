import Joi from 'joi';

export const phoneSchema = Joi.string().trim().min(6).max(30);

export const createContactSchema = Joi.object({
  name: Joi.string().trim().min(2).max(120).required(),
  address: Joi.string().trim().min(2).max(255).required(),
  email: Joi.string().trim().email().required(),
  phones: Joi.array().items(phoneSchema).min(1).required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().trim().min(2).max(120),
  address: Joi.string().trim().min(2).max(255),
  email: Joi.string().trim().email(),
  phones: Joi.array().items(phoneSchema).min(1),
}).min(1);

export const listFiltersSchema = Joi.object({
  name: Joi.string().trim(),
  address: Joi.string().trim(),
  email: Joi.string().trim(),
  phone: Joi.string().trim(),
});
