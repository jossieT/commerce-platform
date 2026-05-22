'use client';

import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

export function SearchInput() {
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(navigator.userAgent.includes('Mac'));
  }, []);

  return (
    <div className="relative group w-full max-w-sm hidden md:flex items-center">
      <div className="absolute left-3 text-muted-foreground group-focus-within:text-foreground transition-colors">
        <Search className="w-4 h-4" />
      </div>
      <input
        type="text"
        placeholder="Search products..."
        className="w-full h-10 pl-10 pr-12 text-sm bg-muted/50 border border-transparent rounded-full outline-none transition-all duration-200 placeholder:text-muted-foreground focus:bg-background focus:border-border focus:ring-2 focus:ring-primary/20"
      />
      <div className="absolute right-3 flex items-center gap-1">
        <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground bg-background border border-border rounded-sm">
          <span className="text-[11px] leading-none">{isMac ? '⌘' : 'Ctrl'}</span>K
        </kbd>
      </div>
    </div>
  );
}
