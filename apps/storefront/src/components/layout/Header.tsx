'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, ShoppingBag, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchInput } from '@/components/ui/SearchInput';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { MobileMenu } from '@/components/layout/MobileMenu';
// import { useCartStore } from '@/store/cart.store';

const navLinks = [
  { name: 'Products', href: '/products' },
  { name: 'Categories', href: '/categories' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // const cartItemCount = useCartStore((state: any) => state.items?.length || 0);
  const cartItemCount = 0; // Fallback for now

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 border-b ${
          isScrolled
            ? 'bg-background/80 backdrop-blur-md border-border shadow-sm py-3'
            : 'bg-transparent border-transparent py-5'
        }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Logo & Nav */}
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold group-hover:scale-105 transition-transform">
                  S
                </div>
                <span className="text-xl font-bold tracking-tight hidden sm:block">
                  STORE.
                </span>
              </Link>
              
              <nav className="hidden md:flex items-center gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
                  >
                    {link.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                  </Link>
                ))}
              </nav>
            </div>

            {/* Center: Search */}
            <div className="flex-1 max-w-md mx-auto hidden lg:block">
              <SearchInput />
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="lg:hidden">
                 <button className="p-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors">
                   <SearchInput /> {/* We can use a search icon toggle for mobile in a full implementation */}
                 </button>
              </div>

              <ThemeToggle />

              <Link href="/cart" className="relative p-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors">
                <ShoppingBag className="w-5 h-5" />
                <AnimatePresence>
                  {cartItemCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute top-0.5 right-0.5 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-primary-foreground bg-primary rounded-full"
                    >
                      {cartItemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-border">
                <Link href="/login" className="text-sm font-medium px-3 py-2 hover:bg-muted rounded-md transition-colors">
                  Log in
                </Link>
                <Link href="/signup" className="text-sm font-medium px-3 py-2 bg-foreground text-background hover:opacity-90 rounded-md transition-opacity">
                  Sign up
                </Link>
              </div>

              <button
                className="md:hidden p-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}
