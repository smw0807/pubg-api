import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PROJECT_NAME: Joi.string().required(),
  PROJECT_PORT: Joi.number().default(3000),
  PUBG_API_URL: Joi.string().required(),
  PUBG_API_KEY: Joi.string().required(),
});
