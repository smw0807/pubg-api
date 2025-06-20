import * as Joi from 'joi';

export const validationSchema = Joi.object({
  PORT: Joi.number().default(3000),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PUBG_API_URL: Joi.string().required(),
  PUBG_API_KEY: Joi.string().required(),
});
