/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Handle heavy dependencies for deployment
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        canvas: false,
        'tesseract.js': false,
        'pdf-lib': false,
        'pdfjs-dist': false,
      };
    }
    
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        'tesseract.js': 'commonjs tesseract.js',
        'pdf-lib': 'commonjs pdf-lib',
        'pdfjs-dist': 'commonjs pdfjs-dist',
        'canvas': 'commonjs canvas',
      });
    }
    
    return config;
  },
  
  serverExternalPackages: [
    'sharp',          
    'pdf-parse',      
    'tesseract.js',    
    'pdf-lib',        
    'pdfjs-dist',     
  ],
};

export default nextConfig;