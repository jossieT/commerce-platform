'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
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
      {/* Search Section */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ProductSearch />
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          <ProductFilters categories={categories} />
        </motion.div>

        {/* Products Section */}
        <div className="lg:col-span-3 space-y-6">
          {/* Results Header */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex items-center justify-between"
          >
            <p className="text-sm font-medium text-brand-600">
              {productsData?.pagination ? (
                <>
                  <span className="text-brand-900 dark:text-white font-semibold">{productsData.pagination.total}</span> products
                  {productsData.pagination.page > 1 && (
                    <>
                      {' '} • Page <span className="text-brand-900 dark:text-white font-semibold">{productsData.pagination.page}</span>
                    </>
                  )}
                </>
              ) : (
                'Loading products...'
              )}
            </p>
          </motion.div>

          {/* Products Grid */}
          <ProductGrid products={productsData?.data || []} isLoading={isLoading} />

          {/* Pagination */}
          {productsData?.pagination && productsData.pagination.pages > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="mt-12 flex justify-center gap-2"
            >
              {/* Previous Button */}
              {productsData.pagination.page > 1 && (
                <a
                  href={`/products?page=${productsData.pagination.page - 1}${searchParams.toString() ? `&${searchParams.toString()}` : ''}`}
                  className="px-4 py-2.5 rounded-lg border border-brand-200 dark:border-gray-700 text-brand-900 dark:text-white hover:bg-brand-50 dark:hover:bg-gray-800 transition-colors font-medium text-sm"
                >
                  ← Previous
                </a>
              )}

              {/* Page Numbers */}
              <div className="flex gap-1">
                {Array.from({ length: Math.min(7, productsData.pagination.pages) }).map((_, i) => {
                  let pageNum = i + 1;
                  if (productsData.pagination.pages > 7 && i >= 3) {
                    pageNum = productsData.pagination.pages - (6 - i);
                  }
                  if (pageNum < 1 || pageNum > productsData.pagination.pages) return null;

                  const isActive = productsData.pagination.page === pageNum;

                  return (
                    <a
                      key={pageNum}
                      href={`/products?page=${pageNum}${searchParams.toString() ? `&${searchParams.toString()}` : ''}`}
                      className={`px-3 py-2.5 rounded-lg font-medium text-sm transition-all ${
                        isActive
                          ? 'bg-brand-800 text-white shadow-md dark:bg-brand-600'
                          : 'border border-brand-200 dark:border-gray-700 text-brand-900 dark:text-gray-300 hover:bg-brand-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      {pageNum}
                    </a>
                  );
                })}
              </div>

              {/* Next Button */}
              {productsData.pagination.page < productsData.pagination.pages && (
                <a
                  href={`/products?page=${productsData.pagination.page + 1}${searchParams.toString() ? `&${searchParams.toString()}` : ''}`}
                  className="px-4 py-2.5 rounded-lg border border-brand-200 dark:border-gray-700 text-brand-900 dark:text-white hover:bg-brand-50 dark:hover:bg-gray-800 transition-colors font-medium text-sm"
                >
                  Next →
                </a>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-brand-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Compact Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-brand-200 dark:border-gray-700 transition-colors duration-200">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="container-max px-4 sm:px-6 lg:px-8 py-6 md:py-8"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-brand-900 dark:text-white">
            Shop
          </h1>
          <p className="text-brand-600 dark:text-gray-300 text-sm mt-1">
            {/* Minimal, clean subtitle */}
            Browse our collection of premium products
          </p>
        </motion.div>
      </div>

      {/* Content Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="section-padding"
      >
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<div className="text-center py-12 text-brand-600 dark:text-gray-400">Loading products...</div>}>
            <ProductsContent />
          </Suspense>
        </div>
      </motion.div>
    </div>
  );
}
