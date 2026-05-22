import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, Between } from 'typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  ProductEntity,
  ProductVariantEntity,
  ProductImageEntity,
  CategoryEntity,
} from './entities';
import { ProductMetadata } from './schemas/product-metadata.schema';
import {
  CreateProductDto,
  UpdateProductDto,
  ProductQueryDto,
  CreateProductVariantDto,
} from './dto';

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    @InjectRepository(ProductVariantEntity)
    private variantRepository: Repository<ProductVariantEntity>,
    @InjectRepository(ProductImageEntity)
    private imageRepository: Repository<ProductImageEntity>,
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
    @InjectModel(ProductMetadata.name)
    private metadataModel: Model<ProductMetadata>,
  ) {}

  // ============= PRODUCT CRUD =============

  async create(createProductDto: CreateProductDto): Promise<ProductEntity> {
    const { name, categoryId, variants, images, specifications, customFields, ...productData } = createProductDto;

    // Verify category exists
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });
    if (!category) {
      throw new NotFoundException(`Category ${categoryId} not found`);
    }

    // Check for duplicate name
    const existingProduct = await this.productRepository.findOne({
      where: { name },
    });
    if (existingProduct) {
      throw new ConflictException(`Product with name "${name}" already exists`);
    }

    // Create product
    const product = this.productRepository.create({
      ...productData,
      name,
      slug: generateSlug(name),
      categoryId,
    });

    const savedProduct = await this.productRepository.save(product);

    // Create variants
    if (variants && variants.length > 0) {
      const productVariants = variants.map((variant) =>
        this.variantRepository.create({
          ...variant,
          productId: savedProduct.id,
        }),
      );
      await this.variantRepository.save(productVariants);
    }

    // Create images
    if (images && images.length > 0) {
      const productImages = images.map((image, index) =>
        this.imageRepository.create({
          ...image,
          productId: savedProduct.id,
          displayOrder: index,
        }),
      );
      await this.imageRepository.save(productImages);
    }

    // Create metadata in MongoDB
    await this.metadataModel.create({
      productId: savedProduct.id,
      specifications: specifications || {},
      customFields: customFields || {},
    });

    // Reload with relations
    return this.productRepository.findOneOrFail({
      where: { id: savedProduct.id },
      relations: ['category', 'variants', 'images'],
    });
  }

  async findAll(query: ProductQueryDto) {
    const { page = 1, limit = 20, search, category, sortBy = 'createdAt', sortOrder = 'DESC', minPrice, maxPrice, featured, inStock, published, tags } = query;
    const skip = (page - 1) * limit;

    let qb = this.productRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.variants', 'variants')
      .leftJoinAndSelect('product.images', 'images');

    // Apply filters
    if (published !== undefined) {
      qb = qb.andWhere('product.isPublished = :published', { published });
    }
    if (featured) {
      qb = qb.andWhere('product.isFeatured = :featured', { featured: true });
    }
    if (category) {
      qb = qb.andWhere('product.categoryId = :category', { category });
    }
    if (search) {
      qb = qb.andWhere('product.name ILIKE :search', {
        search: `%${search}%`,
      });
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
      qb = qb.andWhere('product.basePrice BETWEEN :minPrice AND :maxPrice', {
        minPrice: minPrice || 0,
        maxPrice: maxPrice || 999999,
      });
    }
    if (inStock) {
      qb = qb.andWhere('variants.stock > 0');
    }
    if (tags && tags.length > 0) {
      qb = qb.andWhere('product.tags && :tags', { tags });
    }

    // Sorting
    const sortColumn = `product.${sortBy}`;
    qb = qb.orderBy(sortColumn, (sortOrder || 'DESC') as any);

    const [products, total] = await qb
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data: products,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category', 'variants', 'images'],
    });

    if (!product) {
      throw new NotFoundException(`Product ${id} not found`);
    }

    // Increment view count
    await this.productRepository.increment({ id }, 'viewCount', 1);

    return product;
  }

  async findBySlug(slug: string): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({
      where: { slug },
      relations: ['category', 'variants', 'images'],
    });

    if (!product) {
      throw new NotFoundException(`Product with slug "${slug}" not found`);
    }

    // Increment view count
    await this.productRepository.increment({ slug }, 'viewCount', 1);

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['variants', 'images'],
    });

    if (!product) {
      throw new NotFoundException(`Product ${id} not found`);
    }

    // Check category if provided
    if (updateProductDto.categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: updateProductDto.categoryId },
      });
      if (!category) {
        throw new NotFoundException(`Category ${updateProductDto.categoryId} not found`);
      }
    }

    const { variants, images, specifications, customFields, ...updateData } = updateProductDto;

    // Update product fields
    Object.assign(product, updateData);
    if (updateProductDto.name && updateProductDto.name !== product.name) {
      product.slug = generateSlug(updateProductDto.name);
    }

    const updatedProduct = await this.productRepository.save(product);

    // Update variants if provided
    if (variants && variants.length > 0) {
      await this.variantRepository.delete({ productId: id });
      const newVariants = variants.map((variant) =>
        this.variantRepository.create({
          ...variant,
          productId: id,
        }),
      );
      await this.variantRepository.save(newVariants);
    }

    // Update images if provided
    if (images && images.length > 0) {
      await this.imageRepository.delete({ productId: id });
      const newImages = images.map((image, index) =>
        this.imageRepository.create({
          ...image,
          productId: id,
          displayOrder: index,
        }),
      );
      await this.imageRepository.save(newImages);
    }

    // Update metadata
    if (specifications || customFields) {
      await this.metadataModel.findOneAndUpdate(
        { productId: id },
        {
          ...(specifications && { specifications }),
          ...(customFields && { customFields }),
        },
        { upsert: true },
      );
    }

    return this.productRepository.findOneOrFail({
      where: { id },
      relations: ['category', 'variants', 'images'],
    });
  }

  async remove(id: string): Promise<void> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product ${id} not found`);
    }

    await this.productRepository.remove(product);
    await this.metadataModel.deleteOne({ productId: id });
  }

  // ============= VARIANT MANAGEMENT =============

  async addVariant(productId: string, createVariantDto: CreateProductVariantDto): Promise<ProductVariantEntity> {
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException(`Product ${productId} not found`);
    }

    const variant = this.variantRepository.create({
      ...createVariantDto,
      productId,
    });

    return this.variantRepository.save(variant);
  }

  async updateVariant(variantId: string, updateData: Partial<CreateProductVariantDto>): Promise<ProductVariantEntity> {
    const variant = await this.variantRepository.findOne({
      where: { id: variantId },
    });

    if (!variant) {
      throw new NotFoundException(`Variant ${variantId} not found`);
    }

    Object.assign(variant, updateData);
    return this.variantRepository.save(variant);
  }

  async removeVariant(variantId: string): Promise<void> {
    const variant = await this.variantRepository.findOne({
      where: { id: variantId },
    });

    if (!variant) {
      throw new NotFoundException(`Variant ${variantId} not found`);
    }

    await this.variantRepository.remove(variant);
  }

  async reserveStock(variantId: string, quantity: number): Promise<void> {
    const variant = await this.variantRepository.findOne({
      where: { id: variantId },
    });

    if (!variant) {
      throw new NotFoundException(`Variant ${variantId} not found`);
    }

    if (variant.stock < quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    variant.stock -= quantity;
    variant.reservedStock += quantity;
    await this.variantRepository.save(variant);
  }

  async releaseStock(variantId: string, quantity: number): Promise<void> {
    const variant = await this.variantRepository.findOne({
      where: { id: variantId },
    });

    if (!variant) {
      throw new NotFoundException(`Variant ${variantId} not found`);
    }

    variant.stock += quantity;
    variant.reservedStock = Math.max(0, variant.reservedStock - quantity);
    await this.variantRepository.save(variant);
  }

  // ============= CATEGORY MANAGEMENT =============

  async createCategory(name: string, description?: string, parentId?: string) {
    const category = this.categoryRepository.create({
      name,
      slug: generateSlug(name),
      description,
      parentId,
    });

    return this.categoryRepository.save(category);
  }

  async findAllCategories() {
    return this.categoryRepository.find({
      relations: ['parent', 'children'],
      order: { name: 'ASC' },
    });
  }

  async findCategoryById(id: string) {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['parent', 'children', 'products'],
    });

    if (!category) {
      throw new NotFoundException(`Category ${id} not found`);
    }

    return category;
  }

  async updateCategory(id: string, updateData: Partial<{ name: string; description: string; parentId: string }>) {
    const category = await this.categoryRepository.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException(`Category ${id} not found`);
    }

    Object.assign(category, updateData);
    return this.categoryRepository.save(category);
  }

  async removeCategory(id: string): Promise<void> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['products'],
    });

    if (!category) {
      throw new NotFoundException(`Category ${id} not found`);
    }

    if (category.products && category.products.length > 0) {
      throw new BadRequestException('Cannot delete category with existing products');
    }

    await this.categoryRepository.remove(category);
  }

  // ============= METADATA & ANALYTICS =============

  async getProductMetadata(productId: string) {
    const metadata = await this.metadataModel.findOne({ productId });

    if (!metadata) {
      throw new NotFoundException(`Metadata for product ${productId} not found`);
    }

    return metadata;
  }

  async addReview(productId: string, userId: string, rating: number, comment: string) {
    const metadata = await this.metadataModel.findOneAndUpdate(
      { productId },
      {
        $push: {
          reviews: {
            userId,
            rating,
            comment,
            createdAt: new Date(),
          },
        },
      },
      { new: true, upsert: true },
    );

    // Update product rating
    const reviews = metadata?.reviews || [];
    if (reviews.length > 0) {
      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

      await this.productRepository.update(
        { id: productId },
        {
          rating: parseFloat(avgRating.toFixed(2)),
          reviewCount: reviews.length,
        },
      );
    }

    return metadata;
  }

  async searchProducts(searchTerm: string, limit = 20) {
    return this.productRepository.find({
      where: [
        { name: ILike(`%${searchTerm}%`) },
        { description: ILike(`%${searchTerm}%`) },
      ],
      relations: ['category', 'variants', 'images'],
      take: limit,
    });
  }

  async getFeaturedProducts(limit = 10) {
    return this.productRepository.find({
      where: { isFeatured: true, isPublished: true },
      relations: ['category', 'variants', 'images'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async getRelatedProducts(productId: string, limit = 5) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['category'],
    });

    if (!product) {
      throw new NotFoundException(`Product ${productId} not found`);
    }

    return this.productRepository.find({
      where: {
        categoryId: product.categoryId,
        isPublished: true,
      },
      relations: ['category', 'variants', 'images'],
      take: limit,
    });
  }

  async incrementSalesCount(productId: string, quantity = 1) {
    await this.productRepository.increment({ id: productId }, 'salesCount', quantity);
  }
}
