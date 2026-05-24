'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, ShoppingBag, User, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchInput } from '@/components/ui/SearchInput';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { MobileMenu } from '@/components/layout/MobileMenu';

const navLinks = [
  { name: 'Products', href: '/products' },
  { name: 'Categories', href: '/categories' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cartItemCount = 0;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.header
        animate={{
          backgroundColor: isScrolled ? 'rgb(255, 255, 255)' : 'transparent',
          boxShadow: isScrolled ? '0 4px 6px -1px rgb(0 0 0 / 0.1)' : 'none',
        }}
        transition={{ duration: 0.3 }}
        className={`fixed top-0 inset-x-0 z-40 border-b transition-all duration-300 ${
          isScrolled
            ? 'border-brand-200 backdrop-blur-lg'
            : 'border-transparent'
        } py-4 md:py-5`}
      >
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Logo & Nav */}
            <div className="flex items-center gap-10">
              <Link href="/" className="flex items-center gap-2.5 group">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-9 h-9 bg-brand-800 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                >
                  S
                </motion.div>
                <span className="text-xl font-bold tracking-tight text-brand-900 hidden sm:block">
                  STORE.
                </span>
              </Link>

              <nav className="hidden md:flex items-center gap-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-sm font-semibold text-brand-700 hover:text-brand-900 transition-colors relative group"
                  >
                    {link.name}
                    <motion.span
                      layoutId="underline"
                      className="absolute -bottom-1 left-0 h-0.5 bg-brand-800"
                      initial={{ width: 0 }}
                      whileHover={{ width: '100%' }}
                      transition={{ duration: 0.3 }}
                    />
                  </Link>
                ))}
              </nav>
            </div>

            {/* Center: Search - hidden on mobile, visible on lg */}
            <div className="flex-1 max-w-md mx-auto hidden lg:block">
              <SearchInput />
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Search toggle for mobile */}
              <div className="lg:hidden">
                <button className="p-2 text-brand-600 hover:text-brand-900 hover:bg-brand-100 rounded-lg transition-colors">
                  <SearchInput />
                </button>
              </div>

              <ThemeToggle />

              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2 text-brand-600 hover:text-brand-900 hover:bg-brand-100 rounded-lg transition-colors"
              >
                <ShoppingBag className="w-5 h-5" />
                <AnimatePresence>
                  {cartItemCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute top-1 right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-brand-800 rounded-full"
                    >
                      {cartItemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              {/* Auth Links */}
              <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-brand-200">
                <Link
                  href="/login"
                  className="text-sm font-medium px-3 py-2 text-brand-700 hover:text-brand-900 hover:bg-brand-100 rounded-lg transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="text-sm font-medium px-3 py-2 bg-brand-800 text-white hover:bg-brand-900 rounded-lg transition-colors shadow-sm"
                >
                  Sign up
                </Link>
              </div>

              {/* Mobile Menu Toggle */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="md:hidden p-2 text-brand-600 hover:text-brand-900 hover:bg-brand-100 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}
