import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PROJECT_NAME: Joi.string().required(),
  PROJECT_PORT: Joi.number().default(3000),
  // PUBG API
  PUBG_API_URL: Joi.string().required(),
  PUBG_API_KEY: Joi.string().required(),
  PUBG_TELEMETRY_API_URL: Joi.string().required(),
  // CORS
  CORS_ORIGIN: Joi.string().required(),
  CORS_METHODS: Joi.string().required(),
  CORS_ALLOWED_HEADERS: Joi.string().required(),
});
