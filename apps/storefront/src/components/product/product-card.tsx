'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart } from 'lucide-react';
import { Product } from '@/lib/products-api';
import { useCartStore } from '@/store/cart.store';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [isAdding, setIsAdding] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const primaryVariant = product.variants[0];
  const thumbnailImage = product.images.find((img) => img.isThumbnail) || product.images[0];

  const price = Number(primaryVariant?.price || 0);
  const compareAtPrice = primaryVariant?.compareAtPrice ? Number(primaryVariant.compareAtPrice) : null;

  const discountPercentage =
    compareAtPrice && price < compareAtPrice
      ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
      : 0;

  const isOutOfStock = primaryVariant.stock === 0;
  const isLowStock = primaryVariant.stock > 0 && primaryVariant.stock <= 5;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAdding(true);

    try {
      addItem({
        productId: product.id,
        variantId: primaryVariant.id,
        name: product.name,
        variantName: primaryVariant.name,
        price: primaryVariant.price,
        imageUrl: thumbnailImage?.url,
        quantity: 1,
      });
      
      setTimeout(() => setIsAdding(false), 600);
    } catch {
      setIsAdding(false);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        delay: index * 0.08,
        ease: 'easeOut',
      },
    },
  };

  const imageVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.08, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  return (
    <motion.div
      variants={cardVariants as any}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      <Link href={`/products/${product.slug}`}>
        <motion.div className="group relative overflow-hidden rounded-xl border border-brand-200 bg-white shadow-sm hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
          {/* Image Container */}
          <div className="relative w-full aspect-square overflow-hidden bg-brand-50">
            <motion.div
              variants={imageVariants as any}
              initial="initial"
              whileHover="hover"
              className="relative w-full h-full"
            >
              {thumbnailImage?.url && (
                <Image
                  src={thumbnailImage.url}
                  alt={thumbnailImage.altText || product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority={index < 6}
                />
              )}

              {/* Overlay on hover */}
              <motion.div
                initial={{ opacity: 0, backgroundColor: 'rgba(0, 0, 0, 0)' }}
                whileHover={{ opacity: 1, backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              />
            </motion.div>

            {/* Discount Badge */}
            {discountPercentage > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: 12 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="absolute top-3 right-3 bg-brand-900 text-white px-2.5 py-1.5 rounded-full text-xs font-bold shadow-md"
              >
                Save {discountPercentage}%
              </motion.div>
            )}

            {/* Featured Badge */}
            {product.isFeatured && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: -12 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="absolute top-3 left-3 bg-accent-600 text-white px-2.5 py-1.5 rounded-full text-xs font-bold shadow-md"
              >
                Featured
              </motion.div>
            )}

            {/* Stock Status Overlay */}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center">
                <span className="text-brand-900 font-bold text-lg">Out of Stock</span>
              </div>
            )}

            {/* Wishlist Button */}
            <motion.button
              onClick={(e) => {
                e.preventDefault();
                setIsWishlisted(!isWishlisted);
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="absolute bottom-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm border border-brand-200 hover:border-brand-300 transition-all shadow-sm hover:shadow-md"
            >
              <Heart
                size={18}
                className={`transition-colors ${
                  isWishlisted
                    ? 'fill-red-500 text-red-500'
                    : 'text-brand-400 hover:text-brand-600'
                }`}
              />
            </motion.button>
          </div>

          {/* Content */}
          <div className="flex flex-col flex-1 p-4 sm:p-5">
            {/* Category & Rating Row */}
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-brand-600 uppercase tracking-widest">
                {product.category.name}
              </p>
              {product.rating > 0 && (
                <div className="flex items-center gap-1">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={`text-xs ${
                          i < Math.round(product.rating)
                            ? 'text-amber-400'
                            : 'text-brand-300'
                        }`}
                        role="img"
                        aria-label={`${Math.round(product.rating)} out of 5 stars`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-brand-600 ml-1">({product.reviewCount})</span>
                </div>
              )}
            </div>

            {/* Product Name */}
            <h3 className="text-lg font-bold text-brand-900 line-clamp-2 group-hover:text-accent-600 transition-colors mb-2 leading-snug">
              {product.name}
            </h3>

            {/* Short Description */}
            {product.shortDescription && (
              <p className="text-sm text-brand-600 line-clamp-1 mb-3">
                {product.shortDescription}
              </p>
            )}

            {/* Stock & Trust Signals */}
            <div className="flex flex-col gap-2 mb-4 text-xs">
              {isLowStock && (
                <motion.p
                  animate={{ opacity: [1, 0.7, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="font-semibold text-orange-600"
                >
                  ⏱ Only {primaryVariant.stock} left in stock!
                </motion.p>
              )}
              <div className="flex items-center gap-2 text-brand-600">
                <span>✓</span>
                <span>30-day returns</span>
              </div>
            </div>

            {/* Price Section */}
            <div className="mb-4 pt-4 border-t border-brand-200">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-brand-900">
                  ${price.toFixed(2)}
                </span>
                {compareAtPrice && (
                  <span className="text-sm text-brand-500 line-through">
                    ${compareAtPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {/* Add to Cart Button */}
            <motion.button
              onClick={handleAddToCart}
              disabled={isOutOfStock || isAdding}
              whileHover={!isOutOfStock && !isAdding ? { y: -2 } : {}}
              whileTap={!isOutOfStock && !isAdding ? { scale: 0.98 } : {}}
              className="w-full px-4 py-3 bg-brand-800 text-white font-semibold rounded-lg hover:bg-brand-900 disabled:bg-brand-300 disabled:cursor-not-allowed transition-colors shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand-600 focus:ring-offset-2 flex items-center justify-center gap-2 mt-auto"
            >
              {isAdding ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <ShoppingCart size={18} />
                  </motion.div>
                  <span>Adding...</span>
                </>
              ) : isOutOfStock ? (
                'Out of Stock'
              ) : (
                <>
                  <ShoppingCart size={18} />
                  <span>Add to Cart</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
