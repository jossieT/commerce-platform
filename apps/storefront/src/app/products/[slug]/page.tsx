'use client';

import { Suspense } from 'react';
import { useProductBySlug, useRelatedProducts } from '@/hooks/useProducts';
import { ProductDetail } from '@/components/product/product-detail';
import { ProductGrid } from '@/components/product/product-grid';

function ProductDetailContent({ slug }: { slug: string }) {
  const { data: product, isLoading: productLoading } = useProductBySlug(slug);
  const { data: relatedProducts = [] } = useRelatedProducts(product?.id || '');

  if (productLoading) {
    return <div className="text-center py-12">Loading product...</div>;
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Product not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Product Detail */}
      <ProductDetail product={product} />

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Related Products</h2>
            <p className="text-gray-600 mt-2">You might also like these items</p>
          </div>
          <ProductGrid products={relatedProducts} />
        </div>
      )}
    </div>
  );
}

export default function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
          <ProductDetailContent slug={params.slug} />
        </Suspense>
      </div>
    </div>
  );
}
