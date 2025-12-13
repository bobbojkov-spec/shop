// Sample images from public/images for admin placeholders

export const sampleProductImages = [
  "/images/product-3.jpg",
  "/images/product-5.jpg",
  "/images/product-6.jpg",
  "/images/product-7.jpg",
  "/images/product-8.jpg",
  "/images/product-9.jpg",
  "/images/product-10.jpg",
  "/images/product-16.jpg",
  "/images/product-18.jpg",
  "/images/product-43.jpg",
];

export const sampleHeroImages = [
  "/images/h3-slide-1.jpg",
  "/images/h3-slide-2.jpg",
  "/images/h3-slide-3.jpg",
  "/images/home-img-1a.png",
  "/images/home-img-2a.png",
  "/images/home-img-3a.png",
];

export const sampleBlogImages = [
  "/images/blog-1s.jpg",
  "/images/blog-2s.jpg",
  "/images/blog-3s.jpg",
  "/images/blog-post-13.jpg",
  "/images/blog-post-14.jpg",
  "/images/blog-post-15.jpg",
  "/images/blog-post-18.jpg",
  "/images/blog-post-19.jpg",
  "/images/blog-post-22.jpg",
  "/images/blog-post-25.jpg",
];

export const sampleCategoryImages = [
  "/images/product-3-300x300.jpg",
  "/images/product-5-300x300.jpg",
  "/images/product-6-300x300.jpg",
  "/images/product-7-300x300.jpg",
  "/images/product-8-300x300.jpg",
  "/images/product-9-300x300.jpg",
];

export const samplePageImages = [
  "/images/about-us-img-1-1.jpg",
  "/images/about-us-img-3.jpg",
  "/images/contact-img-1.jpg",
  "/images/contact-img-2.jpg",
  "/images/title-img-3.jpg",
];

export function getRandomImage(images: string[]): string {
  return images[Math.floor(Math.random() * images.length)];
}

export function getRandomImages(count: number, images: string[]): string[] {
  const shuffled = [...images].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, images.length));
}

