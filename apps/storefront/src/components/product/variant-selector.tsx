'use client';

import { ProductVariant } from '@/lib/products-api';
import { useState } from 'react';

interface VariantSelectorProps {
  variants: ProductVariant[];
  onSelect: (variant: ProductVariant) => void;
}

export function VariantSelector({ variants, onSelect }: VariantSelectorProps) {
  const [selected, setSelected] = useState<ProductVariant>(variants[0]);

  const handleSelect = (variant: ProductVariant) => {
    setSelected(variant);
    onSelect(variant);
  };

  // Group variants by attribute for better UX
  const attributes = new Map<string, Set<string>>();
  variants.forEach((v) => {
    Object.entries(v.attributes).forEach(([key, value]) => {
      if (!attributes.has(key)) {
        attributes.set(key, new Set());
      }
      attributes.get(key)?.add(value);
    });
  });

  return (
    <div className="space-y-6">
      {Array.from(attributes.entries()).map(([attrName, values]) => (
        <div key={attrName}>
          <label className="block text-sm font-semibold text-gray-900 mb-3 capitalize">
            {attrName}
          </label>
          <div className="flex flex-wrap gap-2">
            {Array.from(values).map((value) => {
              const matchingVariant = variants.find(
                (v) => v.attributes[attrName] === value,
              );

              if (!matchingVariant) return null;

              const isSelected = selected.attributes[attrName] === value;
              const isAvailable = matchingVariant.stock > 0;

              return (
                <button
                  key={`${attrName}-${value}`}
                  onClick={() => handleSelect(matchingVariant)}
                  disabled={!isAvailable}
                  className={`px-4 py-2 border-2 rounded-lg font-medium transition-colors ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50 text-blue-900'
                      : 'border-gray-300 bg-white text-gray-900 hover:border-gray-400'
                  } ${!isAvailable && 'opacity-50 cursor-not-allowed line-through'}`}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Stock Status */}
      <div className="mt-6 p-3 bg-blue-50 rounded-lg">
        <div className="text-sm">
          <p className="font-medium text-gray-900">
            {selected.stock > 0 ? (
              <>
                ✓ In Stock
                {selected.stock < 5 && (
                  <span className="text-orange-600 ml-2">({selected.stock} left)</span>
                )}
              </>
            ) : (
              <span className="text-red-600">✗ Out of Stock</span>
            )}
          </p>
          <p className="text-gray-600 text-xs mt-1">SKU: {selected.sku}</p>
        </div>
      </div>

      {/* Price Info */}
      <div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-gray-900">${selected.price.toFixed(2)}</span>
          {selected.compareAtPrice && (
            <span className="text-lg text-gray-500 line-through">
              ${selected.compareAtPrice.toFixed(2)}
            </span>
          )}
        </div>
        {selected.compareAtPrice && (
          <p className="text-sm text-green-600 font-medium mt-1">
            Save ${(selected.compareAtPrice - selected.price).toFixed(2)}
          </p>
        )}
      </div>
    </div>
  );
}
