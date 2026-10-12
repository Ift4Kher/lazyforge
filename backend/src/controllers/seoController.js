import { query } from '../config/database.js';

export const seoController = {
  /**
   * Dynamic XML Sitemap generator for search engine crawlers (Google, Bing)
   * GET /sitemap.xml or GET /api/v1/seo/sitemap.xml
   */
  async getSitemap(req, res, next) {
    try {
      const baseUrl = 'https://lazyforge.com';

      // 1. Static high-priority storefront URLs
      const staticUrls = [
        { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'daily' },
        { loc: `${baseUrl}/products`, priority: '0.9', changefreq: 'daily' },
        { loc: `${baseUrl}/categories`, priority: '0.8', changefreq: 'weekly' },
        { loc: `${baseUrl}/campaigns/robot-mascot`, priority: '0.8', changefreq: 'weekly' },
      ];

      // 2. Dynamic Categories
      const categories = await query('SELECT slug, updated_at FROM categories');
      const categoryUrls = categories.map((c) => ({
        loc: `${baseUrl}/products?category=${c.slug}`,
        lastmod: c.updated_at ? new Date(c.updated_at).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
        priority: '0.8',
        changefreq: 'weekly',
      }));

      // 3. Dynamic Products
      const products = await query('SELECT slug, updated_at FROM products WHERE is_active = TRUE');
      const productUrls = products.map((p) => ({
        loc: `${baseUrl}/products/${p.slug}`,
        lastmod: p.updated_at ? new Date(p.updated_at).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
        priority: '0.9',
        changefreq: 'daily',
      }));

      const allUrls = [...staticUrls, ...categoryUrls, ...productUrls];

      let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
      xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

      for (const item of allUrls) {
        xml += '  <url>\n';
        xml += `    <loc>${item.loc}</loc>\n`;
        if (item.lastmod) {
          xml += `    <lastmod>${item.lastmod}</lastmod>\n`;
        }
        xml += `    <changefreq>${item.changefreq || 'weekly'}</changefreq>\n`;
        xml += `    <priority>${item.priority || '0.5'}</priority>\n`;
        xml += '  </url>\n';
      }

      xml += '</urlset>';

      res.header('Content-Type', 'application/xml');
      res.send(xml);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Dynamic robots.txt
   * GET /robots.txt
   */
  async getRobots(req, res) {
    const content = [
      'User-agent: *',
      'Allow: /',
      'Disallow: /admin/',
      'Disallow: /api/',
      'Disallow: /account/',
      'Disallow: /checkout/',
      '',
      'Sitemap: https://lazyforge.com/sitemap.xml',
    ].join('\n');

    res.header('Content-Type', 'text/plain');
    res.send(content);
  },
};
