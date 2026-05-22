import { registerAs } from '@nestjs/config';
export default registerAs('app', () => ({
  env: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '4000', 10),
  storefrontUrl: process.env.STOREFRONT_URL ?? 'http://localhost:3000',
  adminUrl: process.env.ADMIN_URL ?? 'http://localhost:3001',
}));
