import { registerAs } from '@nestjs/config';

export default registerAs('cors', () => ({
  origin: process.env.CORS_ORIGIN,
  methods: process.env.CORS_METHODS,
  allowedHeaders: process.env.CORS_ALLOWED_HEADERS,
}));
