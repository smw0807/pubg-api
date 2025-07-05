import { registerAs } from '@nestjs/config';

export default registerAs('pubg', () => ({
  apiUrl: process.env.PUBG_API_URL,
  apiKey: process.env.PUBG_API_KEY,
  telemetryApiUrl: process.env.PUBG_TELEMETRY_API_URL,
}));
