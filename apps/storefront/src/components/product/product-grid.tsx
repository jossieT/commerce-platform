'use client';

import { Product } from '@/lib/products-api';
import { ProductCard } from './product-card';
import { motion } from 'framer-motion';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

export function ProductGrid({ products, isLoading }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            className="bg-brand-200 rounded-xl h-96 overflow-hidden"
          >
            <div className="w-full aspect-square bg-gradient-to-r from-brand-200 via-brand-100 to-brand-200 animate-pulse" />
            <div className="p-5 space-y-3">
              <div className="h-4 bg-brand-200 rounded w-24" />
              <div className="h-5 bg-brand-200 rounded w-full" />
              <div className="h-4 bg-brand-200 rounded w-32" />
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-100 mb-4">
          <span className="text-2xl">📦</span>
        </div>
        <p className="text-lg font-semibold text-brand-900">No products found</p>
        <p className="text-brand-600 mt-2">Try adjusting your filters or search criteria</p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
}
