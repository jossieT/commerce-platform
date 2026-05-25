/**
 * Product Hero Section
 * Main product overview combining gallery, pricing, and options
 */

'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingCart,
  Heart,
  Share2,
  Check,
  AlertCircle,
} from 'lucide-react';
import { Product } from '@/types/product';
import { ProductGallery } from './ProductGallery';
import { VariantSelector } from './VariantSelector';

interface ProductHeroProps {
  product: Product;
  onAddToCart?: (config: { productId: string; quantity: number; variants: Record<string, string> }) => void;
  onAddToWishlist?: (productId: string) => void;
  onShare?: (product: Product) => void;
}

export function ProductHero({
  product,
  onAddToCart,
  onAddToWishlist,
  onShare,
}: ProductHeroProps) {
  const [selectedVariants, setSelectedVariants] = useState<
    Record<string, string>
  >({});
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const hasDiscount = product.originalPrice && product.discount;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  // Initialize required variants
  const initializeVariants = useCallback(() => {
    const initialized: Record<string, string> = {};
    product.options
      .filter((opt) => opt.required)
      .forEach((opt) => {
        const availableVariant = opt.variants.find((v) => v.available);
        if (availableVariant) {
          initialized[opt.id] = availableVariant.id;
        }
      });
    return initialized;
  }, [product.options]);

  // Check if all required variants are selected
  const areAllRequiredVariantsSelected = useCallback(() => {
    return product.options
      .filter((opt) => opt.required)
      .every((opt) => selectedVariants[opt.id]);
  }, [product.options, selectedVariants]);

  const handleVariantSelect = useCallback(
    (optionId: string, variantId: string) => {
      setSelectedVariants((prev) => ({
        ...prev,
        [optionId]: variantId,
      }));
    },
    []
  );

  const handleAddToCart = async () => {
    // Initialize required variants if not selected
    if (Object.keys(selectedVariants).length === 0) {
      const initialized = initializeVariants();
      setSelectedVariants(initialized);
    }

    if (!areAllRequiredVariantsSelected()) {
      alert('Please select all required options');
      return;
    }

    setIsAddingToCart(true);

    try {
      onAddToCart?.({
        productId: product.id,
        quantity,
        variants: selectedVariants,
      });

      // Show success feedback
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleAddToWishlist = () => {
    setIsFavorite(!isFavorite);
    onAddToWishlist?.(product.id);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <motion.section
      className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Left Column - Gallery */}
      <motion.div variants={itemVariants}>
        <ProductGallery
          images={product.images}
          title={product.title}
        />
      </motion.div>

      {/* Right Column - Details & Actions */}
      <motion.div className="flex flex-col" variants={itemVariants}>
        <div className="space-y-6">
          {/* Breadcrumb / Category */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <p className="text-sm text-blue-400 font-semibold uppercase tracking-wider">
              {product.category}
              {product.subcategory && ` / ${product.subcategory}`}
            </p>
          </motion.div>

          {/* Title */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
              {product.title}
            </h1>
          </motion.div>

          {/* Rating & Reviews */}
          <motion.div
            className="flex items-center gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-lg ${
                      i < Math.round(product.rating.average)
                        ? '⭐'
                        : '☆'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-slate-400">
                {product.rating.average.toFixed(1)} (
                {product.rating.count.toLocaleString()} reviews)
              </span>
            </div>
          </motion.div>

          {/* Price Section */}
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            <div className="flex items-baseline gap-4">
              <span className="text-5xl font-bold text-white">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-2xl text-slate-400 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                  <motion.span
                    className="px-3 py-1 rounded-lg bg-red-500/20 text-red-400 font-bold text-sm"
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                  >
                    Save {discountPercent}%
                  </motion.span>
                </>
              )}
            </div>
            {product.currency && (
              <p className="text-sm text-slate-400">{product.currency}</p>
            )}
          </motion.div>

          {/* Stock Status */}
          <motion.div
            className={`flex items-center gap-2 ${
              product.inStock ? 'text-green-400' : 'text-red-400'
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {product.inStock ? (
              <>
                <Check className="w-5 h-5" />
                <span className="font-medium">
                  In Stock ({product.stockCount} available)
                </span>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Out of Stock</span>
              </>
            )}
          </motion.div>

          {/* Divider */}
          <motion.div
            className="h-px bg-gradient-to-r from-slate-700/50 to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.35 }}
          />

          {/* Variant Selectors */}
          {product.options.length > 0 && (
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {product.options.map((option) => (
                <VariantSelector
                  key={option.id}
                  option={option}
                  selectedVariantId={selectedVariants[option.id]}
                  onSelect={(variantId) =>
                    handleVariantSelect(option.id, variantId)
                  }
                />
              ))}
            </motion.div>
          )}

          {/* Quantity Selector */}
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
          >
            <label className="text-sm font-semibold text-white">
              Quantity
            </label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-lg bg-slate-800/50 hover:bg-slate-700 text-white transition-colors duration-300"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-12 text-center text-lg font-semibold text-white">
                {quantity}
              </span>
              <button
                onClick={() =>
                  setQuantity(Math.min(product.stockCount, quantity + 1))
                }
                className="w-10 h-10 rounded-lg bg-slate-800/50 hover:bg-slate-700 text-white transition-colors duration-300"
                disabled={quantity >= product.stockCount}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="space-y-3 pt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {/* Add to Cart Button */}
            <motion.button
              onClick={handleAddToCart}
              disabled={!product.inStock || isAddingToCart}
              className={`w-full py-4 rounded-lg font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                addedToCart
                  ? 'bg-green-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              whileHover={product.inStock ? { scale: 1.02 } : {}}
              whileTap={product.inStock ? { scale: 0.98 } : {}}
            >
              <ShoppingCart className="w-5 h-5" />
              {isAddingToCart
                ? 'Adding to Cart...'
                : addedToCart
                  ? 'Added to Cart!'
                  : 'Add to Cart'}
            </motion.button>

            {/* Buy Now Button */}
            <motion.button
              disabled={!product.inStock}
              className="w-full py-4 rounded-lg font-bold text-lg transition-all duration-300 border border-white/20 hover:border-white/40 text-white hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={product.inStock ? { scale: 1.02 } : {}}
              whileTap={product.inStock ? { scale: 0.98 } : {}}
            >
              Buy Now
            </motion.button>
          </motion.div>

          {/* Secondary Actions */}
          <motion.div
            className="flex gap-3 pt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
          >
            {/* Wishlist Button */}
            <motion.button
              onClick={handleAddToWishlist}
              className="flex-1 py-3 rounded-lg border border-white/20 hover:border-white/40 text-white hover:bg-white/5 transition-all duration-300 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              aria-label="Add to wishlist"
            >
              <Heart
                className={`w-5 h-5 ${
                  isFavorite ? 'fill-current text-red-400' : ''
                }`}
              />
              <span className="hidden sm:inline">
                {isFavorite ? 'In Wishlist' : 'Save'}
              </span>
            </motion.button>

            {/* Share Button */}
            <motion.button
              onClick={() => onShare?.(product)}
              className="flex-1 py-3 rounded-lg border border-white/20 hover:border-white/40 text-white hover:bg-white/5 transition-all duration-300 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              aria-label="Share product"
            >
              <Share2 className="w-5 h-5" />
              <span className="hidden sm:inline">Share</span>
            </motion.button>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            className="grid grid-cols-2 gap-3 pt-6 border-t border-slate-800/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="text-center text-sm">
              <p className="text-slate-400">Free Shipping</p>
              <p className="text-white font-semibold">On Orders Over $50</p>
            </div>
            <div className="text-center text-sm">
              <p className="text-slate-400">Easy Returns</p>
              <p className="text-white font-semibold">30-Day Guarantee</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.section>
  );
}
