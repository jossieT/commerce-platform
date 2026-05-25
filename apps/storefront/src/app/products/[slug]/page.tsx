/**
 * Dynamic Product Route
 * /products/[slug] page with metadata generation
 */

import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductPage } from '@/components/product/ProductPage';
import {
  getProductBySlug,
  getRelatedProducts,
} from '@/lib/data/products';

interface ProductRouteProps {
  params: {
    slug: string;
  };
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata(
  { params }: ProductRouteProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The product you are looking for does not exist.',
    };
  }

  const productUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://localhost:3000'}/products/${params.slug}`;

  return {
    title: product.metadata.seoTitle || product.title,
    description:
      product.metadata.seoDescription || product.description,
    keywords: product.metadata.keywords,
    openGraph: {
      type: 'website',
      url: productUrl,
      title: product.metadata.seoTitle || product.title,
      description:
        product.metadata.seoDescription || product.description,
      images: product.images.map((img) => ({
        url: img.url,
        width: img.width,
        height: img.height,
        alt: img.alt,
      })),
    },
    twitter: {
      card: 'summary_large_image',
      title: product.metadata.seoTitle || product.title,
      description:
        product.metadata.seoDescription || product.description,
      images: [product.images[0]?.url || ''],
    },
    robots: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
    alternates: {
      canonical: productUrl,
    },
  };
}

/**
 * Generate static params for ISR
 */
export async function generateStaticParams() {
  // In production, fetch all product slugs from your database
  // For now, return an empty array and use ISR to generate on demand
  return [];
}

/**
 * Main Product Page Component
 */
export default async function ProductRoute({ params }: ProductRouteProps) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  // Fetch related products
  const relatedProducts = await getRelatedProducts(
    product.relatedProductIds
  );

  // Structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.images.map((img) => img.url),
    brand: {
      '@type': 'Brand',
      name: 'Premium Brand', // Update with actual brand
    },
    offers: {
      '@type': 'Offer',
      url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://localhost:3000'}/products/${params.slug}`,
      priceCurrency: product.currency,
      price: product.price.toString(),
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Premium Store',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating.average.toString(),
      ratingCount: product.rating.count.toString(),
      bestRating: '5',
      worstRating: '1',
    },
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Product Page */}
      <ProductPage product={product} relatedProducts={relatedProducts} />
    </>
  );
}

/**
 * Revalidate time for ISR (in seconds)
 * 3600 = 1 hour
 */
export const revalidate = 3600;
