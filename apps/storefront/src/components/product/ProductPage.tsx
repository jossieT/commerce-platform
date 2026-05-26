/**
 * Product Page Component
 * Full product details page with hero, info, reviews, and related products
 */

'use client';

import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Product } from '@/types/product';
import { ProductHero } from '@/components/product/ProductHero';
import { ProductInfo } from '@/components/product/ProductInfo';
import { ReviewsSection } from '@/components/product/ReviewsSection';
import { RelatedProducts } from '@/components/product/RelatedProducts';

interface ProductPageProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductPage({ product, relatedProducts }: ProductPageProps) {
  const handleAddToCart = useCallback(
    (config: { productId: string; quantity: number; variants: Record<string, string> }) => {
      console.log('Add to cart:', config);
      // Dispatch to cart store
      // const cartStore = useCartStore();
      // cartStore.addItem({...config});
    },
    []
  );

  const handleAddToWishlist = useCallback((productId: string) => {
    console.log('Add to wishlist:', productId);
    // Dispatch to wishlist store
  }, []);

  const handleShare = useCallback((product: Product) => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: product.description,
        url: `/products/${product.slug}`,
      });
    } else {
      console.log('Share not supported on this platform');
    }
  }, []);

  const handleLeaveReview = useCallback(() => {
    console.log('Open review form');
    // Open review modal
  }, []);

  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4,
      },
    },
  };

  return (
    <motion.main
      className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Product Hero Section */}
      <section className="border-b border-slate-200 dark:border-slate-800/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <ProductHero
            product={product}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
            onShare={handleShare}
          />
        </div>
      </section>

      {/* Product Information Section */}
      <section className="border-b border-slate-200 dark:border-slate-800/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <ProductInfo product={product} />
        </div>
      </section>

      {/* Reviews Section */}
      {product.rating && (
        <section className="border-b border-slate-200 dark:border-slate-800/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <ReviewsSection
              rating={product.rating}
              reviews={product.reviews}
              onLeaveReview={handleLeaveReview}
            />
          </div>
        </section>
      )}

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <RelatedProducts products={relatedProducts} title="You Might Also Like" />
          </div>
        </section>
      )}

      {/* Footer Spacing */}
      <div className="h-20" />
    </motion.main>
  );
}
