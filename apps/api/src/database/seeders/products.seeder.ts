import { DataSource } from 'typeorm';
import { Model } from 'mongoose';
import {
  ProductEntity,
  ProductVariantEntity,
  ProductImageEntity,
  CategoryEntity,
} from '@/modules/products/entities';
import { ProductMetadata } from '@/modules/products/schemas/product-metadata.schema';

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export class ProductsSeeder {
  constructor(
    private dataSource: DataSource,
    private metadataModel: Model<ProductMetadata>,
  ) {}

  async seed() {
    console.log('🌱 Starting products seeder...');

    try {
      // Clear all existing data in correct order to avoid foreign key constraints
      await this.clearData();

      // Create categories first
      const categories = await this.seedCategories();
      console.log(`✅ Created ${categories.length} categories`);

      // Create products
      const products = await this.seedProducts(categories);
      console.log(`✅ Created ${products.length} products with variants`);

      // Create metadata in MongoDB
      await this.seedMetadata(products);
      console.log(`✅ Created metadata for all products`);

      console.log('🎉 Products seeding completed successfully!');
    } catch (error) {
      console.error('❌ Seeding failed:', error);
      throw error;
    }
  }

  private async clearData(): Promise<void> {
    console.log('🧹 Clearing existing data...');
    // Clear MongoDB data
    await this.metadataModel.deleteMany({});
    
    // Clear PostgreSQL data in reverse dependency order
    await this.dataSource.getRepository(ProductImageEntity).createQueryBuilder().delete().execute();
    await this.dataSource.getRepository(ProductVariantEntity).createQueryBuilder().delete().execute();
    await this.dataSource.getRepository(ProductEntity).createQueryBuilder().delete().execute();
    await this.dataSource.getRepository(CategoryEntity).createQueryBuilder().delete().execute();
  }

  private async seedCategories(): Promise<CategoryEntity[]> {
    const categoryRepo = this.dataSource.getRepository(CategoryEntity);

    const mainCategories = [
      {
        name: 'Electronics',
        description: 'Electronic devices and gadgets',
      },
      {
        name: 'Fashion',
        description: 'Clothing and accessories',
      },
      {
        name: 'Home & Garden',
        description: 'Home decoration and garden supplies',
      },
      {
        name: 'Sports & Outdoors',
        description: 'Sports equipment and outdoor gear',
      },
      {
        name: 'Books & Media',
        description: 'Books, DVDs, and digital media',
      },
    ];

    const categories: CategoryEntity[] = [];

    for (const cat of mainCategories) {
      const category = categoryRepo.create({
        name: cat.name,
        slug: generateSlug(cat.name),
        description: cat.description,
        imageUrl: `https://placehold.co/300x200/png?text=${encodeURIComponent(cat.name)}`,
      });
      categories.push(await categoryRepo.save(category));
    }

    // Add subcategories for Electronics
    const electronicsSubcats = [
      { name: 'Smartphones', parentId: categories[0].id },
      { name: 'Laptops', parentId: categories[0].id },
      { name: 'Headphones', parentId: categories[0].id },
    ];

    for (const subcat of electronicsSubcats) {
      const category = categoryRepo.create({
        name: subcat.name,
        slug: generateSlug(subcat.name),
        parentId: subcat.parentId,
      });
      categories.push(await categoryRepo.save(category));
    }

    return categories;
  }

  private async seedProducts(categories: CategoryEntity[]): Promise<ProductEntity[]> {
    const productRepo = this.dataSource.getRepository(ProductEntity);
    const variantRepo = this.dataSource.getRepository(ProductVariantEntity);
    const imageRepo = this.dataSource.getRepository(ProductImageEntity);

    const products: ProductEntity[] = [];
    const productsData = this.getProductsData();

    for (const productData of productsData) {
      // Pick a random category
      const category =
        categories[Math.floor(Math.random() * categories.length)];

      const product = productRepo.create({
        name: productData.name,
        slug: generateSlug(productData.name),
        description: productData.description,
        shortDescription: productData.shortDescription,
        basePrice: productData.basePrice,
        categoryId: category.id,
        tags: productData.tags,
        isPublished: true,
        isFeatured: Math.random() > 0.7, // 30% featured
        rating: parseFloat((Math.random() * 5).toFixed(1)),
        reviewCount: Math.floor(Math.random() * 100),
        seo: {
          metaTitle: productData.name,
          metaDescription: productData.shortDescription,
          keywords: productData.tags,
        },
      });

      const savedProduct = await productRepo.save(product);

      // Create variants
      for (const variantData of productData.variants) {
        const variant = variantRepo.create({
          productId: savedProduct.id,
          ...variantData,
          stock: Math.floor(Math.random() * 100) + 10,
          reservedStock: 0,
          isActive: true,
        });
        await variantRepo.save(variant);
      }

      // Create images
      for (let i = 0; i < 3; i++) {
        const image = imageRepo.create({
          productId: savedProduct.id,
          url: `https://placehold.co/500x500/png?text=${encodeURIComponent(productData.name)}+${i + 1}`,
          altText: `${productData.name} - Image ${i + 1}`,
          displayOrder: i,
          isThumbnail: i === 0,
        });
        await imageRepo.save(image);
      }

      products.push(savedProduct);
    }

    return products;
  }

  private async seedMetadata(products: ProductEntity[]): Promise<void> {
    for (const product of products) {
      const specifications = {
        material: ['Cotton', 'Polyester', 'Wool'][Math.floor(Math.random() * 3)],
        weight: `${(Math.random() * 5).toFixed(2)} kg`,
        dimensions: {
          length: Math.floor(Math.random() * 100),
          width: Math.floor(Math.random() * 100),
          height: Math.floor(Math.random() * 100),
        },
      };

      const customFields = {
        warrantyMonths: Math.floor(Math.random() * 24) + 1,
        bestFor: ['Professionals', 'Beginners', 'Experts'][
          Math.floor(Math.random() * 3)
        ],
      };

      const reviews = Array.from({ length: Math.floor(Math.random() * 10) }, (_, i) => ({
        userId: `user_${i}`,
        rating: Math.floor(Math.random() * 5) + 1,
        comment: 'Great product! Highly recommended.',
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      }));

      await this.metadataModel.create({
        productId: product.id,
        specifications,
        customFields,
        reviews,
        relatedProductIds: [],
        crossSellProductIds: [],
        inventoryHistory: [
          {
            variantId: product.id,
            quantity: 100,
            type: 'purchase',
            reason: 'Initial stock',
            timestamp: new Date(),
          },
        ],
        socialProof: {
          viewsLastDay: Math.floor(Math.random() * 500),
          salesLastDay: Math.floor(Math.random() * 50),
          wishlists: Math.floor(Math.random() * 100),
        },
      });
    }
  }

  private getProductsData() {
    return [
      {
        name: 'Premium Wireless Headphones',
        description: 'High-quality noise-cancelling wireless headphones with 30-hour battery life',
        shortDescription: 'Noise-cancelling wireless headphones',
        basePrice: 299.99,
        tags: ['electronics', 'audio', 'wireless', 'noise-cancelling'],
        variants: [
          {
            name: 'Black',
            sku: 'PWHA-BLK-001',
            price: 299.99,
            compareAtPrice: 349.99,
            attributes: { color: 'Black' },
          },
          {
            name: 'Silver',
            sku: 'PWHA-SLV-001',
            price: 299.99,
            compareAtPrice: 349.99,
            attributes: { color: 'Silver' },
          },
          {
            name: 'Gold',
            sku: 'PWHA-GLD-001',
            price: 329.99,
            compareAtPrice: 379.99,
            attributes: { color: 'Gold' },
          },
        ],
      },
      {
        name: 'Ultra-Thin Laptop',
        description: 'Lightweight 14-inch laptop with Intel i7 processor and 16GB RAM',
        shortDescription: 'Ultra-thin and powerful laptop',
        basePrice: 1299.99,
        tags: ['electronics', 'computers', 'laptops', 'business'],
        variants: [
          {
            name: '512GB SSD',
            sku: 'UTL-512-001',
            price: 1299.99,
            compareAtPrice: 1499.99,
            attributes: { storage: '512GB SSD' },
          },
          {
            name: '1TB SSD',
            sku: 'UTL-1TB-001',
            price: 1499.99,
            compareAtPrice: 1699.99,
            attributes: { storage: '1TB SSD' },
          },
        ],
      },
      {
        name: 'Designer Sunglasses',
        description: 'Trendy UV-protected designer sunglasses with premium frames',
        shortDescription: 'Premium designer sunglasses',
        basePrice: 199.99,
        tags: ['fashion', 'accessories', 'eyewear'],
        variants: [
          {
            name: 'Classic Brown',
            sku: 'DSG-CBR-001',
            price: 199.99,
            compareAtPrice: 249.99,
            attributes: { style: 'Classic', color: 'Brown' },
          },
          {
            name: 'Modern Black',
            sku: 'DSG-MBK-001',
            price: 199.99,
            compareAtPrice: 249.99,
            attributes: { style: 'Modern', color: 'Black' },
          },
          {
            name: 'Vintage Gold',
            sku: 'DSG-VGD-001',
            price: 219.99,
            compareAtPrice: 269.99,
            attributes: { style: 'Vintage', color: 'Gold' },
          },
        ],
      },
      {
        name: 'Organic Cotton T-Shirt',
        description: '100% organic cotton comfortable t-shirt available in multiple colors',
        shortDescription: 'Soft organic cotton t-shirt',
        basePrice: 39.99,
        tags: ['fashion', 'clothing', 'casual', 'organic'],
        variants: [
          {
            name: 'Small - White',
            sku: 'OCT-S-WHT-001',
            price: 39.99,
            compareAtPrice: 49.99,
            attributes: { size: 'S', color: 'White' },
          },
          {
            name: 'Medium - White',
            sku: 'OCT-M-WHT-001',
            price: 39.99,
            compareAtPrice: 49.99,
            attributes: { size: 'M', color: 'White' },
          },
          {
            name: 'Large - Blue',
            sku: 'OCT-L-BLU-001',
            price: 39.99,
            compareAtPrice: 49.99,
            attributes: { size: 'L', color: 'Blue' },
          },
          {
            name: 'XL - Black',
            sku: 'OCT-XL-BLK-001',
            price: 39.99,
            compareAtPrice: 49.99,
            attributes: { size: 'XL', color: 'Black' },
          },
        ],
      },
      {
        name: 'Pro Camera Kit',
        description: 'Professional camera kit with 4K video, 3 lenses, and accessories',
        shortDescription: 'Complete professional camera kit',
        basePrice: 1999.99,
        tags: ['electronics', 'photography', 'cameras', 'professional'],
        variants: [
          {
            name: 'Standard Kit',
            sku: 'PCK-STD-001',
            price: 1999.99,
            compareAtPrice: 2299.99,
            attributes: { type: 'Standard' },
          },
          {
            name: 'Extended Kit',
            sku: 'PCK-EXT-001',
            price: 2499.99,
            compareAtPrice: 2899.99,
            attributes: { type: 'Extended' },
          },
        ],
      },
      {
        name: 'Yoga Mat Premium',
        description: 'Non-slip eco-friendly yoga mat with carrying strap',
        shortDescription: 'Premium eco-friendly yoga mat',
        basePrice: 79.99,
        tags: ['sports', 'fitness', 'yoga', 'eco-friendly'],
        variants: [
          {
            name: 'Purple - 4mm',
            sku: 'YMP-PUR-4MM',
            price: 79.99,
            compareAtPrice: 99.99,
            attributes: { color: 'Purple', thickness: '4mm' },
          },
          {
            name: 'Blue - 6mm',
            sku: 'YMP-BLU-6MM',
            price: 89.99,
            compareAtPrice: 109.99,
            attributes: { color: 'Blue', thickness: '6mm' },
          },
        ],
      },
      {
        name: 'Stainless Steel Water Bottle',
        description: 'Insulated stainless steel water bottle keeps drinks hot/cold for 24 hours',
        shortDescription: 'Insulated water bottle',
        basePrice: 34.99,
        tags: ['home', 'outdoor', 'eco-friendly'],
        variants: [
          {
            name: '500ml - Silver',
            sku: 'SSWB-500-SLV',
            price: 34.99,
            compareAtPrice: 44.99,
            attributes: { capacity: '500ml', color: 'Silver' },
          },
          {
            name: '750ml - Black',
            sku: 'SSWB-750-BLK',
            price: 39.99,
            compareAtPrice: 49.99,
            attributes: { capacity: '750ml', color: 'Black' },
          },
          {
            name: '1L - Rose Gold',
            sku: 'SSWB-1L-RGD',
            price: 44.99,
            compareAtPrice: 54.99,
            attributes: { capacity: '1L', color: 'Rose Gold' },
          },
        ],
      },
      {
        name: 'Bestseller: The Great Gatsby',
        description: 'Classic American novel by F. Scott Fitzgerald',
        shortDescription: 'Timeless classic novel',
        basePrice: 12.99,
        tags: ['books', 'fiction', 'classic', 'literature'],
        variants: [
          {
            name: 'Paperback',
            sku: 'BGT-PB-001',
            price: 12.99,
            compareAtPrice: 15.99,
            attributes: { format: 'Paperback' },
          },
          {
            name: 'Hardcover',
            sku: 'BGT-HC-001',
            price: 19.99,
            compareAtPrice: 24.99,
            attributes: { format: 'Hardcover' },
          },
          {
            name: 'E-Book',
            sku: 'BGT-EB-001',
            price: 9.99,
            compareAtPrice: 12.99,
            attributes: { format: 'E-Book' },
          },
        ],
      },
      {
        name: 'Smart Home Hub',
        description: 'Central hub for controlling all your smart home devices',
        shortDescription: 'Control all smart home devices',
        basePrice: 149.99,
        tags: ['electronics', 'smart-home', 'IoT', 'automation'],
        variants: [
          {
            name: 'Standard Version',
            sku: 'SHH-STD-001',
            price: 149.99,
            compareAtPrice: 179.99,
            attributes: { version: 'Standard' },
          },
          {
            name: 'Pro Version',
            sku: 'SHH-PRO-001',
            price: 199.99,
            compareAtPrice: 239.99,
            attributes: { version: 'Pro' },
          },
        ],
      },
      {
        name: 'Leather Travel Backpack',
        description: 'Durable leather backpack with multiple compartments for business travel',
        shortDescription: 'Professional leather backpack',
        basePrice: 129.99,
        tags: ['fashion', 'accessories', 'travel', 'business'],
        variants: [
          {
            name: 'Brown',
            sku: 'LTB-BRN-001',
            price: 129.99,
            compareAtPrice: 159.99,
            attributes: { color: 'Brown' },
          },
          {
            name: 'Black',
            sku: 'LTB-BLK-001',
            price: 129.99,
            compareAtPrice: 159.99,
            attributes: { color: 'Black' },
          },
        ],
      },
    ];
  }
}
