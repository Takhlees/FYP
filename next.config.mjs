import withOptimizedImages from 'next-optimized-images';

/** @type {import('next').NextConfig} */
const nextConfig = withOptimizedImages({
  images: {
    disableStaticImages: true, // Optional, disable Next.js built-in image optimization
   
  },
});

  

export default nextConfig;