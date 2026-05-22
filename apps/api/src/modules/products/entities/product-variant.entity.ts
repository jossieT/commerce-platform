import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { ProductEntity } from './product.entity';
import { ProductImageEntity } from './product-image.entity';

@Entity('product_variants')
export class ProductVariantEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  productId: string;

  @ManyToOne(() => ProductEntity, (product) => product.variants, {
    onDelete: 'CASCADE',
  })
  product: ProductEntity;

  @Column({ type: 'varchar', length: 255 })
  name: string; // e.g., "Red / XL"

  @Column({ type: 'varchar', length: 255, unique: true })
  sku: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  compareAtPrice: number;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ type: 'int', default: 0 })
  reservedStock: number; // For pending orders

  @Column({ type: 'jsonb', default: '{}' })
  attributes: Record<string, string>; // { color: "Red", size: "XL" }

  @Column({ type: 'uuid', nullable: true })
  imageId: string;

  @ManyToOne(() => ProductImageEntity, { nullable: true, onDelete: 'SET NULL' })
  image: ProductImageEntity;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
