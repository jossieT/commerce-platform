'use client';

import { ProductImage } from '@/lib/products-api';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  // Ensure we have at least one image
  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-[4/5] bg-brand-50 flex items-center justify-center rounded-2xl">
        <span className="text-brand-400">No images available</span>
      </div>
    );
  }

  // Sort images so thumbnail is first, then by displayOrder
  const sortedImages = [...images].sort((a, b) => {
    if (a.isThumbnail && !b.isThumbnail) return -1;
    if (!a.isThumbnail && b.isThumbnail) return 1;
    return a.displayOrder - b.displayOrder;
  });

  const selectedImage = sortedImages[selectedIndex];

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4 lg:gap-6 sticky top-24">
      {/* Thumbnails Sidebar (Left on Desktop, Bottom on Mobile) */}
      {sortedImages.length > 1 && (
        <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto lg:max-h-[80vh] scrollbar-hide py-1 lg:py-0 w-full lg:w-20 lg:flex-shrink-0 snap-x">
          {sortedImages.map((img, index) => (
            <button
              key={img.id}
              onClick={() => setSelectedIndex(index)}
              className={`relative w-16 lg:w-full aspect-[4/5] rounded-lg overflow-hidden flex-shrink-0 transition-all duration-300 snap-start
                ${selectedIndex === index ? 'ring-2 ring-brand-900 ring-offset-2' : 'opacity-60 hover:opacity-100'}
              `}
            >
              <Image
                src={img.url}
                alt={img.altText || `${productName} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image Stage */}
      <div className="relative w-full aspect-[4/5] lg:aspect-[3/4] rounded-2xl overflow-hidden bg-brand-50 group">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={selectedImage.url}
              alt={selectedImage.altText || productName}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority={selectedIndex === 0}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
