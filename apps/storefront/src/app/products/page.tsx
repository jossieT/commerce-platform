'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useProducts, useCategories } from '@/hooks/useProducts';
import { ProductSearch } from '@/components/product/product-search';
import { ProductFilters } from '@/components/product/product-filters';
import { ProductGrid } from '@/components/product/product-grid';

function ProductsContent() {
  const searchParams = useSearchParams();
  const { data: productsData, isLoading } = useProducts({
    page: parseInt(searchParams.get('page') || '1'),
    limit: 20,
    search: searchParams.get('search') || undefined,
    category: searchParams.get('category') || undefined,
    sortBy: (searchParams.get('sortBy') as any) || undefined,
    minPrice: searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : undefined,
    maxPrice: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined,
    featured: searchParams.get('featured') === 'true' ? true : undefined,
    inStock: searchParams.get('inStock') === 'true' ? true : undefined,
  });

  const { data: categories = [] } = useCategories();

  return (
    <div className="space-y-8">
      {/* Search */}
      <div>
        <ProductSearch />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <ProductFilters categories={categories} />
        </div>

        {/* Products */}
        <div className="lg:col-span-3">
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              {productsData?.pagination ? (
                <>
                  Showing {((productsData.pagination.page - 1) * productsData.pagination.limit) + 1} -{' '}
                  {Math.min(productsData.pagination.page * productsData.pagination.limit, productsData.pagination.total)} of{' '}
                  {productsData.pagination.total} products
                </>
              ) : (
                'Loading...'
              )}
            </p>
          </div>

          <ProductGrid products={productsData?.data || []} isLoading={isLoading} />

          {/* Pagination */}
          {productsData?.pagination && productsData.pagination.pages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              {Array.from({ length: productsData.pagination.pages }).map((_, i) => (
                <a
                  key={i + 1}
                  href={`/products?page=${i + 1}${searchParams.toString() ? `&${searchParams.toString()}` : ''}`}
                  className={`px-4 py-2 rounded border ${
                    productsData.pagination.page === i + 1
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {i + 1}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shop</h1>
          <p className="text-gray-600 mt-2">Browse our collection of products</p>
        </div>

        <Suspense fallback={<div className="text-center py-12">Loading products...</div>}>
          <ProductsContent />
        </Suspense>
      </div>
    </div>
  );
}
