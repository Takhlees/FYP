// import withOptimizedImages from 'next-optimized-images';

// /** @type {import('next').NextConfig} */
// const nextConfig = withOptimizedImages({
//   images: {
//     disableStaticImages: true, // Optional, disable Next.js built-in image optimization
   
//   },
// });

  

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Help with tesseract.js server-side rendering
      config.externals.push({
        'tesseract.js': 'tesseract.js'
      });
    }
    
    // Handle canvas - only disable for client-side
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        canvas: false,
      };
    }
    
    return config;
  },
  

  serverExternalPackages: ['tesseract.js', 'sharp', 'pdf-parse', 'pdfjs-dist', 'canvas'],
  
  // Optional: Additional optimizations for image processing
  // images: {
  //   domains: ['localhost'],
  //   dangerouslyAllowSVG: true,
  // },

};

export default nextConfig;