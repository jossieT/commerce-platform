# Seeders Documentation

## Overview
Database seeders populate your development database with sample data for testing and development purposes.

## Available Seeders

### 1. ProductsSeeder
Creates:
- **5 main product categories** (Electronics, Fashion, Home & Garden, Sports & Outdoors, Books & Media)
- **3 subcategories** under Electronics (Smartphones, Laptops, Headphones)
- **10 sample products** with realistic data:
  - Premium Wireless Headphones
  - Ultra-Thin Laptop
  - Designer Sunglasses
  - Organic Cotton T-Shirt
  - Pro Camera Kit
  - Yoga Mat Premium
  - Stainless Steel Water Bottle
  - Bestseller: The Great Gatsby
  - Smart Home Hub
  - Leather Travel Backpack

**Each product includes:**
- Multiple variants (colors, sizes, storage options)
- 3 images per product
- SEO metadata
- Random ratings and review counts
- Flexible MongoDB metadata (specifications, reviews history, custom fields)
- Random social proof data (views, sales, wishlists)

## How to Run

### Run all seeders
```bash
npm run db:seed
```

### Run from project root
```bash
cd apps/api
npm run db:seed
```

### Prerequisites
1. PostgreSQL database running (via docker-compose)
2. MongoDB database running (via docker-compose)
3. Databases must be initialized (migrations run)

```bash
# Start database containers
docker-compose up -d

# Wait for databases to be healthy (check healthcheck status)
docker-compose ps

# Run migrations (if needed)
npm run db:migrate

# Run seeders
npm run db:seed
```

## What Gets Seeded

### PostgreSQL (TypeORM)
- `categories` table - 8 categories (5 main + 3 sub)
- `products` table - 10 products with full details
- `product_variants` table - ~30 variants across products
- `product_images` table - 30 images (3 per product)

### MongoDB (Mongoose)
- `productmetadata` collection - Flexible product data
  - Specifications (material, weight, dimensions)
  - Reviews with ratings and timestamps
  - Custom fields (warranty, best for)
  - Inventory history
  - Social proof metrics

## Sample Query Results

### Get all products
```bash
curl http://localhost:4000/api/products
```

### Get featured products
```bash
curl http://localhost:4000/api/products/featured
```

### Search products
```bash
curl http://localhost:4000/api/products/search?q=wireless
```

### Get by category
```bash
curl http://localhost:4000/api/products?category=<categoryId>
```

### Get product with slug
```bash
curl http://localhost:4000/api/products/premium-wireless-headphones
```

## Notes

- Running seeders **clears** existing data (destructive operation)
- Images use placeholder.com for demonstration
- All products are marked as `isPublished: true`
- ~30% of products are marked as `isFeatured: true`
- Variants have realistic SKUs and pricing
- Metadata includes realistic review data and timestamps
- Stock quantities are randomized (10-100 units per variant)

## For Development/Testing

After seeding, you can:
1. Test product listing/filtering endpoints
2. Build and test the storefront product UI
3. Test variant selection functionality
4. Test search and category filtering
5. Verify pricing calculations
6. Test image loading

## Next Steps

1. ✅ Seed database with sample products
2. Build storefront product listing UI
3. Build admin product management interface
4. Implement product recommendations
5. Add Elasticsearch for advanced search (optional)
