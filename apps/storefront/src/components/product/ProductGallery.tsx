/**
 * Product Gallery Component
 * Premium image gallery with zoom support and smooth transitions
 */

'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { ProductImage } from '@/types/product';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface ProductGalleryProps {
  images: ProductImage[];
  title: string;
  onImageChange?: (index: number) => void;
}

export function ProductGallery({
  images,
  title,
  onImageChange,
}: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const handlePrevious = useCallback(() => {
    const newIndex = selectedIndex === 0 ? images.length - 1 : selectedIndex - 1;
    setSelectedIndex(newIndex);
    onImageChange?.(newIndex);
  }, [selectedIndex, images.length, onImageChange]);

  const handleNext = useCallback(() => {
    const newIndex = selectedIndex === images.length - 1 ? 0 : selectedIndex + 1;
    setSelectedIndex(newIndex);
    onImageChange?.(newIndex);
  }, [selectedIndex, images.length, onImageChange]);

  const handleThumbnailClick = useCallback(
    (index: number) => {
      setSelectedIndex(index);
      onImageChange?.(index);
    },
    [onImageChange]
  );

  const currentImage = images[selectedIndex];

  const imageVariants = {
    enter: {
      opacity: 0,
      scale: 0.95,
    },
    center: {
      opacity: 1,
      scale: 1,
    },
    exit: {
      opacity: 0,
      scale: 0.95,
    },
  };

  const thumbnailVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.05 },
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Main Image */}
      <div className="relative w-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-950 rounded-xl overflow-hidden aspect-square group">
        {/* Navigation Buttons */}
        {!isMobile && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-slate-900/10 hover:bg-slate-900/20 dark:bg-white/10 dark:hover:bg-white/20 text-slate-900 dark:text-white transition-all duration-300 backdrop-blur-sm group-hover:opacity-100 opacity-0"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-slate-900/10 hover:bg-slate-900/20 dark:bg-white/10 dark:hover:bg-white/20 text-slate-900 dark:text-white transition-all duration-300 backdrop-blur-sm group-hover:opacity-100 opacity-0"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Zoom Button */}
        <button
          onClick={() => setIsZoomed(!isZoomed)}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-900/10 hover:bg-slate-900/20 dark:bg-white/10 dark:hover:bg-white/20 text-slate-900 dark:text-white transition-all duration-300 backdrop-blur-sm"
          aria-label="Zoom image"
        >
          <ZoomIn className="w-5 h-5" />
        </button>

        {/* Image Counter */}
        {isMobile && images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-slate-900/50 dark:bg-black/50 text-white text-xs font-medium backdrop-blur-sm">
            {selectedIndex + 1} / {images.length}
          </div>
        )}

        {/* Main Image */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedIndex}
            variants={imageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={`relative w-full h-full ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
          >
            <Image
              src={currentImage.url}
              alt={currentImage.alt}
              fill
              className={`object-cover transition-transform duration-500 ${
                isZoomed ? 'scale-150' : 'scale-100'
              }`}
              priority={selectedIndex === 0}
              quality={90}
            />
          </motion.div>
        </AnimatePresence>

        {/* Stock Badge */}
        {false && (
          <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-red-500/90 text-white text-xs font-semibold backdrop-blur-sm">
            Limited Stock
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <motion.button
              key={image.id}
              variants={thumbnailVariants}
              initial="rest"
              whileHover="hover"
              onClick={() => handleThumbnailClick(index)}
              className={`flex-shrink-0 relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                selectedIndex === index
                  ? 'border-slate-900 dark:border-white shadow-lg'
                  : 'border-slate-300 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/30'
              }`}
              aria-label={`View image ${index + 1}`}
              aria-current={selectedIndex === index}
            >
              <Image
                src={image.thumbnail || image.url}
                alt={`${title} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                quality={80}
              />

              {/* Selection Indicator */}
              {selectedIndex === index && (
                <motion.div
                  layoutId="gallery-indicator"
                  className="absolute inset-0 bg-white/10 rounded-[6px]"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      )}

      {/* Image Info Text */}
      {images.length > 1 && (
        <div className="text-xs text-slate-600 dark:text-slate-400">
          <p>
            Click thumbnails or use arrow keys to navigate • Click zoom icon to
            magnify
          </p>
        </div>
      )}
    </div>
  );
}
