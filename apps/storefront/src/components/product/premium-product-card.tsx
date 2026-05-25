'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart } from 'lucide-react';
import { Product } from '@/lib/products-api';
import { useCartStore } from '@/store/cart.store';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface PremiumProductCardProps {
  product: Product;
  index?: number;
}

export function PremiumProductCard({ product, index = 0 }: PremiumProductCardProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const [isAdding, setIsAdding] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const primaryVariant = product.variants[0];
  const thumbnailImage = product.images.find((img) => img.isThumbnail) || product.images[0];

  const price = Number(primaryVariant?.price || 0);

  const isOutOfStock = primaryVariant?.stock === 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    
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

  const handleBuyNow = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    
    setIsBuying(true);

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
      
      router.push('/cart');
    } catch {
      setIsBuying(false);
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  // Staggered reveal based on index
  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: index * 0.15,
        ease: [0.21, 0.47, 0.32, 0.98], // Custom ease-out curve for premium feel
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants as any}
      className="group relative flex flex-col h-full"
    >
      <Link href={`/products/${product.slug}`} className="flex flex-col h-full cursor-pointer">
        
        {/* Image Container */}
        <div className="relative w-full aspect-[3/4] overflow-hidden bg-brand-50 rounded-lg mb-4">
          {thumbnailImage?.url ? (
            <Image
              src={thumbnailImage.url}
              alt={thumbnailImage.altText || product.name}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              priority={index < 4}
            />
          ) : (
            <div className="w-full h-full bg-brand-100 flex items-center justify-center">
              <span className="text-brand-400 text-sm">No Image</span>
            </div>
          )}

          {/* Quick Actions overlay */}
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="absolute bottom-4 left-0 right-0 px-4 flex justify-between items-center translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out gap-2">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || isAdding || isBuying}
              title="Add to Cart"
              className={`p-3 backdrop-blur-md bg-white/90 text-brand-900 rounded-full shadow-lg hover:bg-white transition-colors
                ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {isAdding ? (
                <div className="w-4 h-4 border-2 border-brand-900 border-t-transparent rounded-full animate-spin" />
              ) : (
                <ShoppingBag size={18} />
              )}
            </button>

            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock || isAdding || isBuying}
              className={`flex-1 py-3 px-4 backdrop-blur-md bg-brand-900/90 text-white text-sm font-semibold rounded-full shadow-lg flex items-center justify-center hover:bg-brand-900 transition-colors
                ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {isBuying ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isOutOfStock ? (
                <span>Sold Out</span>
              ) : (
                <span>Buy Now</span>
              )}
            </button>
            
            <button
              onClick={handleWishlist}
              title="Add to Wishlist"
              className="p-3 backdrop-blur-md bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors"
              aria-label="Add to wishlist"
            >
              <Heart
                size={18}
                className={`transition-colors duration-300 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-brand-900'}`}
              />
            </button>
          </div>
        </div>

        {/* Content Container */}
        <div className="flex flex-col flex-1 px-1">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-sm font-semibold text-brand-900 line-clamp-1 group-hover:underline underline-offset-4 decoration-1 decoration-brand-300 transition-all">
              {product.name}
            </h3>
            <span className="text-sm font-medium text-brand-900 ml-4">
              ${price.toFixed(2)}
            </span>
          </div>
          
          <p className="text-xs text-brand-500 uppercase tracking-wider">
            {product.category.name}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
