# ProductsModule Design Documentation

## Overview
The ProductsModule is built with a **hybrid TypeORM (PostgreSQL) + Mongoose (MongoDB)** approach for optimal performance and flexibility.

## Architecture

### TypeORM Entities (PostgreSQL)
**Relational data with strict schema:**

```
ProductEntity
├── id (UUID, PK)
├── name, slug (indexed, unique)
├── description, shortDescription
├── basePrice, baseRating, reviewCount
├── isPublished, isFeatured (indexed)
├── viewCount, salesCount
├── categoryId (FK)
├── tags (simple-array)
├── seo (JSONB)
└── timestamps

CategoryEntity (hierarchical)
├── id (UUID, PK)
├── name, slug (indexed, unique)
├── description, imageUrl
├── parentId (nullable, self-referencing)
└── children relation

ProductVariantEntity
├── id (UUID, PK)
├── productId (FK, cascade delete)
├── name, sku (indexed, unique)
├── price, compareAtPrice
├── stock, reservedStock (for order management)
├── attributes (JSONB) { color, size, etc }
├── imageId (FK to image)
├── isActive
└── timestamps

ProductImageEntity
├── id (UUID, PK)
├── productId (FK, cascade delete)
├── url, altText
├── displayOrder, isThumbnail
└── createdAt
```

### Mongoose Schemas (MongoDB)
**Flexible, unstructured metadata:**

```
ProductMetadata
├── productId (indexed, string reference)
├── specifications {} (flexible product specs)
├── relatedProductIds []
├── crossSellProductIds []
├── customFields {} (extensible)
├── reviews []
│  ├── userId, rating, comment, createdAt
├── inventoryHistory [] (audit trail)
└── socialProof { viewsLastDay, salesLastDay, wishlists }
```

## Service Methods

### Product CRUD
- `create()` - Create product with variants, images, metadata
- `findAll()` - Search, filter, paginate with 15+ filter options
- `findOne()` - Get by ID (increments viewCount)
- `findBySlug()` - Get by slug (increments viewCount)
- `update()` - Update product, variants, images, metadata
- `remove()` - Cascade delete (entities + MongoDB metadata)

### Variant Management
- `addVariant()` - Add new size/color/option variant
- `updateVariant()` - Update variant details
- `removeVariant()` - Delete variant
- `reserveStock()` - Reserve inventory for pending orders
- `releaseStock()` - Release reserved stock

### Category Management
- `createCategory()` - Create hierarchical categories
- `findAllCategories()` - Get with parent/children relations
- `findCategoryById()` - Get category + products
- `updateCategory()` - Update category data
- `removeCategory()` - Delete (prevents deletion if has products)

### Analytics & Metadata
- `addReview()` - Add review, auto-update product rating
- `getProductMetadata()` - Fetch MongoDB metadata
- `searchProducts()` - Full-text search on name/description
- `getFeaturedProducts()` - Get featured + published
- `getRelatedProducts()` - Get same-category products
- `incrementSalesCount()` - Track sales for analytics

## DTOs

### CreateProductDto
```typescript
{
  name: string;              // Required, validated
  description: string;       // Required
  shortDescription?: string;
  categoryId: UUID;          // Must exist
  basePrice: number;
  tags?: string[];
  isPublished?: boolean;
  isFeatured?: boolean;
  seo?: { metaTitle, metaDescription, keywords[] };
  specifications?: object;   // MongoDB - flexible
  customFields?: object;     // MongoDB - extensible
  
  variants: [{               // Nested creation
    name, sku, price, compareAtPrice?, stock?, attributes
  }];
  
  images?: [{                // Nested creation
    url, altText?, isThumbnail?
  }];
}
```

### ProductQueryDto
```typescript
{
  page?: number;             // Default: 1
  limit?: number;            // Default: 20, Max: 100
  search?: string;           // ILIKE search on name
  category?: UUID;           // Filter by category
  sortBy?: 'createdAt'|'rating'|'price'|'sales'|'views';
  sortOrder?: 'ASC'|'DESC';
  minPrice?: number;         // Range filter
  maxPrice?: number;
  featured?: boolean;
  inStock?: boolean;
  published?: boolean;
  tags?: string[];           // Array filter
}
```

## Controller Endpoints

### Public Endpoints (No Auth)
```
GET    /api/products                    # List all with filters
GET    /api/products/featured           # Featured products
GET    /api/products/search?q=term      # Full-text search
GET    /api/products/id/:id             # Get by ID
GET    /api/products/:slug              # Get by slug
GET    /api/products/:id/related        # Related products
GET    /api/products/:id/metadata       # Product metadata
GET    /api/products/categories         # List categories
GET    /api/products/categories/:id     # Get category
```

### Admin Endpoints (JWT + Admin Role)
```
POST   /api/products                    # Create product
PATCH  /api/products/:id                # Update product
DELETE /api/products/:id                # Delete product

POST   /api/products/:productId/variants        # Add variant
PATCH  /api/products/variants/:variantId       # Update variant
DELETE /api/products/variants/:variantId       # Delete variant

POST   /api/products/variants/:variantId/reserve-stock
POST   /api/products/variants/:variantId/release-stock

POST   /api/products/categories        # Create category
PATCH  /api/products/categories/:id    # Update category
DELETE /api/products/categories/:id    # Delete category
```

### User Endpoints (JWT Required)
```
POST   /api/products/:id/reviews       # Add review
```

## Key Features

### 1. Hybrid Storage
- **PostgreSQL (TypeORM)**: Structured, relational data for transactions and filtering
- **MongoDB (Mongoose)**: Flexible metadata, specs, custom fields, review history

### 2. Performance Optimizations
- Indexed fields: slug, categoryId, isPublished, isFeatured
- Eager loading of relations
- Efficient pagination with skip/take
- View count tracking (non-blocking increment)
- Sales analytics tracking

### 3. Inventory Management
- Stock tracking per variant
- Reserved stock for pending orders
- Stock reserve/release for order processing
- Inventory history audit trail in MongoDB

### 4. Search & Discovery
- Full-text search on name/description
- Multi-filter capability (category, price range, tags, stock)
- Featured products endpoint
- Related products by category
- Sorting by: created date, rating, price, sales, views

### 5. SEO Support
- URL slugs (unique, auto-generated)
- Meta tags (title, description, keywords)
- Structured product data

### 6. Extensibility
- Custom fields in MongoDB for future attributes
- Flexible specifications object
- Support for future enrichment (recommendations, AI features)

## Database Indexes
```sql
-- PostgreSQL
CREATE INDEX ON products(slug);
CREATE INDEX ON products(categoryId);
CREATE INDEX ON products(isPublished);
CREATE INDEX ON products(isFeatured);
CREATE INDEX ON product_variants(sku);
CREATE INDEX ON product_variants(productId);

-- MongoDB
db.productmetadata.createIndex({ productId: 1 });
```

## Next Steps
1. Create seeder with sample products/categories
2. Build storefront product listing UI (Next.js)
3. Build admin product management interface
4. Implement reviews & ratings system
5. Add product recommendations engine
6. Set up product search with Elasticsearch (optional)
