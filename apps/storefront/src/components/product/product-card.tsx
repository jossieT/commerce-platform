'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/products-api';
import { useCartStore } from '@/store/cart.store';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [isAdding, setIsAdding] = useState(false);

  const primaryVariant = product.variants[0];
  const thumbnailImage = product.images.find((img) => img.isThumbnail) || product.images[0];
  
  const price = Number(primaryVariant?.price || 0);
  const compareAtPrice = primaryVariant?.compareAtPrice ? Number(primaryVariant.compareAtPrice) : null;

  const discountPercentage =
    compareAtPrice && price < compareAtPrice
      ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
      : 0;

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
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Link href={`/products/${product.slug}`}>
      <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
        {/* Image Container */}
        <div className="relative h-64 w-full overflow-hidden bg-gray-100">
          {thumbnailImage?.url && (
            <Image
              src={thumbnailImage.url}
              alt={thumbnailImage.altText || product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          )}

          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
              -{discountPercentage}%
            </div>
          )}

          {/* Featured Badge */}
          {product.isFeatured && (
            <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-semibold">
              Featured
            </div>
          )}

          {/* Stock Status */}
          {primaryVariant.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-semibold">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Category */}
          <p className="text-xs text-gray-500 font-medium">{product.category.name}</p>

          {/* Product Name */}
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>

          {/* Short Description */}
          {product.shortDescription && (
            <p className="text-xs text-gray-600 line-clamp-1 mt-1">{product.shortDescription}</p>
          )}

          {/* Rating */}
          {product.rating > 0 && (
            <div className="flex items-center gap-1 mt-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={i < Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-300'}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-xs text-gray-500">({product.reviewCount})</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-lg font-bold text-gray-900">${price.toFixed(2)}</span>
            {compareAtPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${compareAtPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Variants Preview */}
          {product.variants.length > 1 && (
            <div className="flex gap-1 mt-3">
              {product.variants.slice(0, 3).map((variant) => (
                <div
                  key={variant.id}
                  className="w-6 h-6 rounded border border-gray-300 bg-gray-50 text-xs flex items-center justify-center text-gray-600 hover:border-gray-400"
                  title={variant.name}
                >
                  {variant.attributes.color ? variant.attributes.color[0] : variant.attributes.size?.[0] || ''}
                </div>
              ))}
              {product.variants.length > 3 && (
                <div className="text-xs text-gray-600">+{product.variants.length - 3}</div>
              )}
            </div>
          )}

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={primaryVariant.stock === 0 || isAdding}
            className="w-full mt-4 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isAdding ? 'Adding...' : primaryVariant.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </Link>
  );
}
