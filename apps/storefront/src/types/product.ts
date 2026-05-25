/**
 * Product Type Definitions
 * Premium ecommerce product schema
 */

export interface ProductVariant {
  id: string;
  name: string;
  value: string;
  type: 'color' | 'size' | 'storage' | 'material' | 'style' | string;
  available: boolean;
  // For color variants
  colorCode?: string;
  colorName?: string;
  // For size/storage - can have specific pricing
  priceModifier?: number;
}

export interface ProductOption {
  id: string;
  name: string;
  type: 'color' | 'size' | 'storage' | 'material' | 'style' | string;
  variants: ProductVariant[];
  required: boolean;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  width: number;
  height: number;
  thumbnail?: string;
  priority?: boolean;
}

export interface ProductSpecification {
  label: string;
  value: string | string[];
}

export interface ProductFeature {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

export interface ProductReview {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  verified: boolean;
  helpful: number;
  images?: string[];
}

export interface ProductRating {
  average: number;
  count: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  category: string;
  subcategory?: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  currency: string;
  images: ProductImage[];
  rating: ProductRating;
  reviews: ProductReview[];
  options: ProductOption[];
  specifications: ProductSpecification[];
  features: ProductFeature[];
  inStock: boolean;
  stockCount: number;
  sku: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  shipping: {
    free: boolean;
    estimatedDays: number;
    message: string;
  };
  warranty?: {
    duration: string;
    description: string;
  };
  returns?: {
    days: number;
    description: string;
  };
  relatedProductIds: string[];
  metadata: {
    seoTitle: string;
    seoDescription: string;
    keywords: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  selectedOptions: {
    optionId: string;
    variantId: string;
  }[];
  priceAtAdding: number;
}
