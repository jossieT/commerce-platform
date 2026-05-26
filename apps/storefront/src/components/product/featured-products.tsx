'use client';

import { Product } from '@/lib/products-api';
import { PremiumProductCard } from './premium-product-card';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface FeaturedProductsProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  viewAllLink?: string;
}

export function FeaturedProducts({
  products,
  title = "Featured Products",
  subtitle = "Handpicked selections designed for modern living.",
  eyebrow = "CURATED",
  viewAllLink = "/products"
}: FeaturedProductsProps) {
  
  // Mock products for fallback if API is empty or failing
  const mockProducts: Product[] = [
    {
      id: 'mock-1',
      name: 'Premium Leather Tote',
      slug: 'premium-leather-tote',
      description: '',
      category: { id: 'c1', name: 'Accessories', slug: 'accessories' },
      basePrice: 250,
      tags: [],
      isPublished: true,
      isFeatured: true,
      rating: 5,
      reviewCount: 12,
      viewCount: 100,
      salesCount: 50,
      createdAt: '',
      updatedAt: '',
      variants: [
        { id: 'v1', name: 'Default', sku: 'SKU-1', price: 250, stock: 10, attributes: {}, isActive: true }
      ],
      images: [
        { id: 'i1', url: 'https://images.pexels.com/photos/23223861/pexels-photo-23223861.jpeg?auto=compress&cs=tinysrgb&w=800', displayOrder: 0, isThumbnail: true, altText: 'Leather Tote' }
      ]
    },
    {
      id: 'mock-2',
      name: 'Minimalist Gold Watch',
      slug: 'minimalist-gold-watch',
      description: '',
      category: { id: 'c2', name: 'Watches', slug: 'watches' },
      basePrice: 195,
      tags: [],
      isPublished: true,
      isFeatured: true,
      rating: 4.5,
      reviewCount: 8,
      viewCount: 80,
      salesCount: 30,
      createdAt: '',
      updatedAt: '',
      variants: [
        { id: 'v2', name: 'Default', sku: 'SKU-2', price: 195, stock: 5, attributes: {}, isActive: true }
      ],
      images: [
        { id: 'i2', url: 'https://images.pexels.com/photos/10556485/pexels-photo-10556485.jpeg?auto=compress&cs=tinysrgb&w=800', displayOrder: 0, isThumbnail: true, altText: 'Gold Watch' }
      ]
    },
    {
      id: 'mock-3',
      name: 'Cashmere Blend Sweater',
      slug: 'cashmere-blend-sweater',
      description: '',
      category: { id: 'c3', name: 'Clothing', slug: 'clothing' },
      basePrice: 120,
      tags: [],
      isPublished: true,
      isFeatured: true,
      rating: 4.8,
      reviewCount: 24,
      viewCount: 150,
      salesCount: 90,
      createdAt: '',
      updatedAt: '',
      variants: [
        { id: 'v3', name: 'Default', sku: 'SKU-3', price: 120, stock: 20, attributes: {}, isActive: true }
      ],
      images: [
        { id: 'i3', url: 'https://images.pexels.com/photos/30569741/pexels-photo-30569741.jpeg?auto=compress&cs=tinysrgb&w=800', displayOrder: 0, isThumbnail: true, altText: 'Cashmere Sweater' }
      ]
    },
    {
      id: 'mock-4',
      name: 'Matte Ceramic Vase',
      slug: 'matte-ceramic-vase',
      description: '',
      category: { id: 'c4', name: 'Home Decor', slug: 'home-decor' },
      basePrice: 85,
      tags: [],
      isPublished: true,
      isFeatured: true,
      rating: 4.9,
      reviewCount: 42,
      viewCount: 210,
      salesCount: 110,
      createdAt: '',
      updatedAt: '',
      variants: [
        { id: 'v4', name: 'Default', sku: 'SKU-4', price: 85, stock: 15, attributes: {}, isActive: true }
      ],
      images: [
        { id: 'i4', url: 'https://images.pexels.com/photos/16124848/pexels-photo-16124848.jpeg?auto=compress&cs=tinysrgb&w=800', displayOrder: 0, isThumbnail: true, altText: 'Ceramic Vase' }
      ]
    }
  ];

  // Take only up to 8 products for the featured section, or fallback to mock data
  const displayProducts = products && products.length > 0 ? products.slice(0, 8) : mockProducts;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }
    }
  };

  return (
    <section className="w-full px-4 py-20 sm:py-28 lg:py-32 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 border-t border-brand-100 dark:border-gray-800 overflow-hidden transition-colors duration-200">
      <div className="mx-auto max-w-7xl">
        
        {/* Section Header */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={headerVariants as any}
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16 gap-6"
        >
          <div className="max-w-2xl">
            {eyebrow && (
              <span className="text-xs font-bold tracking-widest text-brand-500 uppercase mb-3 block">
                {eyebrow}
              </span>
            )}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-brand-900 dark:text-white mb-4">
              {title}
            </h2>
            {subtitle && (
              <p className="text-base sm:text-lg text-brand-600 dark:text-gray-300 max-w-xl leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
          
          {viewAllLink && (
            <Link 
              href={viewAllLink} 
              className="group inline-flex items-center text-sm font-semibold text-brand-900 dark:text-white uppercase tracking-wider hover:text-brand-600 dark:hover:text-gray-300 transition-colors"
            >
              <span className="border-b border-brand-900 dark:border-white pb-0.5 group-hover:border-brand-600 dark:group-hover:border-gray-300 transition-colors">
                View Collection
              </span>
              <svg 
                className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          )}
        </motion.div>

        {/* Products Grid */}
        <motion.div 
          variants={containerVariants as any}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 sm:gap-y-16"
        >
          {displayProducts.map((product, index) => (
            <PremiumProductCard 
              key={product.id} 
              product={product} 
              index={index} 
            />
          ))}
        </motion.div>
        
      </div>
    </section>
  );
}
