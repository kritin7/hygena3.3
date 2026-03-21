/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.hygena.in',
  generateRobotsTxt: true,
  sitemapSize: 5000,

  exclude: [
    '/auth/*',
    '/checkout',
    '/dashboard',
    '/api/*',
    '/order-success'
  ],

  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
};
