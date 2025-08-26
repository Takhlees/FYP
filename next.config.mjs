/** @type {import('next').Config} */
const nextConfig = {
  // Remove problematic webpack aliases that break functionality
  webpack: (config, { isServer }) => {
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
    'canvas'           
  ],

  async headers() {
    return [
      {
        source: '/api/document-scanner',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ];
  },
};

export default nextConfig;