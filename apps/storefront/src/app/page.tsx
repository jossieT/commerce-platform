import Link from 'next/link';
import { productsApi } from '@/lib/products-api';
import { ProductGrid } from '@/components/product/product-grid';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function HomePage() {
  const featuredProducts = await productsApi.getFeaturedProducts(6);

  return (
    <main className="flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-slate-900 px-4 text-center sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 max-h-[70vh] lg:max-h-[65vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black opacity-80" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent blur-3xl" />
        </div>
        
        <div className="relative z-10 mx-auto max-w-3xl space-y-5 sm:space-y-6 lg:space-y-7">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-tight">
            Elevate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Lifestyle</span>
          </h1>
          <p className="mx-auto max-w-xl text-base sm:text-lg text-slate-300 leading-relaxed px-2">
            Discover a curated collection of premium products designed to bring style and substance to your everyday.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 pt-2">
            <Link
              href="/products"
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-white px-7 py-2.5 sm:px-8 sm:py-3 text-sm sm:text-base font-semibold text-slate-900 transition duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-blue-100 to-white opacity-0 transition duration-300 group-hover:opacity-100" />
              <span className="relative">Shop Collection</span>
            </Link>
            <Link
              href="/categories"
              className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-800/50 backdrop-blur-sm px-7 py-2.5 sm:px-8 sm:py-3 text-sm sm:text-base font-semibold text-white transition duration-300 hover:bg-slate-700 hover:border-slate-500"
            >
              Explore Categories
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="w-full px-4 py-16 sm:py-20 lg:py-24 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 sm:mb-12 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Featured Products</h2>
              <p className="mt-1 sm:mt-2 text-base sm:text-lg text-gray-600">Handpicked selections just for you.</p>
            </div>
            <Link href="/products" className="hidden sm:block text-sm font-semibold text-blue-600 hover:text-blue-500 hover:underline whitespace-nowrap ml-4">
              View all <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          <ProductGrid products={featuredProducts} />

          <div className="mt-10 sm:mt-12 text-center sm:hidden">
            <Link href="/products" className="text-sm font-semibold text-blue-600 hover:text-blue-500 hover:underline">
              View all products <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

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
