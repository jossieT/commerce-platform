'use client';

import { Category } from '@/lib/products-api';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

interface ProductFiltersProps {
  categories: Category[];
}

export function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get('category'),
  );
  const [sortBy, setSortBy] = useState<string>(searchParams.get('sortBy') || 'createdAt');
  const [inStock, setInStock] = useState(searchParams.get('inStock') === 'true');

  const applyFilters = () => {
    const params = new URLSearchParams();

    if (selectedCategory) params.append('category', selectedCategory);
    if (priceRange[0] > 0) params.append('minPrice', priceRange[0].toString());
    if (priceRange[1] < 5000) params.append('maxPrice', priceRange[1].toString());
    if (sortBy !== 'createdAt') params.append('sortBy', sortBy);
    if (inStock) params.append('inStock', 'true');

    router.push(`/products?${params.toString()}`);
  };

  useEffect(() => {
    const timer = setTimeout(applyFilters, 500);
    return () => clearTimeout(timer);
  }, [priceRange, selectedCategory, sortBy, inStock]);

  const clearFilters = () => {
    setPriceRange([0, 5000]);
    setSelectedCategory(null);
    setSortBy('createdAt');
    setInStock(false);
    router.push('/products');
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-6">
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Filters</h3>

        {/* Sort */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="createdAt">Newest</option>
            <option value="price">Price: Low to High</option>
            <option value="rating">Highest Rated</option>
            <option value="sales">Best Sellers</option>
            <option value="views">Most Viewed</option>
          </select>
        </div>

        {/* Category */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="category"
                value=""
                checked={selectedCategory === null}
                onChange={() => setSelectedCategory(null)}
                className="rounded"
              />
              <span className="ml-2 text-sm">All Categories</span>
            </label>
            {categories
              .filter((cat) => !cat.slug || !cat.slug.includes('-'))
              .map((category) => (
                <label key={category.id} className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    value={category.id}
                    checked={selectedCategory === category.id}
                    onChange={() => setSelectedCategory(category.id)}
                    className="rounded"
                  />
                  <span className="ml-2 text-sm">{category.name}</span>
                </label>
              ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Range: ${priceRange[0]} - ${priceRange[1]}
          </label>
          <input
            type="range"
            min="0"
            max="5000"
            step="50"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
            className="w-full"
          />
        </div>

        {/* In Stock */}
        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={inStock}
              onChange={(e) => setInStock(e.target.checked)}
              className="rounded"
            />
            <span className="ml-2 text-sm">In Stock Only</span>
          </label>
        </div>

        {/* Clear Filters */}
        {(selectedCategory || priceRange[0] > 0 || priceRange[1] < 5000 || inStock) && (
          <button
            onClick={clearFilters}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}
