'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';

export function ProductSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search) {
        router.push(`/products?search=${encodeURIComponent(search)}`);
      } else {
        router.push('/products');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search, router]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative w-full"
    >
      <div className={`relative group rounded-lg transition-all duration-300 ${
        isFocused
          ? 'shadow-lg ring-2 ring-brand-600/20'
          : 'shadow-sm hover:shadow-md'
      }`}>
        <div className="absolute inset-y-0 left-0 flex items-center pl-4">
          <motion.div
            animate={{ color: isFocused ? 'rgb(59, 130, 246)' : 'rgb(107, 114, 128)' }}
          >
            <Search size={20} />
          </motion.div>
        </div>

        <input
          type="text"
          placeholder="Search products by name, category, or keyword..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full px-4 py-3 pl-12 pr-10 bg-white border-2 border-brand-200 rounded-lg text-base font-medium placeholder:text-brand-400 focus:border-brand-600 focus:outline-none transition-colors"
        />

        {search && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-brand-400 hover:text-brand-600 hover:bg-brand-50 rounded transition-colors"
            aria-label="Clear search"
          >
            <X size={18} />
          </motion.button>
        )}
      </div>

      {/* Search hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: isFocused ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="absolute -bottom-6 left-0 text-xs text-brand-600 pointer-events-none"
      >
        Use keywords to find products faster
      </motion.p>
    </motion.div>
  );
}
