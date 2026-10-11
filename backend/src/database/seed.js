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
      videoUrl: '/uploads/hero-video.mp4',
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
