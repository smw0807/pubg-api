import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  projectName: process.env.PROJECT_NAME,
  port: process.env.PORT,
}));
