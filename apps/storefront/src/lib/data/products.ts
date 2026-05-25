/**
 * Mock Product Data
 * Production-grade example products with complete schema
 */

import { Product } from '@/types/product';

export const MOCK_PRODUCTS: Record<string, Product> = {
  'apex-pro-wireless': {
    id: '1',
    slug: 'apex-pro-wireless',
    title: 'Apex Pro Wireless',
    category: 'Electronics',
    subcategory: 'Audio',
    description:
      'Experience studio-quality sound with the Apex Pro Wireless. Engineered for audiophiles who demand clarity, these premium over-ear headphones feature active noise cancellation, 40-hour battery life, and seamless connectivity across all your devices.',
    price: 399,
    originalPrice: 499,
    discount: 20,
    currency: 'USD',
    images: [
      {
        id: '1',
        url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&h=1200&fit=crop',
        alt: 'Apex Pro Wireless Headphones - Front View',
        width: 1200,
        height: 1200,
        priority: true,
        thumbnail:
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      },
      {
        id: '2',
        url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=1200&h=1200&fit=crop',
        alt: 'Apex Pro Wireless Headphones - Side View',
        width: 1200,
        height: 1200,
        thumbnail:
          'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop',
      },
      {
        id: '3',
        url: 'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=1200&h=1200&fit=crop',
        alt: 'Apex Pro Wireless Headphones - Top View',
        width: 1200,
        height: 1200,
        thumbnail:
          'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=400&h=400&fit=crop',
      },
      {
        id: '4',
        url: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200&h=1200&fit=crop',
        alt: 'Apex Pro Wireless Headphones - Detail View',
        width: 1200,
        height: 1200,
        thumbnail:
          'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop',
      },
    ],
    rating: {
      average: 4.8,
      count: 2847,
      distribution: {
        5: 2200,
        4: 500,
        3: 100,
        2: 30,
        1: 17,
      },
    },
    reviews: [
      {
        id: '1',
        author: 'Sarah Chen',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        rating: 5,
        title: 'Best headphones I\'ve ever owned',
        content:
          'The sound quality is exceptional. The noise cancellation works perfectly for flights and commuting. Battery life easily gets me through a full week of daily use.',
        date: '2 weeks ago',
        verified: true,
        helpful: 342,
      },
      {
        id: '2',
        author: 'James Mitchell',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
        rating: 5,
        title: 'Worth every penny',
        content:
          'I use these for work calls and music production. The clarity is outstanding and the build quality feels premium. Customer service was also excellent.',
        date: '1 month ago',
        verified: true,
        helpful: 289,
      },
      {
        id: '3',
        author: 'Alex Rodriguez',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
        rating: 4,
        title: 'Great overall, minor comfort issue',
        content:
          'Sound quality is amazing and features are top-notch. Only small issue is they feel slightly tight after 3+ hours, but still very comfortable overall.',
        date: '3 weeks ago',
        verified: true,
        helpful: 156,
      },
    ],
    options: [
      {
        id: 'color',
        name: 'Color',
        type: 'color',
        required: true,
        variants: [
          {
            id: 'midnight',
            name: 'Midnight Black',
            value: 'Midnight Black',
            type: 'color',
            available: true,
            colorCode: '#1a1a1a',
            colorName: 'Midnight Black',
          },
          {
            id: 'silver',
            name: 'Lunar Silver',
            value: 'Lunar Silver',
            type: 'color',
            available: true,
            colorCode: '#c0c0c0',
            colorName: 'Lunar Silver',
          },
          {
            id: 'gold',
            name: 'Rose Gold',
            value: 'Rose Gold',
            type: 'color',
            available: true,
            colorCode: '#b76e79',
            colorName: 'Rose Gold',
          },
        ],
      },
    ],
    specifications: [
      { label: 'Driver Size', value: '50mm' },
      { label: 'Frequency Response', value: '20Hz - 20kHz' },
      { label: 'Impedance', value: '32Ω' },
      { label: 'Sensitivity', value: '98dB' },
      { label: 'Battery Life', value: '40 hours' },
      { label: 'Charging Time', value: '2 hours' },
      { label: 'Connectivity', value: ['Bluetooth 5.3', '3.5mm jack'] },
      { label: 'Weight', value: '285g' },
      { label: 'Warranty', value: '2 years' },
    ],
    features: [
      {
        id: '1',
        title: 'Active Noise Cancellation',
        description:
          'Advanced ANC technology blocks external noise for an immersive listening experience.',
        icon: '🔇',
      },
      {
        id: '2',
        title: 'Premium Audio Quality',
        description:
          'Studio-grade drivers deliver crystal-clear highs and deep, powerful bass.',
        icon: '🎵',
      },
      {
        id: '3',
        title: 'All-Day Battery',
        description:
          '40-hour battery life keeps you connected through the week.',
        icon: '🔋',
      },
      {
        id: '4',
        title: 'Seamless Connectivity',
        description:
          'Multipoint Bluetooth connects to up to 3 devices simultaneously.',
        icon: '🔗',
      },
    ],
    inStock: true,
    stockCount: 156,
    sku: 'APEX-PRO-WL-001',
    weight: 285,
    dimensions: {
      length: 190,
      width: 175,
      height: 85,
    },
    shipping: {
      free: true,
      estimatedDays: 2,
      message: 'Free express shipping on orders over $50',
    },
    warranty: {
      duration: '2 Years',
      description: 'Comprehensive hardware warranty covering manufacturing defects',
    },
    returns: {
      days: 30,
      description: '30-day money-back guarantee if not completely satisfied',
    },
    relatedProductIds: ['studio-pro-wired', 'sound-link-portable', 'bass-boost-earbuds'],
    metadata: {
      seoTitle: 'Apex Pro Wireless Headphones | Premium Studio-Quality Audio',
      seoDescription:
        'Experience premium sound with Apex Pro Wireless. Active noise cancellation, 40-hour battery, studio-grade audio. Ships free.',
      keywords: [
        'wireless headphones',
        'noise cancelling',
        'premium audio',
        'studio headphones',
        'bluetooth headphones',
      ],
    },
    createdAt: '2025-06-15',
    updatedAt: '2026-05-20',
  },

  'studio-pro-wired': {
    id: '2',
    slug: 'studio-pro-wired',
    title: 'Studio Pro Wired',
    category: 'Electronics',
    subcategory: 'Audio',
    description:
      'Professional-grade wired headphones for studio monitoring and critical listening. Zero latency, balanced audio profile, and premium materials ensure accuracy for music production.',
    price: 299,
    originalPrice: 349,
    discount: 14,
    currency: 'USD',
    images: [
      {
        id: '1',
        url: 'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=1200&h=1200&fit=crop',
        alt: 'Studio Pro Wired Headphones',
        width: 1200,
        height: 1200,
        priority: true,
        thumbnail:
          'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=400&h=400&fit=crop',
      },
    ],
    rating: {
      average: 4.9,
      count: 1240,
      distribution: {
        5: 1100,
        4: 120,
        3: 15,
        2: 3,
        1: 2,
      },
    },
    reviews: [],
    options: [
      {
        id: 'color',
        name: 'Color',
        type: 'color',
        required: true,
        variants: [
          {
            id: 'black',
            name: 'Studio Black',
            value: 'Studio Black',
            type: 'color',
            available: true,
            colorCode: '#000000',
          },
          {
            id: 'white',
            name: 'Pearl White',
            value: 'Pearl White',
            type: 'color',
            available: false,
            colorCode: '#ffffff',
          },
        ],
      },
    ],
    specifications: [
      { label: 'Impedance', value: '64Ω' },
      { label: 'Frequency Response', value: '15Hz - 20kHz' },
      { label: 'Cable Length', value: '3m (detachable)' },
      { label: 'Weight', value: '245g' },
    ],
    features: [],
    inStock: true,
    stockCount: 89,
    sku: 'STUDIO-PRO-WD-001',
    shipping: {
      free: true,
      estimatedDays: 2,
      message: 'Free shipping',
    },
    warranty: {
      duration: '3 Years',
      description: 'Professional warranty with priority support',
    },
    returns: {
      days: 30,
      description: '30-day return policy',
    },
    relatedProductIds: ['apex-pro-wireless'],
    metadata: {
      seoTitle: 'Studio Pro Wired Headphones | Professional Audio',
      seoDescription: 'Professional wired headphones for studio monitoring',
      keywords: ['studio headphones', 'wired headphones', 'professional audio'],
    },
    createdAt: '2025-07-01',
    updatedAt: '2026-05-20',
  },

  'sound-link-portable': {
    id: '3',
    slug: 'sound-link-portable',
    title: 'SoundLink Portable',
    category: 'Electronics',
    subcategory: 'Audio',
    description:
      'Compact portable speaker with 360-degree sound. Perfect for outdoor adventures and travel.',
    price: 129,
    currency: 'USD',
    images: [
      {
        id: '1',
        url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=1200&h=1200&fit=crop',
        alt: 'SoundLink Portable Speaker',
        width: 1200,
        height: 1200,
        priority: true,
        thumbnail:
          'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop',
      },
    ],
    rating: {
      average: 4.6,
      count: 892,
      distribution: {
        5: 700,
        4: 150,
        3: 30,
        2: 10,
        1: 2,
      },
    },
    reviews: [],
    options: [],
    specifications: [],
    features: [],
    inStock: true,
    stockCount: 234,
    sku: 'SOUND-LINK-001',
    shipping: {
      free: true,
      estimatedDays: 3,
      message: 'Free shipping',
    },
    returns: {
      days: 30,
      description: '30-day return policy',
    },
    relatedProductIds: ['apex-pro-wireless'],
    metadata: {
      seoTitle: 'SoundLink Portable Speaker',
      seoDescription: 'Portable bluetooth speaker with 360-degree sound',
      keywords: ['portable speaker', 'bluetooth speaker'],
    },
    createdAt: '2025-08-10',
    updatedAt: '2026-05-20',
  },

  'bass-boost-earbuds': {
    id: '4',
    slug: 'bass-boost-earbuds',
    title: 'Bass Boost Earbuds',
    category: 'Electronics',
    subcategory: 'Audio',
    description:
      'Compact wireless earbuds with enhanced bass and active noise cancellation.',
    price: 179,
    currency: 'USD',
    images: [
      {
        id: '1',
        url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=1200&h=1200&fit=crop',
        alt: 'Bass Boost Earbuds',
        width: 1200,
        height: 1200,
        priority: true,
        thumbnail:
          'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop',
      },
    ],
    rating: {
      average: 4.5,
      count: 567,
      distribution: {
        5: 420,
        4: 120,
        3: 20,
        2: 5,
        1: 2,
      },
    },
    reviews: [],
    options: [],
    specifications: [],
    features: [],
    inStock: true,
    stockCount: 445,
    sku: 'BASS-BOOST-001',
    shipping: {
      free: true,
      estimatedDays: 2,
      message: 'Free shipping',
    },
    returns: {
      days: 30,
      description: '30-day return policy',
    },
    relatedProductIds: ['apex-pro-wireless'],
    metadata: {
      seoTitle: 'Bass Boost Earbuds | Wireless Audio',
      seoDescription: 'Compact wireless earbuds with bass boost technology',
      keywords: ['earbuds', 'wireless earbuds', 'noise cancelling'],
    },
    createdAt: '2025-09-01',
    updatedAt: '2026-05-20',
  },
};

export async function getProductBySlug(slug: string): Promise<Product | null> {
  // In production, this would fetch from your API
  return MOCK_PRODUCTS[slug] || null;
}

export async function getProductById(id: string): Promise<Product | null> {
  // In production, this would fetch from your API
  return Object.values(MOCK_PRODUCTS).find((p) => p.id === id) || null;
}

export async function getRelatedProducts(productIds: string[]): Promise<Product[]> {
  // In production, this would fetch from your API
  return productIds
    .map((id) => Object.values(MOCK_PRODUCTS).find((p) => p.id === id))
    .filter(Boolean) as Product[];
}
