import { query, transaction } from '../config/database.js';
import { logger } from '../utils/logger.js';

/**
 * Public: Validate / track referral code
 * GET /api/v1/affiliates/track/:code
 */
export async function trackReferral(req, res) {
  try {
    const code = req.params.code ? req.params.code.trim().toUpperCase() : '';
    if (!code) {
      return res.status(400).json({ success: false, error: 'Referral code is required' });
    }

    const rows = await query(
      `SELECT a.id, a.referral_code, a.commission_rate, a.is_active, u.name as affiliate_name
       FROM affiliates a
       JOIN users u ON a.user_id = u.id
       WHERE a.referral_code = ?`,
      [code]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Referral code not found' });
    }

    const aff = rows[0];
    if (!aff.is_active) {
      return res.status(400).json({ success: false, error: 'This affiliate partner is currently inactive' });
    }

    return res.json({
      success: true,
      affiliate: {
        id: aff.id,
        referralCode: aff.referral_code,
        commissionRate: Number(aff.commission_rate),
        partnerName: aff.affiliate_name,
      },
    });
  } catch (err) {
    logger.error('Error tracking affiliate code', { error: err.message });
    return res.status(500).json({ success: false, error: 'Failed to verify referral code' });
  }
}

/**
 * Customer: Register as an affiliate partner
 * POST /api/v1/affiliates/register
 */
export async function registerAffiliate(req, res) {
  try {
    const userId = req.user.id;

    // Check if user is already an affiliate
    const existing = await query('SELECT * FROM affiliates WHERE user_id = ?', [userId]);
    if (existing.length > 0) {
      const aff = existing[0];
      return res.json({
        success: true,
        message: 'Already registered as an affiliate',
        affiliate: {
          id: aff.id,
          referralCode: aff.referral_code,
          commissionRate: Number(aff.commission_rate),
          balance: Number(aff.balance),
          totalEarned: Number(aff.total_earned),
          isActive: Boolean(aff.is_active),
          createdAt: aff.created_at,
        },
      });
    }

    // Generate or sanitize referral code
    let code = req.body.customCode
      ? req.body.customCode.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '')
      : null;

    if (code) {
      if (code.length < 3 || code.length > 25) {
        return res.status(400).json({
          success: false,
          error: 'Custom referral code must be between 3 and 25 alphanumeric characters',
        });
      }
      const collision = await query('SELECT id FROM affiliates WHERE referral_code = ?', [code]);
      if (collision.length > 0) {
        return res.status(409).json({
          success: false,
          error: 'This referral code is already taken. Please choose another one.',
        });
      }
    } else {
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      code = `FORGE-${userId}-${randomSuffix}`;
    }

    const commissionRate = 5.00; // Default 5%
    const insertResult = await query(
      `INSERT INTO affiliates (user_id, referral_code, commission_rate, balance, total_earned, is_active)
       VALUES (?, ?, ?, 0.00, 0.00, TRUE)`,
      [userId, code, commissionRate]
    );

    return res.status(201).json({
      success: true,
      message: 'Successfully enrolled in the LazyForge Affiliate Program',
      affiliate: {
        id: insertResult.insertId,
        referralCode: code,
        commissionRate,
        balance: 0.00,
        totalEarned: 0.00,
        isActive: true,
      },
    });
  } catch (err) {
    logger.error('Error registering affiliate', { error: err.message, userId: req.user?.id });
    return res.status(500).json({ success: false, error: 'Failed to register as affiliate' });
  }
}

/**
 * Customer: Get current user's affiliate profile & referral ledger
 * GET /api/v1/affiliates/me
 */
export async function getAffiliateProfile(req, res) {
  try {
    const userId = req.user.id;

    const rows = await query('SELECT * FROM affiliates WHERE user_id = ?', [userId]);
    if (rows.length === 0) {
      return res.json({
        success: true,
        isAffiliate: false,
        affiliate: null,
      });
    }

    const aff = rows[0];

    // Get referrals ledger
    const referrals = await query(
      `SELECT r.id, r.order_id, r.order_total, r.commission_amount, r.status, r.created_at,
              o.order_number, o.payment_status, o.order_status
       FROM affiliate_referrals r
       JOIN orders o ON r.order_id = o.id
       WHERE r.affiliate_id = ?
       ORDER BY r.created_at DESC
       LIMIT 50`,
      [aff.id]
    );

    return res.json({
      success: true,
      isAffiliate: true,
      affiliate: {
        id: aff.id,
        referralCode: aff.referral_code,
        commissionRate: Number(aff.commission_rate),
        balance: Number(aff.balance),
        totalEarned: Number(aff.total_earned),
        isActive: Boolean(aff.is_active),
        createdAt: aff.created_at,
      },
      referrals: referrals.map((r) => ({
        id: r.id,
        orderId: r.order_id,
        orderNumber: r.order_number,
        orderTotal: Number(r.order_total),
        commissionAmount: Number(r.commission_amount),
        status: r.status,
        orderStatus: r.order_status,
        paymentStatus: r.payment_status,
        createdAt: r.created_at,
      })),
    });
  } catch (err) {
    logger.error('Error retrieving affiliate profile', { error: err.message });
    return res.status(500).json({ success: false, error: 'Failed to fetch affiliate profile' });
  }
}

/**
 * Customer: Request payout for available balance
 * POST /api/v1/affiliates/payout
 */
export async function requestPayout(req, res) {
  try {
    const userId = req.user.id;
    const { payoutMethod, payoutDetails } = req.body;

    const rows = await query('SELECT * FROM affiliates WHERE user_id = ?', [userId]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Affiliate account not found' });
    }

    const aff = rows[0];
    const balance = Number(aff.balance);
    const minPayout = 500.00; // 500 BDT minimum

    if (balance < minPayout) {
      return res.status(400).json({
        success: false,
        error: `Minimum payout threshold is ৳${minPayout}. Current balance: ৳${balance.toFixed(2)}`,
      });
    }

    const payoutAmount = balance;

    await transaction(async (conn) => {
      // Deduct balance and log
      await conn.query(
        'UPDATE affiliates SET balance = 0.00 WHERE id = ?',
        [aff.id]
      );

      await conn.query(
        `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details)
         VALUES (?, ?, ?, ?, ?)`,
        [
          userId,
          'AFFILIATE_PAYOUT_REQUEST',
          'affiliates',
          String(aff.id),
          JSON.stringify({
            payoutAmount,
            payoutMethod: payoutMethod || 'bKash/Nagad',
            payoutDetails: payoutDetails || 'Pending verification',
            requestedAt: new Date().toISOString(),
          }),
        ]
      );
    });

    return res.json({
      success: true,
      message: `Payout request for ৳${payoutAmount.toFixed(2)} submitted successfully! Our finance team will disburse via your mobile wallet.`,
      payoutAmount,
      remainingBalance: 0.00,
    });
  } catch (err) {
    logger.error('Error processing payout request', { error: err.message });
    return res.status(500).json({ success: false, error: 'Failed to process payout request' });
  }
}

/**
 * Admin: List all affiliates with telemetry
 * GET /api/v1/admin/affiliates
 */
export async function getAdminAffiliates(req, res) {
  try {
    const rows = await query(
      `SELECT a.id, a.referral_code, a.commission_rate, a.balance, a.total_earned, a.is_active, a.created_at,
              u.id as user_id, u.name as partner_name, u.email as partner_email, u.phone as partner_phone,
              COUNT(r.id) as total_referral_count
       FROM affiliates a
       JOIN users u ON a.user_id = u.id
       LEFT JOIN affiliate_referrals r ON a.id = r.affiliate_id
       GROUP BY a.id
       ORDER BY a.total_earned DESC`
    );

    return res.json({
      success: true,
      affiliates: rows.map((a) => ({
        id: a.id,
        userId: a.user_id,
        partnerName: a.partner_name,
        partnerEmail: a.partner_email,
        partnerPhone: a.partner_phone,
        referralCode: a.referral_code,
        commissionRate: Number(a.commission_rate),
        balance: Number(a.balance),
        totalEarned: Number(a.total_earned),
        totalReferrals: Number(a.total_referral_count),
        isActive: Boolean(a.is_active),
        createdAt: a.created_at,
      })),
    });
  } catch (err) {
    logger.error('Error getting admin affiliates', { error: err.message });
    return res.status(500).json({ success: false, error: 'Failed to load affiliate directory' });
  }
}

/**
 * Admin: Update affiliate status or commission rate
 * PATCH /api/v1/admin/affiliates/:id/status
 */
export async function updateAdminAffiliate(req, res) {
  try {
    const affiliateId = parseInt(req.params.id, 10);
    const { isActive, commissionRate } = req.body;

    const existing = await query('SELECT id FROM affiliates WHERE id = ?', [affiliateId]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, error: 'Affiliate not found' });
    }

    const updates = [];
    const values = [];

    if (typeof isActive === 'boolean') {
      updates.push('is_active = ?');
      values.push(isActive);
    }

    if (commissionRate !== undefined) {
      const rate = parseFloat(commissionRate);
      if (isNaN(rate) || rate < 0 || rate > 50) {
        return res.status(400).json({ success: false, error: 'Commission rate must be between 0% and 50%' });
      }
      updates.push('commission_rate = ?');
      values.push(rate);
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, error: 'No valid fields provided to update' });
    }

    values.push(affiliateId);
    await query(`UPDATE affiliates SET ${updates.join(', ')} WHERE id = ?`, values);

    return res.json({
      success: true,
      message: 'Affiliate partner updated successfully',
    });
  } catch (err) {
    logger.error('Error updating affiliate partner', { error: err.message });
    return res.status(500).json({ success: false, error: 'Failed to update affiliate partner' });
  }
}

/**
 * Admin: Export affiliates directory report to CSV format with Excel UTF-8 BOM
 * GET /api/v1/admin/affiliates/export
 */
export async function exportAdminAffiliates(req, res) {
  try {
    const rows = await query(
      `SELECT a.id, a.referral_code, a.commission_rate, a.balance, a.total_earned, a.is_active, a.created_at,
              u.name as partner_name, u.email as partner_email, u.phone as partner_phone,
              COUNT(r.id) as total_referral_count
       FROM affiliates a
       JOIN users u ON a.user_id = u.id
       LEFT JOIN affiliate_referrals r ON a.id = r.affiliate_id
       GROUP BY a.id
       ORDER BY a.total_earned DESC`
    );

    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const headers = [
      'Partner Name',
      'Partner Email',
      'Partner Phone',
      'Referral Code',
      'Commission Rate (%)',
      'Available Balance (BDT)',
      'Total Earned (BDT)',
      'Total Referrals Count',
      'Status',
      'Enrolled Date',
    ];

    const dataRows = rows.map((a) => [
      escapeCsv(a.partner_name),
      escapeCsv(a.partner_email),
      escapeCsv(a.partner_phone || ''),
      escapeCsv(a.referral_code),
      escapeCsv(Number(a.commission_rate).toFixed(2)),
      escapeCsv(Number(a.balance).toFixed(2)),
      escapeCsv(Number(a.total_earned).toFixed(2)),
      escapeCsv(a.total_referral_count || 0),
      escapeCsv(a.is_active ? 'ACTIVE' : 'SUSPENDED'),
      escapeCsv(new Date(a.created_at).toISOString()),
    ].join(','));

    const csvContent = '\uFEFF' + [headers.map(escapeCsv).join(','), ...dataRows].join('\r\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="lazyforge-affiliates-${new Date().toISOString().slice(0, 10)}.csv"`
    );
    res.status(200).send(csvContent);
  } catch (err) {
    logger.error('Error exporting affiliates CSV', { error: err.message });
    return res.status(500).json({ success: false, error: 'Failed to export affiliates CSV' });
  }
}

