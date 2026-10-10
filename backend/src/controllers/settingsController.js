import { query, execute } from '../config/database.js';

export async function getPublicSettings(req, res, next) {
  try {
    const settingsRows = await query(
      'SELECT setting_key, setting_value FROM site_settings WHERE setting_key IN (?, ?)',
      ['hero_configuration', 'general_settings']
    );

    let hero = null;
    let general = null;

    for (const row of settingsRows) {
      if (row.setting_key === 'hero_configuration') {
        hero = typeof row.setting_value === 'string' ? JSON.parse(row.setting_value) : row.setting_value;
      } else if (row.setting_key === 'general_settings') {
        general = typeof row.setting_value === 'string' ? JSON.parse(row.setting_value) : row.setting_value;
      }
    }

    const shippingZones = await query(
      'SELECT id, name, fee, estimated_days FROM shipping_zones WHERE is_active = TRUE ORDER BY fee ASC'
    );

    res.json({
      success: true,
      data: {
        hero,
        general,
        shippingZones,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function updateHeroSettings(req, res, next) {
  try {
    const heroConfig = req.body;

    if (!heroConfig || typeof heroConfig !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Invalid hero configuration payload.',
      });
    }

    await execute(
      `INSERT INTO site_settings (setting_key, setting_value)
       VALUES ('hero_configuration', ?)
       ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
      [JSON.stringify(heroConfig)]
    );

    res.json({
      success: true,
      message: 'Hero configuration updated successfully.',
      data: heroConfig,
    });
  } catch (err) {
    next(err);
  }
}
