import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';
import { env } from '../config/env.js';

async function seedDatabase(databaseName) {
  console.log(`[SEED] Seeding database: ${databaseName}...`);

  const connection = await mysql.createConnection({
    host: env.DB.host,
    port: env.DB.port,
    user: env.DB.user,
    password: env.DB.password,
    database: databaseName,
  });

  try {
    await connection.beginTransaction();

    // 1. Roles
    const roles = [
      ['admin', 'Full administrative access to all LazyForge systems'],
      ['catalog_manager', 'Manages categories, products, inventory, and 3D assets'],
      ['order_manager', 'Manages order verification, fulfillment, and status updates'],
      ['marketing_manager', 'Manages campaign landing pages, coupons, and discounts'],
      ['customer', 'Storefront purchasing and order tracking account'],
    ];

    for (const [name, desc] of roles) {
      await connection.query(
        'INSERT IGNORE INTO roles (name, description) VALUES (?, ?)',
        [name, desc]
      );
    }

    // 2. Default Administrator
    const adminEmail = 'admin@lazyforge.com';
    const [existingAdmin] = await connection.query(
      'SELECT id FROM users WHERE email = ?',
      [adminEmail]
    );

    if (existingAdmin.length === 0) {
      const passwordHash = await bcrypt.hash('LazyForgeAdmin2026!', 12);
      await connection.query(
        `INSERT INTO users (name, email, password_hash, phone, role, status)
         VALUES (?, ?, ?, ?, ?, ?)`,
        ['LazyForge Master Admin', adminEmail, passwordHash, '+8801700000000', 'admin', 'active']
      );
      console.log(`[SEED] Created default administrator: ${adminEmail} in ${databaseName}`);
    }

    // 3. Shipping Zones (Bangladesh)
    const zones = [
      ['Inside Dhaka', 80.00, '1-2 business days'],
      ['Outside Dhaka (All BD)', 150.00, '2-4 business days'],
      ['Express Dhaka Same-Day', 180.00, 'Same day delivery (Order before 12 PM)'],
    ];

    for (const [name, fee, days] of zones) {
      const [existingZone] = await connection.query(
        'SELECT id FROM shipping_zones WHERE name = ?',
        [name]
      );
      if (existingZone.length === 0) {
        await connection.query(
          'INSERT INTO shipping_zones (name, fee, estimated_days) VALUES (?, ?, ?)',
          [name, fee, days]
        );
      }
    }

    // 4. Default Categories with High-Resolution Images
    const categories = [
      [
        'Robotics & Kits',
        'robotics-kits',
        'High-performance robotics components, microcontrollers, and DIY kits',
        'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
      ],
      [
        'Smart Controllers',
        'smart-controllers',
        'ESP32, Arduino, sensors, and IoT smart home automation modules',
        'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
      ],
      [
        '3D-Printed Models',
        '3d-printed-models',
        'Precision 3D printed mechanical artifacts, dragons, and custom enclosures',
        'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80',
      ],
      [
        'Anime Figures & Collectibles',
        'anime-collectibles',
        'Detailed anime figurines, desk companions, and cyberpunk statues',
        'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
      ],
      [
        'Electronic Accessories',
        'electronic-accessories',
        'Specialized cables, power modules, lithium battery shields, and tools',
        'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80',
      ],
    ];

    for (const [name, slug, desc, imgUrl] of categories) {
      const [existingCat] = await connection.query(
        'SELECT id FROM categories WHERE slug = ?',
        [slug]
      );
      if (existingCat.length === 0) {
        await connection.query(
          'INSERT INTO categories (name, slug, description, image_url) VALUES (?, ?, ?, ?)',
          [name, slug, desc, imgUrl]
        );
      } else {
        await connection.query(
          'UPDATE categories SET image_url = ?, description = ? WHERE slug = ?',
          [imgUrl, desc, slug]
        );
      }
    }

    // 5. Hero & Site Settings (Matching LazyForge reference video & brand aesthetic)
    const heroSettings = {
      mediaType: 'video',
      videoUrl: '/uploads/hero-video2.mp4',
      mobileVideoUrl: '/uploads/hero-video1.mp4',
      posterUrl: '/assets/hero-poster.jpg',
      imageUrl: '/assets/hero-banner.jpg',
      heading: 'ENGINEERING TOMORROW’S TECH TODAY',
      subtitle: 'Premium robotics, 3D-printed innovations, and next-gen electronic gadgets engineered for Bangladesh tech enthusiasts.',
      primaryCtaText: 'Explore Catalog',
      primaryCtaLink: '/products',
      secondaryCtaText: 'View 3D Models',
      secondaryCtaLink: '/campaigns/robot-mascot',
      soundNotice: 'Sound enabled on click — click Play to experience full audio',
      published: true,
    };

    const siteSettings = {
      storeName: 'LazyForge Technologies',
      tagline: 'Futuristic Gadgets & Robotics Lab',
      contactPhone: '+880 1800-LAZYFORGE',
      contactEmail: 'support@lazyforge.com',
      address: 'Plot 42, Innovation Hub, Mirpur DOHS, Dhaka, Bangladesh',
      currency: 'BDT',
      currencySymbol: '৳',
      codEnabled: true,
      sslcommerzEnabled: true,
      freeShippingThreshold: 5000.00,
    };

    await connection.query(
      `INSERT INTO site_settings (setting_key, setting_value)
       VALUES ('hero_configuration', ?)
       ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
      [JSON.stringify(heroSettings)]
    );

    await connection.query(
      `INSERT INTO site_settings (setting_key, setting_value)
       VALUES ('general_settings', ?)
       ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
      [JSON.stringify(siteSettings)]
    );

    // 6. Default Promotional Coupons
    const defaultCoupons = [
      ['LAZYBOT10', 'percentage', 10.00, 1000.00, 2000.00, 500],
      ['FORGE500', 'fixed', 500.00, 3500.00, 500.00, 200],
      ['ROBOTICS2026', 'percentage', 15.00, 2000.00, 3000.00, 100],
    ];

    for (const [code, type, val, minOrd, maxCap, limit] of defaultCoupons) {
      const [existingCoupon] = await connection.query(
        'SELECT id FROM coupons WHERE code = ?',
        [code]
      );
      if (existingCoupon.length === 0) {
        await connection.query(
          `INSERT INTO coupons (code, discount_type, discount_value, min_order_amount, max_discount_amount, usage_limit, is_active)
           VALUES (?, ?, ?, ?, ?, ?, TRUE)`,
          [code, type, val, minOrd, maxCap, limit]
        );
      }
    }

    // 7. Seed Sample Reviews
    const [reviewCount] = await connection.query('SELECT count(*) as count FROM reviews');
    if (reviewCount[0].count === 0) {
      const [prods] = await connection.query('SELECT id FROM products LIMIT 4');
      const sampleReviews = [
        {
          name: 'Tanvir Hossain (BUET Robotics)',
          rating: 5,
          comment: 'Incredible mechanical build quality! The inverse kinematics for the quadruped legs work smoothly out of the box with ESP32 FreeRTOS.',
          verified: 1,
        },
        {
          name: 'Fahim Morshed',
          rating: 5,
          comment: 'Arrived in Dhaka within 24 hours. The packaging was ESD-safe and the 3D-printed brackets fit standard MG90S servos with zero play.',
          verified: 1,
        },
        {
          name: 'Nafis Chowdhury',
          rating: 4,
          comment: 'Very solid kit. The code sample in Python made BLE joystick control super straightforward. Will order the robotic arm next!',
          verified: 1,
        },
        {
          name: 'Shahriar Kabir',
          rating: 5,
          comment: 'LazyForge is by far the highest tier robotics hardware store in Bangladesh. True cyberpunk aesthetics and premium electronics.',
          verified: 1,
        },
      ];

      for (const p of prods) {
        for (const sr of sampleReviews) {
          await connection.query(
            `INSERT INTO reviews (product_id, customer_name, rating, comment, is_verified_purchase, status)
             VALUES (?, ?, ?, ?, ?, 'approved')`,
            [p.id, sr.name, sr.rating, sr.comment, sr.verified]
          );
        }
      }
    }

    // 8. Default Affiliate Partner for Demo
    const [existingAff] = await connection.query("SELECT id FROM affiliates WHERE referral_code = 'CYBERCREATOR'");
    if (existingAff.length === 0) {
      const [adminUser] = await connection.query("SELECT id FROM users WHERE email = 'admin@lazyforge.com'");
      if (adminUser.length > 0) {
        await connection.query(
          `INSERT INTO affiliates (user_id, referral_code, commission_rate, balance, total_earned, is_active)
           VALUES (?, 'CYBERCREATOR', 7.50, 2450.00, 8900.00, TRUE)`,
          [adminUser[0].id]
        );
      }
    }

    // 9. Default Campaign Landing Page (Apex-01 Robot Mascot)
    const [existingLp] = await connection.query("SELECT id FROM landing_pages WHERE slug = 'robot-mascot'");
    if (existingLp.length === 0) {
      const defaultSections = [
        {
          id: 'sec-hero',
          type: 'hero',
          title: 'Hero Video & Welcome',
          enabled: true,
          heading: 'APEX-01 AUTONOMOUS ROBOTICS COMPANION',
          subheading: 'Precision engineered tabletop robotics agent with real-time neural telemetry and 12-axis magnetic servos.',
          ctaText: 'Deploy Apex-01',
          ctaLink: '/products',
        },
        {
          id: 'sec-3d',
          type: '3d_viewer',
          title: 'Interactive 3D Robot Rig',
          enabled: true,
          heading: 'Apex-01 Autonomous Companion',
          subheading: 'Real-time WebGL CAD inspection with servo articulation and reactive LED visor.',
          badge: 'INTERACTIVE THREE.JS RIG',
        },
        {
          id: 'sec-specs',
          type: 'specifications',
          title: 'Hardware & Compute Telemetry',
          enabled: true,
          heading: 'Battle-Tested Microcontroller Architecture',
          subheading: 'Built with dual-core 240MHz ESP32-S3, high-torque micro servos, and real-time WiFi telemetry.',
        },
        {
          id: 'sec-faq',
          type: 'faq',
          title: 'Fulfillment & Warranty FAQ',
          enabled: true,
          heading: 'Frequently Asked Questions',
          subheading: 'Everything you need to know about Bangladesh delivery, Cash on Delivery, and technical support.',
        },
      ];

      const [lpResult] = await connection.query(
        `INSERT INTO landing_pages (title, slug, status, meta_title, meta_description)
         VALUES ('Apex-01 Robot Mascot Showcase', 'robot-mascot', 'published', 'Apex-01 Robot Mascot | LazyForge Technologies', 'Explore the interactive 3D robotics companion engineered for Bangladesh makers.')`
      );
      const lpId = lpResult.insertId;

      const [vResult] = await connection.query(
        `INSERT INTO landing_page_versions (landing_page_id, version_number, layout_json, custom_css, is_published)
         VALUES (?, 1, ?, '/* Apex-01 Cyber Styling */', TRUE)`,
        [lpId, JSON.stringify(defaultSections)]
      );
      const vId = vResult.insertId;

      await connection.query('UPDATE landing_pages SET published_version_id = ? WHERE id = ?', [vId, lpId]);
    }

    await connection.commit();
    console.log(`[SEED SUCCESS] ${databaseName} seeded successfully.`);
  } catch (err) {
    await connection.rollback();
    console.error(`[SEED ERROR] Failed on ${databaseName}:`, err);
    throw err;
  } finally {
    await connection.end();
  }
}

async function main() {
  await seedDatabase(env.DB.database);
  if (env.DB.testDatabase && env.DB.testDatabase !== env.DB.database) {
    await seedDatabase(env.DB.testDatabase);
  }
}

main()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
