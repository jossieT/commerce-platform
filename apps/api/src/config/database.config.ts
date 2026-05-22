import { registerAs } from '@nestjs/config';
export default registerAs('database', () => ({
  postgres: {
    host: process.env.PG_HOST ?? 'localhost',
    port: parseInt(process.env.PG_PORT ?? '5432', 10),
    username: process.env.PG_USER ?? 'postgres',
    password: process.env.PG_PASSWORD ?? 'postgres',
    name: process.env.PG_DB ?? 'ecommerce',
  },
  mongo: { uri: process.env.MONGO_URI ?? 'mongodb://localhost:27017/ecommerce' },
  redis: {
    host: process.env.REDIS_HOST ?? 'localhost',
    port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
    password: process.env.REDIS_PASSWORD,
  },
}));
