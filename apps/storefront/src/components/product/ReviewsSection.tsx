/**
 * Product Reviews Section
 * Display customer reviews with ratings and helpful votes
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ThumbsUp, Star } from 'lucide-react';
import { ProductRating, ProductReview } from '@/types/product';

interface ReviewsSectionProps {
  rating: ProductRating;
  reviews: ProductReview[];
  onLeaveReview?: () => void;
}

interface RatingBarProps {
  stars: number;
  count: number;
  percentage: number;
}

function RatingBar({ stars, count, percentage }: RatingBarProps) {
  return (
    <motion.div
      className="flex items-center gap-3"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      viewport={{ once: true }}
    >
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < stars
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-slate-600'
            }`}
          />
        ))}
      </div>
      <div className="flex-1 max-w-48">
        <div className="h-2 bg-slate-800/50 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500"
            initial={{ width: 0 }}
            whileInView={{ width: `${percentage}%` }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          />
        </div>
      </div>
      <span className="text-sm text-slate-400 w-12 text-right">{count}</span>
    </motion.div>
  );
}

interface ReviewCardProps {
  review: ProductReview;
}

function ReviewCard({ review }: ReviewCardProps) {
  const [helpful, setHelpful] = useState(false);
  const [helpCount, setHelpCount] = useState(review.helpful);

  const toggleHelpful = () => {
    setHelpful(!helpful);
    setHelpCount(helpful ? helpCount - 1 : helpCount + 1);
  };

  return (
    <motion.div
      className="p-6 rounded-lg bg-slate-800/20 border border-slate-700/30 hover:border-slate-700/50 transition-colors duration-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      viewport={{ once: true }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {review.avatar && (
            <Image
              src={review.avatar}
              alt={review.author}
              width={40}
              height={40}
              className="rounded-full"
            />
          )}
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white">{review.author}</h3>
              {review.verified && (
                <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs font-medium">
                  Verified Purchase
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">{review.date}</p>
          </div>
        </div>
      </div>

      {/* Rating */}
      <div className="flex gap-2 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < review.rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-slate-600'
            }`}
          />
        ))}
      </div>

      {/* Title & Content */}
      {review.title && (
        <h4 className="font-semibold text-white mb-2">{review.title}</h4>
      )}
      <p className="text-slate-300 text-sm leading-relaxed mb-4">
        {review.content}
      </p>

      {/* Footer */}
      <div className="flex items-center gap-6 pt-4 border-t border-slate-700/30">
        <button
          onClick={toggleHelpful}
          className={`flex items-center gap-2 text-sm transition-colors duration-300 ${
            helpful
              ? 'text-blue-400'
              : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          <ThumbsUp className={`w-4 h-4 ${helpful ? 'fill-current' : ''}`} />
          Helpful ({helpCount})
        </button>
        <span className="text-xs text-slate-500">
          {Math.round((helpCount / 1000) * 100)}% found this helpful
        </span>
      </div>
    </motion.div>
  );
}

export function ReviewsSection({
  rating,
  reviews,
  onLeaveReview,
}: ReviewsSectionProps) {
  const totalReviews = rating.count;

  return (
    <section className="border-t border-slate-800/50 pt-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Rating Summary */}
        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold text-white mb-8">
            Customer Reviews
          </h2>

          {/* Overall Rating */}
          <div className="mb-8">
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-5xl font-bold text-white">
                {rating.average.toFixed(1)}
              </span>
              <span className="text-slate-400">out of 5</span>
            </div>

            {/* Star Display */}
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.round(rating.average)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-slate-600'
                  }`}
                />
              ))}
            </div>

            <p className="text-sm text-slate-400 mb-6">
              Based on {totalReviews.toLocaleString()} verified reviews
            </p>

            {/* CTA Button */}
            <button
              onClick={onLeaveReview}
              className="w-full px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors duration-300"
            >
              Write a Review
            </button>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-4">
            {[5, 4, 3, 2, 1].map((stars) => (
              <RatingBar
                key={stars}
                stars={stars}
                count={rating.distribution[stars as keyof typeof rating.distribution]}
                percentage={
                  (rating.distribution[
                    stars as keyof typeof rating.distribution
                  ] / totalReviews) *
                  100
                }
              />
            ))}
          </div>
        </motion.div>

        {/* Reviews List */}
        <div className="lg:col-span-2">
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <ReviewCard review={review} />
                </motion.div>
              ))}

              {reviews.length > 0 && (
                <motion.button
                  className="w-full mt-6 px-4 py-3 rounded-lg border border-slate-700/50 hover:border-slate-700 text-slate-300 hover:text-white font-medium text-sm transition-all duration-300"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  Load More Reviews
                </motion.button>
              )}
            </div>
          ) : (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              viewport={{ once: true }}
            >
              <p className="text-slate-400 mb-4">
                No reviews yet. Be the first to review this product!
              </p>
              <button
                onClick={onLeaveReview}
                className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors duration-300"
              >
                Write the First Review
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
