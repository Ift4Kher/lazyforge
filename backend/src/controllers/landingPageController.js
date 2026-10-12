import { query, transaction } from '../config/database.js';
import { sanitizeSections, sanitizeCss } from '../utils/sanitizer.js';
import { logger } from '../utils/logger.js';

export const landingPageController = {
  /**
   * Admin: List all landing pages with telemetry & version counts
   * GET /api/v1/admin/landing-pages
   */
  async getAdminLandingPages(req, res, next) {
    try {
      const rows = await query(`
        SELECT 
          lp.id, lp.title, lp.slug, lp.status, lp.meta_title, lp.meta_description,
          lp.published_version_id, lp.created_at, lp.updated_at,
          COUNT(v.id) AS version_count,
          MAX(v.version_number) AS latest_version_number
        FROM landing_pages lp
        LEFT JOIN landing_page_versions v ON lp.id = v.landing_page_id
        GROUP BY lp.id
        ORDER BY lp.updated_at DESC
      `);

      res.json({
        success: true,
        data: rows.map((r) => ({
          ...r,
          version_count: Number(r.version_count || 0),
          latest_version_number: Number(r.latest_version_number || 0),
        })),
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Admin: Get single landing page with version details
   * GET /api/v1/admin/landing-pages/:slugOrId
   */
  async getLandingPageBySlugOrId(req, res, next) {
    try {
      const { slugOrId } = req.params;

      const pages = await query(
        `SELECT * FROM landing_pages WHERE id = ? OR slug = ? LIMIT 1`,
        [slugOrId, slugOrId]
      );

      if (pages.length === 0) {
        return res.status(404).json({ success: false, error: 'Landing page not found' });
      }

      const page = pages[0];

      // Fetch all versions ordered by version_number DESC
      const versions = await query(
        `SELECT id, version_number, layout_json, custom_css, is_published, created_at
         FROM landing_page_versions
         WHERE landing_page_id = ?
         ORDER BY version_number DESC`,
        [page.id]
      );

      const parsedVersions = versions.map((v) => ({
        ...v,
        layout: typeof v.layout_json === 'string' ? JSON.parse(v.layout_json) : v.layout_json,
      }));

      // Active version is either published version or latest version
      const activeVersion =
        parsedVersions.find((v) => v.id === page.published_version_id) ||
        parsedVersions[0] ||
        null;

      res.json({
        success: true,
        data: {
          page,
          activeVersion,
          versions: parsedVersions,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Admin: Create or update landing page, generating a new immutable version
   * POST /api/v1/admin/landing-pages
   */
  async saveLandingPage(req, res, next) {
    try {
      const {
        title,
        slug,
        status = 'published',
        meta_title,
        meta_description,
        sections = [],
        custom_css = '',
        campaign_id = null,
        product_id = null,
      } = req.body;

      if (!title || !slug) {
        return res.status(400).json({
          success: false,
          error: 'Title and URL slug are required',
        });
      }

      // Format slug to lowercase URL-safe format
      const formattedSlug = slug
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9-_]/g, '-')
        .replace(/-+/g, '-');

      // Sanitize sections & custom CSS (REQ-10)
      const sanitizedSections = sanitizeSections(sections);
      const sanitizedCss = sanitizeCss(custom_css);

      let savedPageId = null;
      let newVersionNumber = 1;
      let newVersionId = null;

      await transaction(async (conn) => {
        // 1. Check if landing page exists
        const [existing] = await conn.query(
          'SELECT id, status, published_version_id FROM landing_pages WHERE slug = ? FOR UPDATE',
          [formattedSlug]
        );

        if (existing.length > 0) {
          savedPageId = existing[0].id;
          await conn.query(
            `UPDATE landing_pages
             SET title = ?, status = ?, meta_title = ?, meta_description = ?,
                 campaign_id = ?, product_id = ?, updated_at = NOW()
             WHERE id = ?`,
            [
              title,
              status,
              meta_title || title,
              meta_description || '',
              campaign_id,
              product_id,
              savedPageId,
            ]
          );

          // Get max version number
          const [versionRows] = await conn.query(
            'SELECT COALESCE(MAX(version_number), 0) AS max_v FROM landing_page_versions WHERE landing_page_id = ?',
            [savedPageId]
          );
          newVersionNumber = (versionRows[0]?.max_v || 0) + 1;
        } else {
          // Create new landing page
          const [insertRes] = await conn.query(
            `INSERT INTO landing_pages (title, slug, status, meta_title, meta_description, campaign_id, product_id)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
              title,
              formattedSlug,
              status,
              meta_title || title,
              meta_description || '',
              campaign_id,
              product_id,
            ]
          );
          savedPageId = insertRes.insertId;
          newVersionNumber = 1;
        }

        const isPublished = status === 'published';

        // 2. Insert new version
        const [vInsertRes] = await conn.query(
          `INSERT INTO landing_page_versions
           (landing_page_id, version_number, layout_json, custom_css, is_published, created_by)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            savedPageId,
            newVersionNumber,
            JSON.stringify(sanitizedSections),
            sanitizedCss,
            isPublished,
            req.user?.id || null,
          ]
        );
        newVersionId = vInsertRes.insertId;

        // 3. If published, link published_version_id
        if (isPublished) {
          await conn.query(
            'UPDATE landing_pages SET published_version_id = ?, status = ? WHERE id = ?',
            [newVersionId, 'published', savedPageId]
          );
          await conn.query(
            'UPDATE landing_page_versions SET is_published = FALSE WHERE landing_page_id = ? AND id != ?',
            [savedPageId, newVersionId]
          );
        }
      });

      logger.info('Landing page saved with new version', {
        pageId: savedPageId,
        slug: formattedSlug,
        version: newVersionNumber,
      });

      res.status(201).json({
        success: true,
        message: `Landing page saved successfully as Version ${newVersionNumber}`,
        data: {
          id: savedPageId,
          slug: formattedSlug,
          title,
          status,
          versionNumber: newVersionNumber,
          versionId: newVersionId,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Admin: Delete a landing page and all its versions
   * DELETE /api/v1/admin/landing-pages/:id
   */
  async deleteLandingPage(req, res, next) {
    try {
      const { id } = req.params;

      const result = await query('DELETE FROM landing_pages WHERE id = ?', [id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, error: 'Landing page not found' });
      }

      res.json({
        success: true,
        message: 'Landing page deleted successfully',
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Public Storefront: Get published campaign landing page by slug
   * GET /api/v1/campaigns/:slug
   */
  async getPublicLandingPage(req, res, next) {
    try {
      const { slug } = req.params;

      const pages = await query(
        `SELECT lp.id, lp.title, lp.slug, lp.status, lp.meta_title, lp.meta_description,
                lp.published_version_id, lp.created_at, lp.updated_at,
                v.layout_json, v.custom_css, v.version_number
         FROM landing_pages lp
         LEFT JOIN landing_page_versions v ON lp.published_version_id = v.id
         WHERE lp.slug = ? AND lp.status = 'published'
         LIMIT 1`,
        [slug]
      );

      if (pages.length === 0) {
        return res.status(404).json({
          success: false,
          error: `Campaign '${slug}' not found or not published.`,
        });
      }

      const p = pages[0];
      let sections = [];
      try {
        sections = typeof p.layout_json === 'string' ? JSON.parse(p.layout_json) : (p.layout_json || []);
      } catch {
        sections = [];
      }

      res.json({
        success: true,
        data: {
          id: p.id,
          title: p.title,
          slug: p.slug,
          metaTitle: p.meta_title || p.title,
          metaDescription: p.meta_description || '',
          versionNumber: p.version_number,
          sections,
          customCss: p.custom_css || '',
          updatedAt: p.updated_at,
        },
      });
    } catch (err) {
      next(err);
    }
  },
};
