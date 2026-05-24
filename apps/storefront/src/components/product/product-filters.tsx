'use client';

import { Category } from '@/lib/products-api';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, X } from 'lucide-react';

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
  const [expandedSections, setExpandedSections] = useState({
    sort: true,
    category: true,
    price: true,
    stock: true,
  });

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
    const timer = setTimeout(applyFilters, 300);
    return () => clearTimeout(timer);
  }, [priceRange, selectedCategory, sortBy, inStock]);

  const clearFilters = () => {
    setPriceRange([0, 5000]);
    setSelectedCategory(null);
    setSortBy('createdAt');
    setInStock(false);
    router.push('/products');
  };

  const hasActiveFilters =
    selectedCategory || priceRange[0] > 0 || priceRange[1] < 5000 || inStock;

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const FilterSection = ({
    title,
    section,
    children,
  }: {
    title: string;
    section: keyof typeof expandedSections;
    children: React.ReactNode;
  }) => (
    <div className="border-b border-brand-200 pb-6 last:border-b-0">
      <button
        onClick={() => toggleSection(section)}
        className="w-full flex items-center justify-between hover:text-brand-700 transition-colors group"
      >
        <h3 className="font-semibold text-brand-900 text-sm uppercase tracking-wide">
          {title}
        </h3>
        <motion.div
          animate={{ rotate: expandedSections[section] ? 0 : -90 }}
          transition={{ duration: 0.2 }}
          className="text-brand-600 group-hover:text-brand-900"
        >
          <ChevronDown size={18} />
        </motion.div>
      </button>

      <motion.div
        initial={false}
        animate={{
          height: expandedSections[section] ? 'auto' : 0,
          opacity: expandedSections[section] ? 1 : 0,
          marginTop: expandedSections[section] ? 16 : 0,
        }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        {children}
      </motion.div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="card-base p-6 space-y-0"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-brand-200">
        <h2 className="font-bold text-brand-900 text-lg">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs font-semibold text-brand-600 hover:text-brand-900 flex items-center gap-1 transition-colors"
          >
            <X size={16} />
            Clear
          </button>
        )}
      </div>

      {/* Sort */}
      <FilterSection title="Sort By" section="sort">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="input-base w-full"
        >
          <option value="createdAt">Newest</option>
          <option value="price">Price: Low to High</option>
          <option value="rating">Highest Rated</option>
          <option value="sales">Best Sellers</option>
          <option value="views">Most Viewed</option>
        </select>
      </FilterSection>

      {/* Category */}
      <FilterSection title="Category" section="category">
        <div className="space-y-3">
          <label className="flex items-center group cursor-pointer">
            <input
              type="radio"
              name="category"
              value=""
              checked={selectedCategory === null}
              onChange={() => setSelectedCategory(null)}
              className="w-4 h-4 accent-brand-600 cursor-pointer"
            />
            <span className="ml-3 text-sm text-brand-700 group-hover:text-brand-900 transition-colors">
              All Categories
            </span>
          </label>
          {categories
            .filter((cat) => !cat.slug || !cat.slug.includes('-'))
            .map((category) => (
              <label key={category.id} className="flex items-center group cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  value={category.id}
                  checked={selectedCategory === category.id}
                  onChange={() => setSelectedCategory(category.id)}
                  className="w-4 h-4 accent-brand-600 cursor-pointer"
                />
                <span className="ml-3 text-sm text-brand-700 group-hover:text-brand-900 transition-colors">
                  {category.name}
                </span>
              </label>
            ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range" section="price">
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-brand-600">$</span>
            <span className="font-bold text-brand-900">
              {priceRange[0]} – ${priceRange[1]}
            </span>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-brand-600 font-medium">Min Price</label>
            <input
              type="range"
              min="0"
              max="5000"
              step="50"
              value={priceRange[0]}
              onChange={(e) => {
                const newMin = Math.min(parseInt(e.target.value), priceRange[1]);
                setPriceRange([newMin, priceRange[1]]);
              }}
              className="w-full h-2 bg-brand-200 rounded-lg accent-brand-600 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-800 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-brand-800 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-brand-600 font-medium">Max Price</label>
            <input
              type="range"
              min="0"
              max="5000"
              step="50"
              value={priceRange[1]}
              onChange={(e) => {
                const newMax = Math.max(parseInt(e.target.value), priceRange[0]);
                setPriceRange([priceRange[0], newMax]);
              }}
              className="w-full h-2 bg-brand-200 rounded-lg accent-brand-600 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-800 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-brand-800 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
            />
          </div>
        </div>
      </FilterSection>

      {/* In Stock */}
      <FilterSection title="Availability" section="stock">
        <label className="flex items-center group cursor-pointer">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => setInStock(e.target.checked)}
            className="w-4 h-4 accent-brand-600 cursor-pointer rounded"
          />
          <span className="ml-3 text-sm text-brand-700 group-hover:text-brand-900 transition-colors">
            In Stock Only
          </span>
        </label>
      </FilterSection>
    </motion.div>
  );
}
