'use client';

import { Product } from '@/lib/products-api';
import { useCartStore } from '@/store/cart.store';
import Image from 'next/image';
import { useState } from 'react';
import { VariantSelector } from './variant-selector';

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      addItem({
        productId: product.id,
        variantId: selectedVariant.id,
        name: product.name,
        variantName: selectedVariant.name,
        price: selectedVariant.price,
        imageUrl: product.images[0]?.url,
        quantity,
      });

      // Show success message (you can add a toast notification here)
      alert('Added to cart!');
      setQuantity(1);
    } finally {
      setIsAdding(false);
    }
  };

  const thumbnailImage = product.images.find((img) => img.isThumbnail) || product.images[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Images */}
      <div className="space-y-4">
        {/* Main Image */}
        <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden">
          {thumbnailImage && (
            <Image
              src={thumbnailImage.url}
              alt={thumbnailImage.altText || product.name}
              fill
              className="object-cover"
              priority
            />
          )}
        </div>

        {/* Thumbnails */}
        {product.images.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((img) => (
              <div key={img.id} className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500">
                <Image
                  src={img.url}
                  alt={img.altText || 'Product image'}
                  fill
                  className="object-cover"
                  sizes="100px"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="space-y-6">
        {/* Category */}
        <div>
          <p className="text-sm text-gray-500">{product.category.name}</p>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          {product.rating > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={i < Math.round(product.rating) ? 'text-yellow-400 text-lg' : 'text-gray-300 text-lg'}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {product.rating.toFixed(1)} ({product.reviewCount} reviews)
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        {product.shortDescription && (
          <p className="text-gray-600">{product.shortDescription}</p>
        )}

        {/* Variant Selector */}
        <div>
          <VariantSelector
            variants={product.variants}
            onSelect={setSelectedVariant}
          />
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Quantity</label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              −
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
              max={selectedVariant.stock}
              className="w-16 px-2 py-2 border border-gray-300 rounded text-center"
            />
            <button
              onClick={() => setQuantity(Math.min(selectedVariant.stock, quantity + 1))}
              disabled={quantity >= selectedVariant.stock}
              className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
            >
              +
            </button>
          </div>
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={selectedVariant.stock === 0 || isAdding}
          className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isAdding ? 'Adding to cart...' : selectedVariant.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>

        {/* Full Description */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Product Description</h2>
          <div className="text-gray-700 whitespace-pre-wrap">{product.description}</div>
        </div>

        {/* Tags */}
        {product.tags.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
