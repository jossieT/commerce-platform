export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentId?: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;           // e.g. "Red / XL"
  sku: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  attributes: Record<string, string>; // { color: "Red", size: "XL" }
  imageUrl?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  categoryId: string;
  category?: Category;
  images: string[];
  variants: ProductVariant[];
  basePrice: number;
  tags: string[];
  isPublished: boolean;
  isFeatured: boolean;
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductFilterQuery {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
  search?: string;
  featured?: boolean;
  inStock?: boolean;
}
