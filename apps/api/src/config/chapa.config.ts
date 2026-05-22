import { registerAs } from '@nestjs/config';
export default registerAs('chapa', () => ({
  secretKey: process.env.CHAPA_SECRET_KEY ?? '',
  baseUrl: 'https://api.chapa.co/v1',
  webhookSecret: process.env.CHAPA_WEBHOOK_SECRET ?? '',
}));
