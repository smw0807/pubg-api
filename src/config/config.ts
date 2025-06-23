import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  projectName: process.env.PROJECT_NAME,
  projectPort: process.env.PROJECT_PORT,
}));
