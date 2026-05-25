# Product Page - Implementation & Usage Guide

## Quick Start

### 1. Import Components

```typescript
// In your page or component
import { ProductPage } from '@/components/product';
import { getProductBySlug, getRelatedProducts } from '@/lib/data/products';
```

### 2. Basic Implementation

```typescript
export default async function ProductRoute({ params }) {
  // Fetch product
  const product = await getProductBySlug(params.slug);
  
  if (!product) {
    notFound();
  }

  // Fetch related products
  const relatedProducts = await getRelatedProducts(product.relatedProductIds);

  return <ProductPage product={product} relatedProducts={relatedProducts} />;
}
```

---

## Component Usage Examples

### Using ProductHero Standalone

```tsx
import { ProductHero } from '@/components/product';

export function MyProductPage() {
  const handleAddToCart = (config) => {
    console.log('Add to cart:', config);
    // { productId: string, quantity: number, variants: {} }
  };

  return (
    <ProductHero
      product={product}
      onAddToCart={handleAddToCart}
      onAddToWishlist={(id) => console.log('Wishlist:', id)}
      onShare={(product) => console.log('Share:', product)}
    />
  );
}
```

### Using ProductGallery Standalone

```tsx
import { ProductGallery } from '@/components/product';

export function GalleryDemo() {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  return (
    <ProductGallery
      images={product.images}
      title={product.title}
      onImageChange={(index) => setSelectedImageIndex(index)}
    />
  );
}
```

### Using VariantSelector Standalone

```tsx
import { VariantSelector } from '@/components/product';
import { useState } from 'react';

export function VariantDemo() {
  const [selectedVariants, setSelectedVariants] = useState({});

  const handleSelect = (optionId, variantId) => {
    setSelectedVariants(prev => ({
      ...prev,
      [optionId]: variantId
    }));
  };

  return (
    <div className="space-y-6">
      {product.options.map(option => (
        <VariantSelector
          key={option.id}
          option={option}
          selectedVariantId={selectedVariants[option.id]}
          onSelect={(variantId) => handleSelect(option.id, variantId)}
        />
      ))}
    </div>
  );
}
```

### Using ReviewsSection Standalone

```tsx
import { ReviewsSection } from '@/components/product';

export function ReviewsDemo() {
  const handleLeaveReview = () => {
    // Open review modal
    console.log('Open review form');
  };

  return (
    <ReviewsSection
      rating={product.rating}
      reviews={product.reviews}
      onLeaveReview={handleLeaveReview}
    />
  );
}
```

### Using RelatedProducts Standalone

```tsx
import { RelatedProducts } from '@/components/product';

export function RelatedDemo() {
  return (
    <RelatedProducts
      products={relatedProducts}
      title="You Might Also Like"
    />
  );
}
```

---

## Data Schema Examples

### Complete Product Example

```typescript
const exampleProduct: Product = {
  id: '1',
  slug: 'apex-pro-wireless',
  title: 'Apex Pro Wireless',
  category: 'Electronics',
  subcategory: 'Audio',
  description: 'Premium wireless headphones with active noise cancellation...',
  price: 399,
  originalPrice: 499,
  discount: 20,
  currency: 'USD',
  images: [
    {
      id: '1',
      url: 'https://example.com/product1.jpg',
      alt: 'Product front view',
      width: 1200,
      height: 1200,
      thumbnail: 'https://example.com/product1-thumb.jpg',
      priority: true
    }
  ],
  rating: {
    average: 4.8,
    count: 2847,
    distribution: { 5: 2200, 4: 500, 3: 100, 2: 30, 1: 17 }
  },
  reviews: [
    {
      id: '1',
      author: 'John Doe',
      avatar: 'https://example.com/avatar.jpg',
      rating: 5,
      title: 'Excellent product',
      content: 'Best headphones I\'ve ever owned...',
      date: '2 weeks ago',
      verified: true,
      helpful: 342
    }
  ],
  options: [
    {
      id: 'color',
      name: 'Color',
      type: 'color',
      required: true,
      variants: [
        {
          id: 'midnight',
          name: 'Midnight Black',
          value: 'Midnight Black',
          type: 'color',
          available: true,
          colorCode: '#1a1a1a'
        }
      ]
    }
  ],
  specifications: [
    { label: 'Driver Size', value: '50mm' },
    { label: 'Connectivity', value: ['Bluetooth 5.3', '3.5mm jack'] }
  ],
  features: [
    {
      id: '1',
      title: 'Active Noise Cancellation',
      description: 'Advanced ANC technology...',
      icon: '🔇'
    }
  ],
  inStock: true,
  stockCount: 156,
  sku: 'APEX-PRO-WL-001',
  weight: 285,
  dimensions: { length: 190, width: 175, height: 85 },
  shipping: {
    free: true,
    estimatedDays: 2,
    message: 'Free express shipping'
  },
  warranty: {
    duration: '2 Years',
    description: 'Hardware warranty covering defects'
  },
  returns: {
    days: 30,
    description: '30-day money-back guarantee'
  },
  relatedProductIds: ['product2', 'product3', 'product4'],
  metadata: {
    seoTitle: 'Apex Pro Wireless | Premium Audio',
    seoDescription: 'Premium wireless headphones with ANC...',
    keywords: ['wireless', 'headphones', 'audio']
  },
  createdAt: '2025-06-15',
  updatedAt: '2026-05-20'
};
```

---

## Store Integration Examples

### Cart Store (Zustand)

```typescript
// store/cart.store.ts
import { create } from 'zustand';
import { CartItem } from '@/types/product';

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  addItem: (item) => set((state) => ({
    items: [...state.items, item]
  })),
  removeItem: (productId) => set((state) => ({
    items: state.items.filter(item => item.productId !== productId)
  })),
  updateQuantity: (productId, quantity) => set((state) => ({
    items: state.items.map(item =>
      item.productId === productId ? { ...item, quantity } : item
    )
  }))
}));
```

### Usage in Product Page

```typescript
export function ProductPage({ product, relatedProducts }: ProductPageProps) {
  const cartStore = useCartStore();

  const handleAddToCart = (config) => {
    cartStore.addItem({
      productId: config.productId,
      quantity: config.quantity,
      selectedOptions: Object.entries(config.variants).map(([optionId, variantId]) => ({
        optionId,
        variantId
      })),
      priceAtAdding: product.price
    });

    // Show toast notification
    showNotification('Added to cart!');
  };

  return (
    <ProductHero
      product={product}
      onAddToCart={handleAddToCart}
      // ...
    />
  );
}
```

### Wishlist Store (Zustand)

```typescript
// store/wishlist.store.ts
interface WishlistStore {
  items: string[]; // product IDs
  add: (productId: string) => void;
  remove: (productId: string) => void;
  toggle: (productId: string) => void;
  has: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  items: [],
  add: (productId) => set((state) => ({
    items: [...state.items, productId]
  })),
  remove: (productId) => set((state) => ({
    items: state.items.filter(id => id !== productId)
  })),
  toggle: (productId) => {
    const { has, add, remove } = get();
    has(productId) ? remove(productId) : add(productId);
  },
  has: (productId) => get().items.includes(productId)
}));
```

---

## API Integration Examples

### REST API

```typescript
// lib/data/products.ts

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${slug}`,
      { cache: 'revalidate', next: { revalidate: 3600 } }
    );
    
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return null;
  }
}

export async function getRelatedProducts(productIds: string[]): Promise<Product[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/related`,
      {
        method: 'POST',
        body: JSON.stringify({ productIds }),
        cache: 'revalidate',
        next: { revalidate: 3600 }
      }
    );
    
    if (!response.ok) return [];
    return response.json();
  } catch (error) {
    console.error('Failed to fetch related products:', error);
    return [];
  }
}
```

### GraphQL API

```typescript
// lib/graphql/queries.ts
import { gql } from 'graphql-request';

export const GET_PRODUCT_BY_SLUG = gql`
  query GetProductBySlug($slug: String!) {
    product(slug: $slug) {
      id
      slug
      title
      description
      price
      originalPrice
      images {
        id
        url
        alt
        width
        height
      }
      rating {
        average
        count
      }
      reviews {
        id
        author
        rating
        content
        verified
      }
      options {
        id
        name
        type
        variants {
          id
          name
          value
          available
          colorCode
        }
      }
      relatedProductIds
    }
  }
`;

// Usage
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const client = new GraphQLClient(process.env.NEXT_PUBLIC_GRAPHQL_URL!);
  
  try {
    const data = await client.request(GET_PRODUCT_BY_SLUG, { slug });
    return data.product;
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return null;
  }
}
```

---

## Environment Variables

Create `.env.local`:

```env
# API
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_BASE_URL=https://example.com

# Image CDN
NEXT_PUBLIC_IMAGE_CDN=https://cdn.example.com

# Analytics (optional)
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id

# Third-party services
NEXT_PUBLIC_STRIPE_KEY=your_stripe_key
NEXT_PUBLIC_SHARE_API_KEY=your_share_key
```

---

## Testing Examples

### Component Test (Jest)

```typescript
// __tests__/ProductGallery.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductGallery } from '@/components/product';

describe('ProductGallery', () => {
  const mockImages = [
    {
      id: '1',
      url: 'image1.jpg',
      alt: 'Product 1',
      width: 1200,
      height: 1200
    },
    {
      id: '2',
      url: 'image2.jpg',
      alt: 'Product 2',
      width: 1200,
      height: 1200
    }
  ];

  it('should display images', () => {
    render(
      <ProductGallery images={mockImages} title="Test Product" />
    );
    expect(screen.getByAltText('Product 1')).toBeInTheDocument();
  });

  it('should switch to next image on arrow click', () => {
    const { getByLabelText } = render(
      <ProductGallery images={mockImages} title="Test Product" />
    );
    
    const nextButton = getByLabelText('Next image');
    fireEvent.click(nextButton);
    
    expect(screen.getByAltText('Product 2')).toBeInTheDocument();
  });

  it('should call onImageChange callback', () => {
    const mockCallback = jest.fn();
    const { getByLabelText } = render(
      <ProductGallery
        images={mockImages}
        title="Test Product"
        onImageChange={mockCallback}
      />
    );
    
    fireEvent.click(getByLabelText('Next image'));
    expect(mockCallback).toHaveBeenCalledWith(1);
  });
});
```

### E2E Test (Playwright)

```typescript
// e2e/product-page.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Product Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/products/apex-pro-wireless');
  });

  test('should load product details', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Apex Pro Wireless');
    await expect(page.locator('text=In Stock')).toBeVisible();
  });

  test('should select variant and add to cart', async ({ page }) => {
    // Select color variant
    await page.click('button:has-text("Midnight Black")');
    
    // Increase quantity
    await page.click('button:has-text("+")');
    
    // Add to cart
    await page.click('button:has-text("Add to Cart")');
    
    // Verify feedback
    await expect(page.locator('text=Added to Cart')).toBeVisible();
  });

  test('should navigate gallery', async ({ page }) => {
    const nextButton = page.locator('[aria-label="Next image"]');
    
    // Initial image
    const img1 = page.locator('img[alt*="Front View"]');
    await expect(img1).toBeVisible();
    
    // Click next
    await nextButton.click();
    
    // Verify next image
    const img2 = page.locator('img[alt*="Side View"]');
    await expect(img2).toBeVisible();
  });

  test('should add to wishlist', async ({ page }) => {
    const wishlistButton = page.locator('[aria-label="Add to wishlist"]');
    
    await wishlistButton.click();
    await expect(wishlistButton.locator('svg')).toHaveClass(/fill-current/);
  });
});
```

---

## Performance Optimization Checklist

- [ ] Images optimized with Next.js Image component
- [ ] Thumbnails use smaller resolution
- [ ] Lazy loading enabled with viewport detection
- [ ] Animations use transform/opacity only
- [ ] Components split into separate files
- [ ] Code splitting for Framer Motion
- [ ] ISR configured with appropriate revalidate time
- [ ] Metadata generation optimized
- [ ] API responses cached appropriately
- [ ] Bundle size under 200KB (main route)

---

## Browser DevTools Tips

### Lighthouse Audit

1. Open DevTools → Lighthouse
2. Select "Performance"
3. Run audit
4. Target scores:
   - Performance: 90+
   - Accessibility: 95+
   - Best Practices: 95+
   - SEO: 100

### Network Analysis

1. DevTools → Network tab
2. Filter by "Fetch/XHR"
3. Check API response times
4. Verify image sizes
5. Look for unused assets

### React DevTools

1. Install React DevTools extension
2. Enable Profiler
3. Record user interactions
4. Analyze component render times
5. Look for unnecessary re-renders

---

## Debugging Guide

### Common Issues

**Issue**: Images not loading
```
Solution: 
- Check image URLs in mock data
- Verify Next.js Image optimization is enabled
- Check image width/height props
- Test with different image formats
```

**Issue**: Animations jerky
```
Solution:
- Reduce stagger delays
- Use will-change CSS property
- Check viewport settings
- Disable animations on mobile
```

**Issue**: State not updating
```
Solution:
- Check useState initialization
- Verify callback binding
- Check console for errors
- Inspect component props
```

**Issue**: Slow initial load
```
Solution:
- Implement code splitting
- Enable image optimization
- Use dynamic imports
- Check API response times
```

---

## Deployment Checklist

- [ ] Environment variables configured
- [ ] API endpoints updated to production
- [ ] SEO metadata verified
- [ ] Image CDN configured
- [ ] Error boundaries added
- [ ] Loading states implemented
- [ ] Performance optimized
- [ ] Accessibility audited
- [ ] Mobile tested on real devices
- [ ] Analytics integrated
- [ ] Error tracking (Sentry) configured
- [ ] Staging environment tested

---

## Support & Resources

- Component Storybook: `npm run storybook`
- Unit tests: `npm run test`
- E2E tests: `npm run test:e2e`
- Build analysis: `npm run analyze`
- Production build: `npm run build && npm run start`

