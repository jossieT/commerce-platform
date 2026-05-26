/**
 * Related Products Section
 * Display related products carousel for cross-selling
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Heart } from 'lucide-react';
import { Product } from '@/types/product';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface RelatedProductsProps {
  products: Product[];
  title?: string;
}

interface ProductCardProps {
  product: Product;
  index?: number;
}

function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const discountPercent = product.discount
    ? Math.round(product.discount)
    : null;

  return (
    <Link href={`/products/${product.slug}`}>
      <motion.div
        className="group relative rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/50 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 h-full cursor-pointer"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        viewport={{ once: true }}
        whileHover={{ y: -4 }}
      >
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-slate-200 dark:from-slate-800 to-slate-300 dark:to-slate-900">
          <Image
            src={product.images[0].url}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            quality={80}
          />

          {/* Discount Badge */}
          {discountPercent && (
            <motion.div
              className="absolute top-4 right-4 px-3 py-1 rounded-full bg-red-500/90 text-white text-xs font-bold backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 + 0.2 }}
            >
              -{discountPercent}%
            </motion.div>
          )}

          {/* Wishlist Button */}
          <motion.button
            onClick={(e) => {
              e.preventDefault();
              setIsFavorite(!isFavorite);
            }}
            className="absolute top-4 left-4 p-2 rounded-full bg-slate-900/10 hover:bg-slate-900/20 dark:bg-white/10 dark:hover:bg-white/20 text-slate-900 dark:text-white transition-all duration-300 backdrop-blur-sm opacity-0 group-hover:opacity-100"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Heart
              className={`w-5 h-5 ${isFavorite ? 'fill-current text-red-400' : ''}`}
            />
          </motion.button>

          {/* Stock Badge */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
              <span className="text-white font-semibold">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Category */}
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wider">
            {product.category}
          </p>

          {/* Title */}
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
            {product.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.round(product.rating.average)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-slate-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-slate-600 dark:text-slate-400">
              ({product.rating.count})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-slate-600 dark:text-slate-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Hover Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-slate-900/60 dark:from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        >
          <motion.div
            className="w-full p-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium text-sm text-center"
            initial={{ y: 20, opacity: 0 }}
            whileHover={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            View Details
          </motion.div>
        </motion.div>
      </motion.div>
    </Link>
  );
}

export function RelatedProducts({
  products,
  title = 'Related Products',
}: RelatedProductsProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');

  const itemsPerView = isMobile ? 1 : isTablet ? 2 : 4;

  const handleScroll = (direction: 'left' | 'right') => {
    const scrollAmount = 320 * itemsPerView;
    const newPosition =
      direction === 'left'
        ? Math.max(0, scrollPosition - scrollAmount)
        : scrollPosition + scrollAmount;
    setScrollPosition(newPosition);
  };

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-slate-200 dark:border-slate-800/50 pt-12">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        viewport={{ once: true }}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h2>
          {products.length > itemsPerView && !isMobile && (
            <div className="flex gap-2">
              <motion.button
                onClick={() => handleScroll('left')}
                className="p-2 rounded-full bg-slate-300 dark:bg-slate-800/50 hover:bg-slate-400 dark:hover:bg-slate-700 text-slate-900 dark:text-white transition-colors duration-300 disabled:opacity-50"
                disabled={scrollPosition === 0}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>
              <motion.button
                onClick={() => handleScroll('right')}
                className="p-2 rounded-full bg-slate-300 dark:bg-slate-800/50 hover:bg-slate-400 dark:hover:bg-slate-700 text-slate-900 dark:text-white transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.slice(0, 8).map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {/* View All Link */}
        {products.length > itemsPerView && (
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Link href="/products">
              <motion.button
                className="px-6 py-3 rounded-lg border border-slate-300 dark:border-slate-700/50 hover:border-slate-400 dark:hover:border-slate-600 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50 font-medium transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Explore All Products
              </motion.button>
            </Link>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
