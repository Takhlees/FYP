/** @type {import('next').Config} */
const nextConfig = {
  // Vercel-specific optimizations
  experimental: {
    serverComponentsExternalPackages: ['sharp', 'tesseract.js', 'pdf-lib', 'pdf-parse', 'canvas'],
  },

  // Proper webpack configuration for Vercel
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        'tesseract.js': 'commonjs tesseract.js',
        'pdf-lib': 'commonjs pdf-lib',
        'pdfjs-dist': 'commonjs pdfjs-dist',
        'canvas': 'commonjs canvas',
        'sharp': 'commonjs sharp',
      });
    }
    return config;
  },

  // Vercel function configuration
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
      {
        source: '/api/scanupload',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ];
  },

  // Increase function timeout for Vercel
  async rewrites() {
    return [
      {
        source: '/api/document-scanner',
        destination: '/api/document-scanner',
        has: [
          {
            type: 'header',
            key: 'x-vercel-timeout',
            value: '60',
          },
        ],
      },
    ];
  },
};

export default nextConfig;