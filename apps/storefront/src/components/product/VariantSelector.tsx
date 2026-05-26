/**
 * Variant Selector Components
 * Premium selectors for product options (color, size, storage, etc.)
 */

'use client';

import { motion } from 'framer-motion';
import { ProductOption, ProductVariant } from '@/types/product';

interface VariantSelectorProps {
  option: ProductOption;
  selectedVariantId?: string;
  onSelect: (variantId: string) => void;
}

interface ColorSelectorProps {
  variants: ProductVariant[];
  selectedVariantId?: string;
  onSelect: (variantId: string) => void;
  label: string;
}

interface SizeSelectorProps {
  variants: ProductVariant[];
  selectedVariantId?: string;
  onSelect: (variantId: string) => void;
  label: string;
}

/**
 * Color Selector with visual color swatches
 */
export function ColorSelector({
  variants,
  selectedVariantId,
  onSelect,
  label,
}: ColorSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-white">
          {label}
          <span className="text-blue-400">
            {selectedVariantId
              ? ` - ${
                  variants.find((v) => v.id === selectedVariantId)?.colorName ||
                  variants.find((v) => v.id === selectedVariantId)?.value
                }`
              : ''}
          </span>
        </label>
      </div>

      <div className="flex gap-3 flex-wrap">
        {variants.map((variant) => (
          <motion.button
            key={variant.id}
            onClick={() => onSelect(variant.id)}
            disabled={!variant.available}
            className="group relative"
            whileHover={variant.available ? { scale: 1.05 } : {}}
            whileTap={variant.available ? { scale: 0.95 } : {}}
          >
            {/* Color Swatch */}
            <div
            className={`relative w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                selectedVariantId === variant.id
                  ? 'border-slate-900 dark:border-white shadow-lg dark:shadow-white/20'
                  : variant.available
                    ? 'border-slate-300 dark:border-white/20 hover:border-slate-400 dark:hover:border-white/40'
                    : 'border-slate-500 dark:border-slate-700/50 opacity-50'
              }`}
              style={{ backgroundColor: variant.colorCode }}
            >
              {selectedVariantId === variant.id && (
                <motion.div
                  layoutId="color-indicator"
                  className="absolute inset-0 rounded-full border-2 border-slate-900 dark:border-white"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                  <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
                </motion.div>
              )}

              {!variant.available && (
                <div className="absolute inset-0 rounded-full flex items-center justify-center">
                  <div className="w-0.5 h-8 bg-red-500 rotate-45" />
                </div>
              )}
            </div>

            {/* Tooltip */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-xs font-medium bg-slate-900 dark:bg-slate-800 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
              {variant.colorName || variant.value}
            </div>
          </motion.button>
        ))}
      </div>

      {!variants.some((v) => v.available) && (
        <p className="text-xs text-red-400">
          This option is currently unavailable
        </p>
      )}
    </div>
  );
}

/**
 * Size/Storage Selector with chip-style buttons
 */
export function SizeSelector({
  variants,
  selectedVariantId,
  onSelect,
  label,
}: SizeSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-white">
          {label}
          <span className="text-blue-400">
            {selectedVariantId
              ? ` - ${variants.find((v) => v.id === selectedVariantId)?.value}`
              : ''}
          </span>
        </label>
      </div>

      <div className="flex gap-2 flex-wrap">
        {variants.map((variant) => (
          <motion.button
            key={variant.id}
            onClick={() => onSelect(variant.id)}
            disabled={!variant.available}
            className={`relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
              selectedVariantId === variant.id
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg dark:shadow-white/20'
                : variant.available
                  ? 'bg-slate-200 dark:bg-slate-800/50 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-700/50 border border-slate-400 dark:border-white/10'
                  : 'bg-slate-300 dark:bg-slate-900/30 text-slate-500 border border-slate-400 dark:border-slate-700/30 opacity-50 cursor-not-allowed'
            }`}
            whileHover={variant.available ? { y: -2 } : {}}
            whileTap={variant.available ? { y: 0 } : {}}
          >
            {variant.value}

            {selectedVariantId === variant.id && (
              <motion.div
                layoutId="size-indicator"
                className="absolute inset-0 rounded-lg border-2 border-slate-900 dark:border-white"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {!variants.some((v) => v.available) && (
        <p className="text-xs text-red-400">
          This option is currently out of stock
        </p>
      )}
    </div>
  );
}

/**
 * Generic Variant Selector (routes to appropriate selector based on type)
 */
export function VariantSelector({
  option,
  selectedVariantId,
  onSelect,
}: VariantSelectorProps) {
  if (option.type === 'color') {
    return (
      <ColorSelector
        variants={option.variants}
        selectedVariantId={selectedVariantId}
        onSelect={onSelect}
        label={option.name}
      />
    );
  }

  return (
    <SizeSelector
      variants={option.variants}
      selectedVariantId={selectedVariantId}
      onSelect={onSelect}
      label={option.name}
    />
  );
}
