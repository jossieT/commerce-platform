import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  Index,
} from 'typeorm';
import { CategoryEntity } from './category.entity';
import { ProductVariantEntity } from './product-variant.entity';
import { ProductImageEntity } from './product-image.entity';

@Entity('products')
@Index(['slug'])
@Index(['categoryId'])
@Index(['isPublished'])
@Index(['isFeatured'])
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  shortDescription: string;

  @Column({ type: 'uuid' })
  categoryId: string;

  @ManyToOne(() => CategoryEntity, (category) => category.products, {
    eager: true,
    onDelete: 'RESTRICT',
  })
  category: CategoryEntity;

  @OneToMany(() => ProductImageEntity, (image) => image.product, {
    cascade: true,
    eager: true,
  })
  images: ProductImageEntity[];

  @OneToMany(() => ProductVariantEntity, (variant) => variant.product, {
    cascade: true,
    eager: true,
  })
  variants: ProductVariantEntity[];

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  basePrice: number;

  @Column({ type: 'simple-array', default: '' })
  tags: string[];

  @Column({ type: 'boolean', default: false })
  isPublished: boolean;

  @Column({ type: 'boolean', default: false })
  isFeatured: boolean;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating: number; // 0-5

  @Column({ type: 'int', default: 0 })
  reviewCount: number;

  @Column({ type: 'int', default: 0 })
  viewCount: number;

  @Column({ type: 'int', default: 0 })
  salesCount: number;

  @Column({ type: 'jsonb', default: '{}' })
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
