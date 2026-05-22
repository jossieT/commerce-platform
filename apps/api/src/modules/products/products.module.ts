import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';

import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import {
  ProductEntity,
  ProductVariantEntity,
  ProductImageEntity,
  CategoryEntity,
} from './entities';
import { ProductMetadata, ProductMetadataSchema } from './schemas/product-metadata.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductEntity,
      ProductVariantEntity,
      ProductImageEntity,
      CategoryEntity,
    ]),
    MongooseModule.forFeature([
      { name: ProductMetadata.name, schema: ProductMetadataSchema },
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
