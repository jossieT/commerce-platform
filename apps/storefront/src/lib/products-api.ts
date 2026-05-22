import { api } from './api';

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  attributes: Record<string, string>;
  imageUrl?: string;
  isActive: boolean;
}

export interface ProductImage {
  id: string;
  url: string;
  altText?: string;
  displayOrder: number;
  isThumbnail: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  category: Category;
  basePrice: number;
  images: ProductImage[];
  variants: ProductVariant[];
  tags: string[];
  isPublished: boolean;
  isFeatured: boolean;
  rating: number;
  reviewCount: number;
  viewCount: number;
  salesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  data: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sortBy?: 'createdAt' | 'rating' | 'price' | 'sales' | 'views';
  sortOrder?: 'ASC' | 'DESC';
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  inStock?: boolean;
  published?: boolean;
  tags?: string[];
}

export const productsApi = {
  // Get all products with filters
  getProducts: async (params?: ProductQueryParams) => {
    const { data } = await api.get<ProductsResponse>('/products', { params });
    return data;
  },

  // Get product by ID
  getProduct: async (id: string) => {
    const { data } = await api.get<{ data: Product }>(`/products/id/${id}`);
    return data.data;
  },

  // Get product by slug
  getProductBySlug: async (slug: string) => {
    const { data } = await api.get<{ data: Product }>(`/products/${slug}`);
    return data.data;
  },

  // Search products
  searchProducts: async (searchTerm: string, limit = 20) => {
    const { data } = await api.get<{ data: Product[] }>('/products/search', {
      params: { q: searchTerm, limit },
    });
    return data.data;
  },

  // Get featured products
  getFeaturedProducts: async (limit = 10) => {
    const { data } = await api.get<{ data: Product[] }>('/products/featured', {
      params: { limit },
    });
    return data.data;
  },

  // Get related products
  getRelatedProducts: async (productId: string, limit = 5) => {
    const { data } = await api.get<{ data: Product[] }>(
      `/products/${productId}/related`,
      { params: { limit } },
    );
    return data.data;
  },

  // Get all categories
  getCategories: async () => {
    const { data } = await api.get<{ data: Category[] }>('/products/categories');
    return data.data;
  },

  // Get category by ID
  getCategory: async (id: string) => {
    const { data } = await api.get<{ data: Category }>(`/products/categories/${id}`);
    return data.data;
  },
};
