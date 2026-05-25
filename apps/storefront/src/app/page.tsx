import Link from 'next/link';
import { productsApi } from '@/lib/products-api';
import { FeaturedProducts } from '@/components/product/featured-products';
import { PremiumHero } from '@/components/hero/premium-hero';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function HomePage() {
  const featuredProducts = await productsApi.getFeaturedProducts(6);

  // Premium hero images from high-quality sources
  const heroImages = [
    {
      src: 'https://images.pexels.com/photos/27127623/pexels-photo-27127623.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop',
      alt: 'Man holding premium leather bag',
      width: 1600,
      height: 900,
    },
    {
      src: 'https://images.pexels.com/photos/2897539/pexels-photo-2897539.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop',
      alt: 'Premium fashion collection',
      width: 1600,
      height: 900,
    },
    {
      src: 'https://images.pexels.com/photos/20432893/pexels-photo-20432893.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop',
      alt: 'Modern workspace with laptops',
      width: 1600,
      height: 900,
    },
  ];

  const headline = (
    <>
      Elevate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Lifestyle</span>
    </>
  );

  const ctas = [
    {
      label: 'Shop Collection',
      href: '/products',
      variant: 'primary' as const,
    },
    {
      label: 'Explore Categories',
      href: '/categories',
      variant: 'secondary' as const,
    },
  ];

  return (
    <main className="flex flex-col">
      {/* Premium Hero Section */}
      <PremiumHero
        images={heroImages}
        headline={headline}
        subheading="Discover a curated collection of premium products designed to bring style and substance to your everyday."
        ctas={ctas}
      />

      {/* Premium Featured Products Section */}
      <FeaturedProducts products={featuredProducts} />

      {/* Trust Badges / Info Section */}
      <section className="w-full bg-gradient-to-b from-gray-50 to-white py-14 sm:py-16 lg:py-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-3">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Free Shipping</h3>
              <p className="mt-1 text-sm text-gray-600">On all orders over $100</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-3">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Easy Returns</h3>
              <p className="mt-1 text-sm text-gray-600">30-day money-back guarantee</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-3">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Secure Payments</h3>
              <p className="mt-1 text-sm text-gray-600">100% secure checkout</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
