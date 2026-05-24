'use client';

import { Search, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function SearchInput() {
  const [isMac, setIsMac] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setIsMac(navigator.userAgent.includes('Mac'));
  }, []);

  return (
    <motion.div
      className="relative group w-full max-w-sm hidden md:flex items-center"
      whileFocus="focused"
    >
      <motion.div
        className="absolute left-3.5 text-brand-400 group-focus-within:text-brand-600 transition-colors pointer-events-none"
        animate={{ scale: isFocused ? 1.1 : 1 }}
      >
        <Search className="w-4 h-4" />
      </motion.div>

      <input
        type="text"
        placeholder="Search products..."
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full h-10 pl-10 pr-16 text-sm font-medium bg-brand-50 border-2 border-brand-200 rounded-lg outline-none transition-all duration-300 placeholder:text-brand-400 focus:bg-white focus:border-brand-600 focus:ring-2 focus:ring-brand-600/10"
      />

      <div className="absolute right-3 flex items-center gap-2 pointer-events-none">
        <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold text-brand-500 bg-brand-100 border border-brand-200 rounded-md">
          <span className="text-[11px] leading-none font-bold">{isMac ? '⌘' : 'Ctrl'}</span>K
        </kbd>
      </div>
    </motion.div>
  );
}
