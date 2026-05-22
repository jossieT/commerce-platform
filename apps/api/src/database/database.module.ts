import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    // PostgreSQL — transactional data
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('database.postgres.host'),
        port: config.get('database.postgres.port'),
        username: config.get('database.postgres.username'),
        password: config.get('database.postgres.password'),
        database: config.get('database.postgres.name'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
        synchronize: config.get('app.env') === 'development', // false in prod!
        logging: config.get('app.env') === 'development',
        autoLoadEntities: true,
      }),
    }),

    // MongoDB — product catalog, reviews, logs
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get('database.mongo.uri'),
      }),
    }),
  ],
})
export class DatabaseModule {}
