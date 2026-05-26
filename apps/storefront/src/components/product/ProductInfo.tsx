/**
 * Product Info Section
 * Display product information cleanly and elegantly
 */

'use client';

import { motion } from 'framer-motion';
import { Check, Truck, RotateCcw, Shield } from 'lucide-react';
import { Product } from '@/types/product';

interface ProductInfoProps {
  product: Product;
}

function ProductInfo({ product }: ProductInfoProps) {
  return (
    <div className="space-y-12">
      {/* Key Features */}
      {product.features && product.features.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.features.map((feature) => (
              <motion.div
                key={feature.id}
                className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/30 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors duration-300 border border-slate-200 dark:border-slate-700/50"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="flex gap-3 items-start">
                  <div className="text-2xl flex-shrink-0 mt-1">{feature.icon || '✨'}</div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-1">{feature.title}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Description */}
      {product.description && (
        <section className="border-t border-slate-200 dark:border-slate-800/50 pt-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">About This Product</h2>
          <motion.p
            className="text-slate-700 dark:text-slate-300 leading-relaxed max-w-2xl"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            {product.description}
          </motion.p>
        </section>
      )}

      {/* Specifications */}
      {product.specifications && product.specifications.length > 0 && (
        <section className="border-t border-slate-200 dark:border-slate-800/50 pt-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Specifications</h2>
          <div className="bg-slate-50 dark:bg-slate-800/20 rounded-lg border border-slate-200 dark:border-slate-700/30 p-6">
            {product.specifications.map((spec, index) => {
              const values = Array.isArray(spec.value) ? spec.value : [spec.value];
              return (
                <motion.div
                  key={index}
                  className="py-3 border-b border-slate-200 dark:border-slate-800/50 last:border-b-0 flex justify-between items-start"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  viewport={{ once: true }}
                >
                  <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">{spec.label}</span>
                  <div className="text-sm text-slate-900 dark:text-white text-right">
                    {values.length === 1 ? (
                      <span>{values[0]}</span>
                    ) : (
                      <div className="flex flex-col gap-1">
                        {values.map((v, i) => (
                          <span key={i}>{v}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* Policies & Guarantees */}
      <section className="border-t border-slate-200 dark:border-slate-800/50 pt-12">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          Guarantees & Policies
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Shipping */}
          <motion.div
            className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/20 border border-slate-200 dark:border-slate-700/30"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="flex gap-3 items-start">
              <div className="text-blue-500 dark:text-blue-400 flex-shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">Fast Shipping</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {`${product.shipping.free ? 'Free' : 'Standard'} shipping within ${product.shipping.estimatedDays} business days`}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Returns */}
          {product.returns && (
            <motion.div
              className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/20 border border-slate-200 dark:border-slate-700/30"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="flex gap-3 items-start">
                <div className="text-blue-500 dark:text-blue-400 flex-shrink-0">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">Easy Returns</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {`${product.returns.days}-day return guarantee. ${product.returns.description}`}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Warranty */}
          {product.warranty && (
            <motion.div
              className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/20 border border-slate-200 dark:border-slate-700/30"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="flex gap-3 items-start">
                <div className="text-blue-500 dark:text-blue-400 flex-shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">Warranty</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {`${product.warranty.duration} warranty. ${product.warranty.description}`}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Quality */}
          <motion.div
            className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/20 border border-slate-200 dark:border-slate-700/30"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="flex gap-3 items-start">
              <div className="text-blue-500 dark:text-blue-400 flex-shrink-0">
                <Check className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">Quality Assured</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Every product is inspected and tested before shipping to ensure excellence
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export { ProductInfo };
