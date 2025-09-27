const nextConfig = {
  // Remove 'standalone' - Vercel handles this automatically
  images: {
    unoptimized: true,
  },
  experimental: {
    // Add bcryptjs for authentication
    serverComponentsExternalPackages: ['mongodb', 'bcryptjs'],
  },
  webpack(config, { dev, isServer }) {
    if (dev) {
      // Reduce CPU/memory from file watching (development only)
      config.watchOptions = {
        poll: 2000, // check every 2 seconds
        aggregateTimeout: 300, // wait before rebuilding
        ignored: ['**/node_modules'],
      };
    }
    
    // Handle bcryptjs for serverless environment
    if (isServer) {
      config.externals.push('bcryptjs');
    }
    
    return config;
  },
  // Remove onDemandEntries - not needed for Vercel
  async headers() {
    return [
      {
        // More specific API route targeting
        source: "/api/(.*)",
        headers: [
          { key: "Access-Control-Allow-Origin", value: process.env.CORS_ORIGINS || "*" },
          { key: "Access-Control-Allow-Methods", value: "GET, POST, PUT, DELETE, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization, X-Requested-With" },
          { key: "Access-Control-Allow-Credentials", value: "true" },
        ],
      },
      {
        // Security headers for all routes
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
  // Vercel-specific optimizations
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  
  // Redirect configuration (optional - for custom domain setup)
  async redirects() {
    return [
      // Add any redirects you need here
    ];
  },
  
  // Environment variable validation (optional but recommended)
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

module.exports = nextConfig;
