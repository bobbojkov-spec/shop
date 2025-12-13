/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: false,
  },
  // Exclude the root admin directory from build
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
}

module.exports = nextConfig

