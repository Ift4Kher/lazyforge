import { query, execute } from '../config/database.js';

const BDCOURIER_API_URL = process.env.BDCOURIER_BASE_URL || 'https://api.bdcourier.com';

/**
 * Clean and format Bangladeshi 11-digit phone number (e.g. 017XXXXXXXX)
 */
export function sanitizeBDPhone(phone) {
  if (!phone) return '';
  let cleaned = String(phone).replace(/[^0-9]/g, '');
  if (cleaned.startsWith('880')) {
    cleaned = cleaned.substring(2);
  } else if (cleaned.startsWith('88')) {
    cleaned = cleaned.substring(2);
  }
  if (cleaned.length === 10 && !cleaned.startsWith('0')) {
    cleaned = '0' + cleaned;
  }
  return cleaned;
}

/**
 * Retrieve BDCourier API configuration from database or environment
 */
export async function getBDCourierConfig() {
  try {
    const rows = await query(
      "SELECT setting_value FROM site_settings WHERE setting_key = 'bdcourier_settings' LIMIT 1"
    );
    let dbConfig = {};
    if (rows && rows.length > 0 && rows[0].setting_value) {
      dbConfig = typeof rows[0].setting_value === 'string' 
        ? JSON.parse(rows[0].setting_value) 
        : rows[0].setting_value;
    }

    const apiKey = dbConfig.apiKey || process.env.BDCOURIER_API_KEY || '';
    const isEnabled = dbConfig.isEnabled !== undefined ? Boolean(dbConfig.isEnabled) : Boolean(apiKey);
    const autoCheckCOD = dbConfig.autoCheckCOD !== undefined ? Boolean(dbConfig.autoCheckCOD) : true;

    return {
      apiKey,
      isEnabled,
      autoCheckCOD,
      hasKey: Boolean(apiKey),
    };
  } catch (err) {
    console.error('[BDCourierService] Error loading config:', err.message);
    const fallbackKey = process.env.BDCOURIER_API_KEY || '';
    return {
      apiKey: fallbackKey,
      isEnabled: Boolean(fallbackKey),
      autoCheckCOD: true,
      hasKey: Boolean(fallbackKey),
    };
  }
}

/**
 * Save BDCourier settings into site_settings
 */
export async function saveBDCourierConfig({ apiKey, isEnabled, autoCheckCOD }) {
  const current = await getBDCourierConfig();
  const newConfig = {
    apiKey: apiKey !== undefined ? apiKey.trim() : current.apiKey,
    isEnabled: isEnabled !== undefined ? Boolean(isEnabled) : current.isEnabled,
    autoCheckCOD: autoCheckCOD !== undefined ? Boolean(autoCheckCOD) : current.autoCheckCOD,
  };

  await execute(
    `INSERT INTO site_settings (setting_key, setting_value)
     VALUES ('bdcourier_settings', ?)
     ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
    [JSON.stringify(newConfig)]
  );

  return {
    success: true,
    data: {
      hasKey: Boolean(newConfig.apiKey),
      isEnabled: newConfig.isEnabled,
      autoCheckCOD: newConfig.autoCheckCOD,
    },
  };
}

/**
 * Check customer courier delivery history & COD risk analysis
 * Calls POST https://api.bdcourier.com/courier-check
 */
export async function checkCustomerDelivery(rawPhone) {
  const phone = sanitizeBDPhone(rawPhone);
  if (!phone || phone.length < 11) {
    return {
      success: false,
      error: 'Invalid Bangladeshi phone number. Must be 11 digits (e.g., 017XXXXXXXX).',
    };
  }

  const config = await getBDCourierConfig();

  // If live API key is present, execute actual HTTP request to BD Courier
  if (config.apiKey) {
    try {
      const response = await fetch(`${BDCOURIER_API_URL}/courier-check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`,
          'X-API-Key': config.apiKey,
        },
        body: JSON.stringify({ phone }),
      });

      const json = await response.json();
      if (response.ok && json.status === 'success') {
        return {
          success: true,
          isMock: false,
          phone,
          success_ratio: json.success_ratio || 0,
          risk_level: json.risk_level || 'safe',
          risk_verdict: json.risk_verdict || {
            message: 'Delivery history analyzed across national courier networks.',
            color: 'green',
          },
          data: json.data || {},
        };
      } else {
        console.warn('[BDCourier] API returned error or non-200:', json);
        // If API key is invalid or quota exceeded, return fallback simulation with warning
        return generateSimulatedCheck(phone, json.message || 'BDCourier API responded with status error.');
      }
    } catch (apiErr) {
      console.error('[BDCourier] Network error contacting BDCourier API:', apiErr.message);
      return generateSimulatedCheck(phone, 'Connection timeout. Falling back to local verification telemetry.');
    }
  }

  // Fallback simulator for development/staging when API key is not yet entered
  return generateSimulatedCheck(phone, 'No live BDCourier API key configured. Showing simulated courier telemetry.');
}

/**
 * Realistic simulation based on phone hash so tests and local dev work predictably
 */
function generateSimulatedCheck(phone, notice) {
  // Deterministic values based on last 4 digits
  const lastFour = parseInt(phone.slice(-4), 10) || 1234;
  const isHighRisk = lastFour % 9 === 0;
  const isModerateRisk = lastFour % 4 === 0 && !isHighRisk;

  let success_ratio = 92.4;
  let risk_level = 'safe';
  let message = 'Reliable buyer with proven high-completion delivery track record across BD couriers.';
  let color = 'green';

  let steadfastDelivered = 18;
  let steadfastCancelled = 1;
  let pathaoDelivered = 12;
  let pathaoCancelled = 1;
  let redxDelivered = 6;
  let redxCancelled = 0;

  if (isHighRisk) {
    success_ratio = 46.2;
    risk_level = 'danger';
    message = 'High cancellation and return history detected across multiple couriers. Advance verification advised before COD dispatch.';
    color = 'red';
    steadfastDelivered = 4;
    steadfastCancelled = 6;
    pathaoDelivered = 2;
    pathaoCancelled = 5;
    redxDelivered = 1;
    redxCancelled = 2;
  } else if (isModerateRisk) {
    success_ratio = 73.0;
    risk_level = 'medium';
    message = 'Moderate cancellation history detected. Standard phone call confirmation suggested before handover.';
    color = 'amber';
    steadfastDelivered = 11;
    steadfastCancelled = 4;
    pathaoDelivered = 7;
    pathaoCancelled = 3;
    redxDelivered = 3;
    redxCancelled = 1;
  }

  return {
    success: true,
    isMock: true,
    notice,
    phone,
    success_ratio,
    risk_level,
    risk_verdict: {
      message,
      color,
    },
    data: {
      steadfast: {
        name: 'SteadFast',
        logo: 'https://api.bdcourier.com/c-logo/steadfast-logo.png',
        total_parcel: steadfastDelivered + steadfastCancelled,
        success_parcel: steadfastDelivered,
        cancelled_parcel: steadfastCancelled,
        success_ratio: Number(((steadfastDelivered / (steadfastDelivered + steadfastCancelled)) * 100).toFixed(1)),
      },
      pathao: {
        name: 'Pathao',
        logo: 'https://api.bdcourier.com/c-logo/pathao-logo.png',
        total_parcel: pathaoDelivered + pathaoCancelled,
        success_parcel: pathaoDelivered,
        cancelled_parcel: pathaoCancelled,
        success_ratio: Number(((pathaoDelivered / (pathaoDelivered + pathaoCancelled)) * 100).toFixed(1)),
      },
      redx: {
        name: 'RedX',
        logo: 'https://api.bdcourier.com/c-logo/redx-logo.png',
        total_parcel: redxDelivered + redxCancelled,
        success_parcel: redxDelivered,
        cancelled_parcel: redxCancelled,
        success_ratio: Number(((redxDelivered / Math.max(1, redxDelivered + redxCancelled)) * 100).toFixed(1)),
      },
    },
  };
}
