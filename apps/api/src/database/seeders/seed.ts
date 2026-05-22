import 'reflect-metadata';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { connect } from 'mongoose';
import { ProductsSeeder } from './products.seeder';

config();

async function runSeeders() {
  // Initialize TypeORM DataSource
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.PG_HOST || 'localhost',
    port: parseInt(process.env.PG_PORT || '5432', 10),
    username: process.env.PG_USER || 'postgres',
    password: process.env.PG_PASSWORD || 'postgres',
    database: process.env.PG_DB || 'ecommerce',
    entities: [
      'src/modules/**/entities/*.entity.ts',
      'src/common/entities/*.entity.ts',
    ],
    synchronize: true,
    logging: false,
  });

  // Initialize Mongoose
  const mongoUri = process.env.MONGO_URI || 'mongodb://mongo:mongo@localhost:27017/ecommerce?authSource=admin';

  try {
    // Connect TypeORM
    await dataSource.initialize();
    console.log('✅ TypeORM connected to PostgreSQL');

    // Connect Mongoose
    const mongoConnection = await connect(mongoUri);
    console.log('✅ Mongoose connected to MongoDB');

    // Define ProductMetadata schema for seeding
    const productMetadataSchema = new (require('mongoose').Schema)({
      productId: String,
      specifications: Object,
      customFields: Object,
      reviews: Array,
      relatedProductIds: Array,
      crossSellProductIds: Array,
      inventoryHistory: Array,
      socialProof: Object,
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now },
    });

    const metadataModel = mongoConnection.model('ProductMetadata', productMetadataSchema);

    // Run seeders
    const productsSeeder = new ProductsSeeder(dataSource, metadataModel as any);
    await productsSeeder.seed();

    console.log('✅ All seeders completed successfully!');

    // Close connections
    await dataSource.destroy();
    await mongoConnection.disconnect();
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

runSeeders();
