'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const footerLinks = {
  shop: [
    { name: 'All Products', href: '/products' },
    { name: 'Categories', href: '/categories' },
    { name: 'New Arrivals', href: '/products?sort=new' },
    { name: 'Featured', href: '/products?featured=true' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Store Locator', href: '/stores' },
    { name: 'Contact Us', href: '/contact' },
  ],
  support: [
    { name: 'Help Center', href: '/help' },
    { name: 'Returns & Exchanges', href: '/returns' },
    { name: 'Shipping Info', href: '/shipping' },
    { name: 'Track Order', href: '/track' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-white border-t border-brand-200 mt-auto">
      <div className="container-max px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
              <div className="w-9 h-9 bg-brand-800 rounded-lg flex items-center justify-center text-white font-bold text-lg group-hover:scale-105 transition-transform">
                S
              </div>
              <span className="text-xl font-bold tracking-tight text-brand-900">STORE.</span>
            </Link>

            <p className="text-brand-600 text-sm max-w-sm mb-6 leading-relaxed">
              Your premium shopping destination for high-quality products. We blend modern design with unparalleled customer service.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {['Twitter', 'Instagram', 'Facebook'].map((social) => (
                <motion.div
                  key={social}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex"
                >
                  <a
                    href={`https://${social.toLowerCase()}.com`}
                    className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 hover:bg-brand-800 hover:text-white transition-colors font-semibold text-sm"
                    aria-label={social}
                  >
                    {social[0]}
                  </a>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="font-bold text-brand-900 mb-4 text-sm uppercase tracking-widest">
              Shop
            </h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-brand-600 hover:text-brand-900 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-bold text-brand-900 mb-4 text-sm uppercase tracking-widest">
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-brand-600 hover:text-brand-900 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-bold text-brand-900 mb-4 text-sm uppercase tracking-widest">
              Support
            </h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-brand-600 hover:text-brand-900 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-brand-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-brand-600">
            © {new Date().getFullYear()} STORE. All rights reserved.
          </p>
          <div className="flex gap-6">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-xs text-brand-600 hover:text-brand-900 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
