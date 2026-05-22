# E-Commerce Platform - Complete Setup & Quick Start Guide

## 🎯 Current Status

### ✅ Completed
- **Backend (NestJS)**
  - ProductsModule with full CRUD operations
  - 12 modules wired (auth, users, products, payments, etc.)
  - Database setup (PostgreSQL + MongoDB)
  - JWT authentication
  - Swagger documentation
  - Global validation and error handling

- **Database & Seeding**
  - Docker Compose setup (PostgreSQL, MongoDB, Redis)
  - Product seeder with 10 sample products
  - 30 variants, 8 categories, 30 images
  - Metadata in MongoDB (specs, reviews, analytics)

- **Frontend (Next.js)**
  - Product listing with advanced filtering
  - Product detail page with variants
  - Search & sorting functionality
  - Cart store (Zustand) with persistence
  - React Query for data fetching
  - Responsive design
  - Type-safe API client

### ⏭️ Next Priority
- Orders Module with checkout flow
- Payment integration (Chapa)
- Admin dashboard for product management
- User authentication on storefront

## 🚀 Quick Start (5 Steps)

### Step 1: Start Databases
```bash
# From project root
docker-compose up -d

# Verify containers are running
docker-compose ps
```

**Expected output:** 3 healthy containers (postgres, mongo, redis)

### Step 2: Seed Sample Products
```bash
# From project root
npm run db:seed

# Or from apps/api
cd apps/api && npm run db:seed
```

**Expected:** Logs showing 8 categories, 10 products, 30 variants created

### Step 3: Start API Server
```bash
# From project root
npm run dev

# Or from apps/api in separate terminal
cd apps/api && npm run dev
```

**API running at:** `http://localhost:4000`
**Swagger docs:** `http://localhost:4000/api`

### Step 4: Start Storefront
```bash
# In new terminal from project root
cd apps/storefront && npm run dev
```

**Storefront running at:** `http://localhost:3000`

### Step 5: Browse Products
1. Open `http://localhost:3000/products`
2. Browse products, filters, search
3. Click on a product to see details
4. Select variants and add to cart
5. View cart items (persisted in localStorage)

## 📁 Project Structure

```
e-commerce/
├── apps/
│   ├── api/                  # NestJS backend
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   └── products/
│   │   │   │       ├── entities/ (4 TypeORM entities)
│   │   │   │       ├── schemas/ (MongoDB schema)
│   │   │   │       ├── dto/ (DTOs)
│   │   │   │       ├── products.service.ts
│   │   │   │       ├── products.controller.ts
│   │   │   │       └── products.module.ts
│   │   │   ├── database/
│   │   │   │   └── seeders/
│   │   │   │       ├── products.seeder.ts
│   │   │   │       └── seed.ts
│   │   │   ├── common/ (decorators, guards, interceptors)
│   │   │   ├── config/ (database, JWT, etc.)
│   │   │   └── main.ts
│   │   └── package.json
│   │
│   ├── storefront/           # Next.js 14 customer app
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── products/
│   │   │   │   │   ├── page.tsx (listing)
│   │   │   │   │   └── [slug]/page.tsx (detail)
│   │   │   │   └── layout.tsx (with React Query provider)
│   │   │   ├── components/
│   │   │   │   ├── product/ (6 components)
│   │   │   │   └── providers/
│   │   │   ├── hooks/ (useProducts with React Query)
│   │   │   ├── lib/
│   │   │   │   ├── api.ts (axios client)
│   │   │   │   └── products-api.ts (typed endpoints)
│   │   │   └── store/
│   │   │       └── cart.store.ts (Zustand)
│   │   └── package.json
│   │
│   └── admin/                # Next.js 14 admin app (stub)
│
├── packages/
│   ├── types/                # Shared TypeScript types
│   ├── config/               # Shared ESLint, Tailwind, TS configs
│   └── ui/                   # Shared UI components (stub)
│
├── docker-compose.yml        # PostgreSQL, MongoDB, Redis
├── package.json             # Root workspace config
├── turbo.json               # Turborepo config
└── README.md
```

## 🔌 API Endpoints

### Product Management
```bash
# Public endpoints
GET  /api/v1/products                    # List with filters
GET  /api/v1/products/featured           # Featured products
GET  /api/v1/products/search?q=term      # Search
GET  /api/v1/products/id/:id             # Get by ID
GET  /api/v1/products/:slug              # Get by slug
GET  /api/v1/products/:id/related        # Related products
GET  /api/v1/products/categories         # All categories

# Admin endpoints
POST   /api/v1/products                  # Create product
PATCH  /api/v1/products/:id              # Update product
DELETE /api/v1/products/:id              # Delete product

POST   /api/v1/products/:id/variants     # Add variant
PATCH  /api/v1/products/variants/:id     # Update variant
DELETE /api/v1/products/variants/:id     # Delete variant

POST   /api/v1/products/variants/:id/reserve-stock
POST   /api/v1/products/variants/:id/release-stock

# Categories
POST   /api/v1/products/categories       # Create category
PATCH  /api/v1/products/categories/:id   # Update category
DELETE /api/v1/products/categories/:id   # Delete category
```

### Example: Get Products with Filters
```bash
curl "http://localhost:4000/api/v1/products?category=<id>&minPrice=50&maxPrice=500&sortBy=price&inStock=true"
```

## 🗄️ Database Schema

### PostgreSQL (TypeORM)
- `products` - Core product data
- `product_variants` - Size/color/option variants
- `product_images` - Product images
- `categories` - Product categories (hierarchical)

### MongoDB (Mongoose)
- `productmetadata` - Flexible product metadata
  - Specifications
  - Reviews & ratings
  - Inventory history
  - Custom fields
  - Social proof

## 🎨 Key Features by Module

### ProductsModule (Backend)
✅ Full CRUD for products and variants
✅ Hierarchical categories
✅ Image management
✅ Stock tracking with reservations
✅ Advanced search & filtering
✅ Rating & reviews system
✅ SEO metadata
✅ Analytics (view count, sales)

### Storefront
✅ Product listing with pagination
✅ Advanced filtering (category, price, sort)
✅ Full-text search
✅ Product detail page
✅ Variant selection
✅ Add to cart functionality
✅ Cart persistence
✅ Related products
✅ Responsive design
✅ Loading states

## 📦 Technologies

**Backend:**
- NestJS 10
- TypeORM + PostgreSQL
- Mongoose + MongoDB
- JWT authentication
- Swagger/OpenAPI
- Class-validator

**Frontend:**
- Next.js 14
- React 18
- React Query (data fetching)
- Zustand (state management)
- Tailwind CSS
- TypeScript

**Infrastructure:**
- Docker Compose
- Turborepo (monorepo)
- PostgreSQL 16
- MongoDB 7
- Redis 7

## 🔐 Environment Setup

### API (.env)
```bash
NODE_ENV=development
PORT=4000

# PostgreSQL
PG_HOST=localhost
PG_PORT=5432
PG_USER=postgres
PG_PASSWORD=postgres
PG_DB=ecommerce

# MongoDB
MONGO_URI=mongodb://mongo:mongo@localhost:27017/ecommerce?authSource=admin

# JWT
JWT_SECRET=your-secret-key
JWT_ACCESS_EXPIRES=15m

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
```

### Storefront (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_SITE_NAME=My Store
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 🧪 Test Data

After seeding, you'll have:
- **8 Categories**: Electronics (with 3 subcategories), Fashion, Home & Garden, Sports, Books
- **10 Products**:
  - Premium Wireless Headphones ($299.99)
  - Ultra-Thin Laptop ($1299.99)
  - Designer Sunglasses ($199.99)
  - Organic Cotton T-Shirt ($39.99)
  - Pro Camera Kit ($1999.99)
  - Yoga Mat Premium ($79.99)
  - Stainless Steel Water Bottle ($34.99)
  - Bestseller: The Great Gatsby ($12.99)
  - Smart Home Hub ($149.99)
  - Leather Travel Backpack ($129.99)

- **30+ Variants** with different colors, sizes, and storage options
- **Random Ratings** (1-5 stars) and review counts

## 🎯 Current Workflow

1. User browses `/products` → Sees product grid
2. User filters by category/price/search
3. User clicks product card → Navigates to `/products/[slug]`
4. User selects variant (color, size) → Price updates
5. User adds to cart → Stored in Zustand + localStorage
6. Cart persists across page refresh

## 📊 Performance

- **React Query caching**: 5-30 min stale time
- **Image optimization**: Next.js Image component
- **Pagination**: 20 items per page
- **Lazy loading**: Images and components
- **Type-safe**: Full TypeScript coverage

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| Port 4000 in use | Kill process: `lsof -i :4000` |
| Port 3000 in use | Kill process: `lsof -i :3000` |
| DB connection failed | Check docker-compose status |
| Products not showing | Verify seeder ran successfully |
| Images not loading | Check internet (placeholders.com) |
| Cart not persisting | Check localStorage in DevTools |

## 📚 Documentation

- [API Design Documentation](apps/api/src/modules/products/DESIGN.md)
- [Seeder Documentation](apps/api/src/database/seeders/README.md)
- [Storefront Implementation](apps/storefront/IMPLEMENTATION.md)

## 🚀 Next Phase: Orders & Checkout

Ready to build:
1. **Orders Module** - Order entity, cart to order conversion
2. **Checkout Page** - Product review, shipping, payment
3. **Payment Integration** - Chapa integration
4. **Order Management** - Track orders, confirmations

## 💡 Tips

- Use Swagger at `http://localhost:4000/api` to test API endpoints
- React Query DevTools available (add in development)
- Turbo speeds up builds with caching
- All types in shared packages for reusability

## ✅ Checklist

- [x] Backend API with product CRUD
- [x] Database schema and seeding
- [x] Product listing page
- [x] Product detail page
- [x] Filtering and search
- [x] Variant selection
- [x] Cart integration
- [ ] Checkout flow
- [ ] Payment gateway
- [ ] Admin dashboard
- [ ] Orders module
- [ ] User authentication (frontend)
- [ ] Reviews system
- [ ] Recommendations

---

**Ready to start development?** Follow the 5-step Quick Start above! 🎉
