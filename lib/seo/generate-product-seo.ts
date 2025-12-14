/**
 * Product SEO Auto-Generation System
 * Generates SEO fields based on product data
 */

export interface ProductSEOData {
  metaTitle: string;
  metaDescription: string;
  seoKeywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImageUrl: string;
  canonicalUrl: string;
}

export interface ProductDataForSEO {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price?: number;
  currency?: string;
  categoryNames?: string[];
  tags?: string[];
  firstImageUrl?: string;
}

/**
 * Generate SEO Title (30-60 chars, optimal 50-60)
 */
function generateSEOTitle(data: ProductDataForSEO): string {
  const name = data.name;
  const category = data.categoryNames?.[0] || 'Product';
  
  // Try patterns in order of preference
  const patterns = [
    `${name} - ${category} | Handmade Ceramics`,
    `${name} | ${category} - Handcrafted Pottery`,
    `${name} - ${category}`,
    `${name} | Handmade Ceramics`,
  ];

  // Find first pattern that fits within 60 chars
  for (const pattern of patterns) {
    if (pattern.length >= 30 && pattern.length <= 60) {
      return pattern;
    }
  }

  // Fallback: truncate intelligently
  const base = `${name} - ${category}`;
  if (base.length > 60) {
    const maxNameLen = 60 - ` - ${category}`.length;
    if (maxNameLen > 10) {
      return `${name.substring(0, maxNameLen)} - ${category}`;
    }
  }

  // Ensure minimum length
  if (base.length < 30) {
    return `${base} | Handmade Ceramics`.substring(0, 60);
  }

  return base.substring(0, 60);
}

/**
 * Generate SEO Description (120-160 chars, optimal 150-160)
 */
function generateSEODescription(data: ProductDataForSEO): string {
  const name = data.name;
  const description = data.description || '';
  const category = data.categoryNames?.[0] || 'handmade ceramics';
  const price = data.price ? `${data.price} ${data.currency || 'EUR'}` : '';
  
  // Extract first sentence or 100 chars from description
  const descSnippet = description
    .split(/[.!?]/)[0]
    .substring(0, 100)
    .trim() || `Discover our ${name.toLowerCase()}`;

  // Build description patterns
  const patterns = [
    `${descSnippet}. Handcrafted ${category} perfect for your home. ${price ? `Price: ${price}.` : ''} Shop now!`,
    `Explore our ${name.toLowerCase()}. Beautiful ${category} made with care. ${price ? `Available for ${price}.` : ''} Order today!`,
    `${name} - Premium ${category}. ${descSnippet}. ${price ? `Starting at ${price}.` : ''} Free shipping!`,
  ];

  // Find first pattern that fits within 160 chars
  for (const pattern of patterns) {
    if (pattern.length >= 120 && pattern.length <= 160) {
      return pattern;
    }
  }

  // Fallback: build a simple description
  let desc = `${descSnippet}. Handcrafted ${category}.`;
  if (price) {
    desc += ` Price: ${price}.`;
  }
  desc += ' Shop now!';

  // Ensure proper length
  if (desc.length < 120) {
    desc = `${desc} Free shipping on orders over 50 EUR.`;
  }

  return desc.substring(0, 160);
}

/**
 * Generate SEO Keywords (5-12 keywords)
 */
function generateSEOKeywords(data: ProductDataForSEO): string {
  const keywords: string[] = [];
  
  // Add product name variations
  const name = data.name.toLowerCase();
  keywords.push(name);
  if (name.includes(' ')) {
    keywords.push(name.replace(/\s+/g, '-'));
  }
  
  // Add category
  if (data.categoryNames && data.categoryNames.length > 0) {
    data.categoryNames.forEach(cat => {
      keywords.push(cat.toLowerCase());
    });
  }
  
  // Add tags
  if (data.tags && data.tags.length > 0) {
    data.tags.slice(0, 5).forEach(tag => {
      keywords.push(tag.toLowerCase());
    });
  }
  
  // Add generic keywords
  keywords.push('handmade ceramics', 'pottery', 'ceramic', 'handcrafted');
  
  // Remove duplicates and limit to 12
  const uniqueKeywords = [...new Set(keywords)].slice(0, 12);
  
  return uniqueKeywords.join(', ');
}

/**
 * Generate OG Title
 */
function generateOGTitle(data: ProductDataForSEO): string {
  const name = data.name;
  const category = data.categoryNames?.[0] || 'Handmade Ceramics';
  return `${name} - ${category} | Handcrafted Pottery`;
}

/**
 * Generate OG Description
 */
function generateOGDescription(data: ProductDataForSEO): string {
  const name = data.name;
  const description = data.description || '';
  const descSnippet = description.substring(0, 100).trim() || `Discover our ${name.toLowerCase()}`;
  return `${descSnippet}. Handcrafted ceramics made with care. Shop now!`;
}

/**
 * Generate OG Image URL
 */
function generateOGImageUrl(data: ProductDataForSEO, baseUrl: string): string {
  if (data.firstImageUrl) {
    // If it's already a full URL, return it
    if (data.firstImageUrl.startsWith('http')) {
      return data.firstImageUrl;
    }
    // Otherwise, make it absolute
    return `${baseUrl}${data.firstImageUrl.startsWith('/') ? '' : '/'}${data.firstImageUrl}`;
  }
  return '';
}

/**
 * Generate Canonical URL
 */
function generateCanonicalUrl(data: ProductDataForSEO, baseUrl: string): string {
  const slug = data.slug || `product-${data.id}`;
  return `${baseUrl}/products/${slug}`;
}

/**
 * Main function to generate all SEO data for a product
 */
export function generateProductSEO(
  productData: ProductDataForSEO,
  baseUrl: string = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
): ProductSEOData {
  return {
    metaTitle: generateSEOTitle(productData),
    metaDescription: generateSEODescription(productData),
    seoKeywords: generateSEOKeywords(productData),
    ogTitle: generateOGTitle(productData),
    ogDescription: generateOGDescription(productData),
    ogImageUrl: generateOGImageUrl(productData, baseUrl),
    canonicalUrl: generateCanonicalUrl(productData, baseUrl),
  };
}

