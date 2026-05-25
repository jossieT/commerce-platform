'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ReactNode, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

interface PremiumHeroProps {
  images: HeroImage[];
  headline: ReactNode;
  subheading: string;
  ctas: Array<{
    label: string;
    href: string;
    variant: 'primary' | 'secondary';
  }>;
}

export function PremiumHero({ images, headline, subheading, ctas }: PremiumHeroProps) {
  const [isAutoScroll, setIsAutoScroll] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // Check for prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Resume auto-advance after 3 seconds of manual navigation
  useEffect(() => {
    if (!isAutoScroll && !prefersReducedMotion) {
      const timer = setTimeout(() => {
        setIsAutoScroll(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isAutoScroll, prefersReducedMotion]);

  // Auto-advance to next image every 5 seconds
  useEffect(() => {
    if (!isAutoScroll || prefersReducedMotion) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoScroll, prefersReducedMotion, images.length]);

  // Calculate the target position for the carousel (show current image)
  const targetPosition = -(currentImageIndex * 100);

  const handlePrevious = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsAutoScroll(false);
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
    setIsAutoScroll(false);
  };

  return (
    <section
      className="relative w-full overflow-hidden bg-slate-900 px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 h-[75vh] lg:h-[80vh] flex items-center justify-center"
      onMouseEnter={() => setIsAutoScroll(false)}
      onMouseLeave={() => setIsAutoScroll(true)}
    >
      {/* Background image carousel */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Lighter overlay gradient for better image visibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/40 via-slate-900/20 to-slate-900/40 z-10" />

        {/* Animated image carousel */}
        <motion.div
          className="flex h-full w-full"
          animate={{
            x: targetPosition + '%',
          }}
          transition={{
            duration: 0.8,
            ease: 'easeInOut',
          }}
        >
          {images.map((image, index) => (
            <div key={index} className="relative min-w-full h-full flex-shrink-0">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                priority={index === 0}
                sizes="100vw"
              />
            </div>
          ))}
        </motion.div>

        {/* Premium radial gradient accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent blur-3xl z-20 pointer-events-none" />
      </div>

      {/* Navigation Buttons */}
      <motion.button
        onClick={handlePrevious}
        className="absolute left-4 sm:left-6 lg:left-8 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-2 sm:p-3 rounded-full transition-all duration-300 hover:scale-110 group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Previous image"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </motion.button>

      <motion.button
        onClick={handleNext}
        className="absolute right-4 sm:right-6 lg:right-8 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-2 sm:p-3 rounded-full transition-all duration-300 hover:scale-110 group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Next image"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </motion.button>

      {/* Content overlay */}
      <div className="relative z-20 mx-auto max-w-3xl space-y-5 sm:space-y-6 lg:space-y-7 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-tight drop-shadow-lg">
            {headline}
          </h1>
        </motion.div>

        <motion.p
          className="mx-auto max-w-xl text-base sm:text-lg text-slate-200 leading-relaxed px-2 drop-shadow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
        >
          {subheading}
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 pt-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        >
          {ctas.map((cta) => (
            <CTAButton key={cta.href} cta={cta} />
          ))}
        </motion.div>
      </div>

      {/* Image indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {images.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => {
              setCurrentImageIndex(index);
              setIsAutoScroll(false);
            }}
            className={`transition-all duration-300 rounded-full ${
              index === currentImageIndex
                ? 'bg-white w-3 h-3'
                : 'bg-white/50 w-2 h-2 hover:bg-white/75'
            }`}
            whileHover={{ scale: 1.2 }}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

function CTAButton({
  cta,
}: {
  cta: {
    label: string;
    href: string;
    variant: 'primary' | 'secondary';
  };
}) {
  const isPrimary = cta.variant === 'primary';

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      <Link
        href={cta.href}
        className={`group relative inline-flex items-center justify-center overflow-hidden rounded-full font-semibold transition-all duration-300 ${
          isPrimary
            ? 'bg-white px-7 py-2.5 sm:px-8 sm:py-3 text-sm sm:text-base text-slate-900 hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] shadow-lg'
            : 'border border-slate-400/50 bg-slate-800/30 backdrop-blur-md px-7 py-2.5 sm:px-8 sm:py-3 text-sm sm:text-base text-white hover:bg-slate-700/50 hover:border-slate-300'
        }`}
      >
        {isPrimary && (
          <span className="absolute inset-0 bg-gradient-to-r from-blue-100 to-white opacity-0 transition duration-300 group-hover:opacity-100" />
        )}
        <span className="relative flex items-center gap-2">
          {cta.label}
          {isPrimary && (
            <svg
              className="w-4 h-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          )}
        </span>
      </Link>
    </motion.div>
  );
}
