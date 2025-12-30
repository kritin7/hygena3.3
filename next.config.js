const nextConfig = {
  // Vercel handles output automatically - no need to specify 'standalone'
  images: {
    unoptimized: true,
    domains: ['images.unsplash.com'], // Add domains for external images
  },
  
  experimental: {
    // External packages for serverless functions
    serverComponentsExternalPackages: ['mongodb', 'bcryptjs', 'razorpay'],
  },
  
  webpack(config, { dev, isServer }) {
    // Development optimizations
    if (dev) {
      config.watchOptions = {
        poll: 2000,
        aggregateTimeout: 300,
        ignored: ['**/node_modules'],
      };
    }
    
    // Server-side externals for better serverless performance
    if (isServer) {
      config.externals.push('bcryptjs', 'razorpay');
    }
    
    return config;
  },
  
// CORS and Security Headers
  async headers() {
    return [
      {
        // API routes CORS
        source: "/api/(.*)",
        headers: [
          { 
            key: "Access-Control-Allow-Origin", 
            value: process.env.NODE_ENV === 'production' 
              ? process.env.VERCEL_URL 
                ? `https://${process.env.VERCEL_URL}` 
                : "https://your-domain.vercel.app"
              : "*" 
          },
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
          {
            key: "Content-Security-Policy",
            // UPDATED LINE BELOW:
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://connect.facebook.net; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: https: https://www.facebook.com; font-src 'self' data:; connect-src 'self' https: https://lumberjack.razorpay.com https://www.facebook.com; frame-src https://api.razorpay.com https://checkout.razorpay.com;"
          },
        ],
      },
    ];
  },
  
  // Vercel optimizations
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  
  // Environment variables for client-side
  env: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  },
  
  // Redirects (optional)
  async redirects() {
    return [
      // Add any redirects you need
      // Example:
      // {
      //   source: '/old-path',
      //   destination: '/new-path',
      //   permanent: true,
      // },
    ];
  },
  
  // Rewrites for better SEO (optional)
  async rewrites() {
    return [
      // Add any rewrites you need
      // Example:
      // {
      //   source: '/blog/:slug',
      //   destination: '/blog/[slug]',
      // },
    ];
  },
};

module.exports = nextConfig;
