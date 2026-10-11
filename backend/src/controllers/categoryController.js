import { query } from '../config/database.js';

export async function getCategories(req, res, next) {
  try {
    const sql = `
      SELECT 
        c.id, c.name, c.slug, c.description, c.image_url, c.sort_order,
        COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON p.category_id = c.id AND p.is_active = TRUE
      WHERE c.is_active = TRUE
      GROUP BY c.id
      ORDER BY c.sort_order ASC, c.name ASC
    `;
    const rows = await query(sql);
    return res.status(200).json({
      success: true,
      categories: rows,
    });
  } catch (error) {
    next(error);
  }
}

export async function getCategoryBySlug(req, res, next) {
  try {
    const { slug } = req.params;
    const categoryRows = await query(
      'SELECT id, name, slug, description, image_url FROM categories WHERE slug = ? AND is_active = TRUE',
      [slug]
    );

    if (categoryRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    const category = categoryRows[0];

    // Fetch products in this category
    const products = await query(
      `SELECT 
        p.id, p.name, p.slug, p.sku, p.short_description, p.regular_price, p.sale_price, p.is_featured,
        (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as primary_image
       FROM products p
       WHERE p.category_id = ? AND p.is_active = TRUE
       ORDER BY p.is_featured DESC, p.created_at DESC`,
      [category.id]
    );

    return res.status(200).json({
      success: true,
      category,
      products,
    });
  } catch (error) {
    next(error);
  }
}
