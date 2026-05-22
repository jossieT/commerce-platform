import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductMetadataDocument = HydratedDocument<ProductMetadata>;

@Schema({ timestamps: true })
export class ProductMetadata {
  @Prop({ required: true })
  productId: string; // Reference to TypeORM Product entity ID

  @Prop({ type: Object, default: {} })
  specifications: Record<string, any>; // Flexible product specs

  @Prop({ type: [String], default: [] })
  relatedProductIds: string[];

  @Prop({ type: [String], default: [] })
  crossSellProductIds: string[];

  @Prop({ type: Object, default: {} })
  customFields: Record<string, any>; // Custom data per product

  @Prop({ type: Array, default: [] })
  reviews: {
    userId: string;
    rating: number;
    comment: string;
    createdAt: Date;
  }[];

  @Prop({ type: Array, default: [] })
  inventoryHistory: {
    variantId: string;
    quantity: number;
    type: 'purchase' | 'sale' | 'adjustment' | 'return';
    reason?: string;
    timestamp: Date;
  }[];

  @Prop({ type: Object, default: {} })
  socialProof: {
    viewsLastDay?: number;
    salesLastDay?: number;
    wishlists?: number;
  };
}

export const ProductMetadataSchema = SchemaFactory.createForClass(ProductMetadata);
ProductMetadataSchema.index({ productId: 1 });
