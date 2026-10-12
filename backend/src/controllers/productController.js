import { query } from '../config/database.js';

export async function getProducts(req, res, next) {
  try {
    const {
      category,
      search,
      min_price,
      max_price,
      in_stock,
      featured,
      sort = 'popular',
      page = 1,
      limit = 12,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));
    const offset = (pageNum - 1) * limitNum;

    const conditions = ['p.is_active = TRUE'];
    const params = [];

    // Filter by category slug
    if (category) {
      conditions.push('c.slug = ?');
      params.push(category);
    }

    // Search query
    if (search && search.trim()) {
      conditions.push('(p.name LIKE ? OR p.short_description LIKE ? OR p.sku LIKE ?)');
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    // Min price
    if (min_price && !isNaN(Number(min_price))) {
      conditions.push('COALESCE(p.sale_price, p.regular_price) >= ?');
      params.push(Number(min_price));
    }

    // Max price
    if (max_price && !isNaN(Number(max_price))) {
      conditions.push('COALESCE(p.sale_price, p.regular_price) <= ?');
      params.push(Number(max_price));
    }

    // Featured filter
    if (featured === 'true' || featured === true || featured === '1') {
      conditions.push('p.is_featured = TRUE');
    }

    // In Stock filter (has at least one variant with stock > 0)
    if (in_stock === 'true' || in_stock === true || in_stock === '1') {
      conditions.push(`
        EXISTS (
          SELECT 1 FROM product_variants pv 
          WHERE pv.product_id = p.id AND pv.is_active = TRUE AND pv.stock_quantity > 0
        )
      `);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Count total products matching filters
    const countSql = `
      SELECT COUNT(DISTINCT p.id) as total
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      ${whereClause}
    `;
    const countResult = await query(countSql, params);
    const total = countResult[0]?.total || 0;

    // Sorting
    let orderBy = 'p.is_featured DESC, p.created_at DESC';
    if (sort === 'price_asc') {
      orderBy = 'COALESCE(p.sale_price, p.regular_price) ASC';
    } else if (sort === 'price_desc') {
      orderBy = 'COALESCE(p.sale_price, p.regular_price) DESC';
    } else if (sort === 'newest') {
      orderBy = 'p.created_at DESC';
    } else if (sort === 'name_asc') {
      orderBy = 'p.name ASC';
    }

    // Query paginated products
    const dataSql = `
      SELECT 
        p.id, p.name, p.slug, p.sku, p.short_description, 
        p.regular_price, p.sale_price, p.is_featured, p.category_id,
        p.model_3d_url, p.model_3d_format,
        c.name as category_name, c.slug as category_slug,
        (
          SELECT image_url 
          FROM product_images pi 
          WHERE pi.product_id = p.id 
          ORDER BY pi.is_primary DESC, pi.sort_order ASC 
          LIMIT 1
        ) as primary_image,
        COALESCE(
          (SELECT SUM(stock_quantity) FROM product_variants WHERE product_id = p.id AND is_active = TRUE),
          0
        ) as total_stock
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      ${whereClause}
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?
    `;

    const productRows = await query(dataSql, [...params, limitNum, offset]);

    return res.status(200).json({
      success: true,
      products: productRows,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getFeaturedProducts(req, res, next) {
  try {
    const limit = parseInt(req.query.limit, 10) || 8;
    const sql = `
      SELECT 
        p.id, p.name, p.slug, p.sku, p.short_description,
        p.regular_price, p.sale_price, p.is_featured,
        p.model_3d_url, p.model_3d_format,
        c.name as category_name, c.slug as category_slug,
        (
          SELECT image_url 
          FROM product_images pi 
          WHERE pi.product_id = p.id 
          ORDER BY pi.is_primary DESC, pi.sort_order ASC 
          LIMIT 1
        ) as primary_image,
        COALESCE(
          (SELECT SUM(stock_quantity) FROM product_variants WHERE product_id = p.id AND is_active = TRUE),
          0
        ) as total_stock
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE p.is_active = TRUE AND p.is_featured = TRUE
      ORDER BY p.created_at DESC
      LIMIT ?
    `;
    const rows = await query(sql, [limit]);
    return res.status(200).json({
      success: true,
      products: rows,
    });
  } catch (error) {
    next(error);
  }
}

export async function getProductBySlug(req, res, next) {
  try {
    const { slug } = req.params;

    const productRows = await query(
      `SELECT 
        p.id, p.name, p.slug, p.sku, p.short_description, p.description,
        p.specifications, p.regular_price, p.sale_price, p.is_featured,
        p.model_3d_url, p.model_3d_format, p.meta_title, p.meta_description,
        p.category_id,
        c.name as category_name, c.slug as category_slug
       FROM products p
       LEFT JOIN categories c ON c.id = p.category_id
       WHERE p.slug = ? AND p.is_active = TRUE`,
      [slug]
    );

    if (productRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const product = productRows[0];

    // Parse specifications JSON safely
    if (typeof product.specifications === 'string') {
      try {
        product.specifications = JSON.parse(product.specifications);
      } catch {
        product.specifications = {};
      }
    }

    // Fetch all images
    const images = await query(
      'SELECT id, image_url, alt_text, sort_order, is_primary FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, sort_order ASC',
      [product.id]
    );

    // Fetch all variants
    const variants = await query(
      `SELECT 
        id, sku, variant_name, attribute_name, attribute_value, 
        price_adjustment, stock_quantity
       FROM product_variants 
       WHERE product_id = ? AND is_active = TRUE
       ORDER BY id ASC`,
      [product.id]
    );

    // Fetch related products in the same category
    const relatedProducts = await query(
      `SELECT 
        p.id, p.name, p.slug, p.regular_price, p.sale_price,
        c.name as category_name,
        (
          SELECT image_url 
          FROM product_images pi 
          WHERE pi.product_id = p.id 
          ORDER BY pi.is_primary DESC, pi.sort_order ASC 
          LIMIT 1
        ) as primary_image
       FROM products p
       LEFT JOIN categories c ON c.id = p.category_id
       WHERE p.category_id = ? AND p.id != ? AND p.is_active = TRUE
       LIMIT 4`,
      [product.category_id, product.id]
    );

    return res.status(200).json({
      success: true,
      product: {
        ...product,
        images,
        variants,
        relatedProducts,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Public: Get products available for 3D Showcase
 * GET /api/v1/products/3d-models
 */
export async function get3DProducts(req, res, next) {
  try {
    const sql = `
      SELECT 
        p.id, p.name, p.slug, p.sku, p.short_description, p.description,
        p.specifications, p.regular_price, p.sale_price, p.is_featured,
        p.model_3d_url, p.model_3d_format,
        c.name as category_name, c.slug as category_slug,
        (
          SELECT image_url 
          FROM product_images pi 
          WHERE pi.product_id = p.id 
          ORDER BY pi.is_primary DESC, pi.sort_order ASC 
          LIMIT 1
        ) as primary_image,
        COALESCE(
          (SELECT SUM(stock_quantity) FROM product_variants WHERE product_id = p.id AND is_active = TRUE),
          0
        ) as total_stock
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE p.is_active = TRUE
      ORDER BY (p.model_3d_url IS NOT NULL) DESC, p.id ASC
    `;
    const rows = await query(sql);
    const parsed = rows.map((r) => {
      let specs = {};
      if (typeof r.specifications === 'string') {
        try { specs = JSON.parse(r.specifications); } catch {}
      } else if (r.specifications) {
        specs = r.specifications;
      }
      return { ...r, specifications: specs };
    });
    return res.status(200).json({
      success: true,
      data: parsed,
      products: parsed,
    });
  } catch (error) {
    next(error);
  }
}
