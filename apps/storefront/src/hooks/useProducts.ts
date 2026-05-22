import { useQuery } from '@tanstack/react-query';
import { productsApi, ProductQueryParams } from '@/lib/products-api';

export const useProducts = (params?: ProductQueryParams) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productsApi.getProducts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useProduct = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productsApi.getProduct(id),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
};

export const useProductBySlug = (slug: string, enabled = true) => {
  return useQuery({
    queryKey: ['product-slug', slug],
    queryFn: () => productsApi.getProductBySlug(slug),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
};

export const useSearchProducts = (searchTerm: string) => {
  return useQuery({
    queryKey: ['search-products', searchTerm],
    queryFn: () => productsApi.searchProducts(searchTerm),
    enabled: searchTerm.length > 0,
    staleTime: 5 * 60 * 1000,
  });
};

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ['featured-products'],
    queryFn: () => productsApi.getFeaturedProducts(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useRelatedProducts = (productId: string) => {
  return useQuery({
    queryKey: ['related-products', productId],
    queryFn: () => productsApi.getRelatedProducts(productId),
    staleTime: 10 * 60 * 1000,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => productsApi.getCategories(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};
