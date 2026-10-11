import mysql from 'mysql2/promise';
import { env } from '../config/env.js';

export async function seedProducts(databaseName) {
  console.log(`[SEED] Seeding products in database: ${databaseName}...`);

  const connection = await mysql.createConnection({
    host: env.DB.host,
    port: env.DB.port,
    user: env.DB.user,
    password: env.DB.password,
    database: databaseName,
  });

  try {
    await connection.beginTransaction();

    // Fetch existing categories by slug
    const [categories] = await connection.query('SELECT id, slug FROM categories');
    const categoryMap = {};
    for (const cat of categories) {
      categoryMap[cat.slug] = cat.id;
    }

    const products = [
      {
        name: 'ESP32 Autonomous Quadruped Spider Robot Kit',
        slug: 'esp32-autonomous-quadruped-spider-robot-kit',
        sku: 'LF-ROB-001',
        category_slug: 'robotics-kits',
        regular_price: 4800.00,
        sale_price: 4250.00,
        is_featured: true,
        short_description: '12-DOF programmable spider robot powered by ESP32 with Wi-Fi/Bluetooth control and obstacle avoidance.',
        description: 'The LazyForge Quadruped Spider Robot is an advanced robotics platform engineered for enthusiasts, makers, and university researchers. Featuring 12 high-precision metal gear micro servos, an onboard ESP32 dual-core brain, ultrasonic distance mapping, and full Python/C++ open-source firmware compatibility.',
        specifications: {
          'Microcontroller': 'ESP32-WROOM-32D (240MHz Dual Core)',
          'Degrees of Freedom': '12 DOF (3 per leg)',
          'Servos': '12x SG90 Metal-Gear High Speed Servos',
          'Power System': '7.4V 2S 18650 Li-ion Battery Shield (Included)',
          'Connectivity': '2.4 GHz Wi-Fi, BLE 4.2, Web App Controller',
          'Chassis Material': 'Laser-cut Matte Black Acrylic & 3D Printed Joints',
          'Weight': '420g with batteries',
        },
        images: [
          { url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80', is_primary: true, alt: 'Quadruped Spider Robot Top Angle' },
          { url: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=800&q=80', is_primary: false, alt: 'Spider Robot Servos Detail' },
        ],
        variants: [
          { name: 'DIY Assembly Kit', sku: 'LF-ROB-001-DIY', attribute_name: 'Assembly', attribute_value: 'DIY Kit', price_adjustment: 0.00, stock: 25 },
          { name: 'Pre-Assembled & Calibrated', sku: 'LF-ROB-001-ASM', attribute_name: 'Assembly', attribute_value: 'Ready to Run', price_adjustment: 550.00, stock: 12 },
        ],
      },
      {
        name: '4-DOF Metal Industrial Robotic Arm with Claw',
        slug: '4-dof-metal-industrial-robotic-arm-with-claw',
        sku: 'LF-ROB-002',
        category_slug: 'robotics-kits',
        regular_price: 3600.00,
        sale_price: 3200.00,
        is_featured: true,
        short_description: 'Precision all-aluminum mechanical robotic manipulator arm with high-torque MG996R servos.',
        description: 'Engineered for industrial automation prototypes and educational training. Solid anodized CNC aluminum alloy bracket architecture driven by high-torque metal-gear servos capable of lifting objects up to 250 grams with sub-millimeter repeatable precision.',
        specifications: {
          'Payload Capacity': '250 grams',
          'Reach': '320mm maximum radius',
          'Servos': '4x MG996R Metal Gear 13kg/cm Servos',
          'Base': '360° Rotating Bearing Turntable',
          'Operating Voltage': '4.8V - 6.8V DC',
          'Weight': '680g',
        },
        images: [
          { url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80', is_primary: true, alt: '4-DOF Metal Robotic Arm' },
        ],
        variants: [
          { name: 'Silver Anodized Edition', sku: 'LF-ROB-002-SLV', attribute_name: 'Finish', attribute_value: 'Silver', price_adjustment: 0.00, stock: 18 },
          { name: 'Stealth Black Edition', sku: 'LF-ROB-002-BLK', attribute_name: 'Finish', attribute_value: 'Black', price_adjustment: 150.00, stock: 15 },
        ],
      },
      {
        name: 'ESP32-WROOM-32D Dual-Core Dev Board (Type-C)',
        slug: 'esp32-wroom-32d-dual-core-dev-board-type-c',
        sku: 'LF-CTRL-001',
        category_slug: 'smart-controllers',
        regular_price: 650.00,
        sale_price: 520.00,
        is_featured: true,
        short_description: 'Upgraded USB Type-C 38-Pin ESP32 board with CH340 chip, Wi-Fi, and Bluetooth 4.2 BLE.',
        description: 'The gold standard for IoT development. High performance Tensilica Xtensa 32-bit LX6 dual-core processor running at up to 240MHz. Features native CP2102/CH340 USB-C interface for lightning-fast firmware flashes in Arduino IDE, ESP-IDF, and MicroPython.',
        specifications: {
          'Processor': 'Tensilica Xtensa Dual-Core LX6 @ 240MHz',
          'SRAM': '520 KB',
          'Flash Memory': '4 MB SPI Flash',
          'Interface': 'USB Type-C (Reversible)',
          'Wireless': '802.11 b/g/n (up to 150 Mbps), BLE 4.2',
          'Pin Count': '38 Pins, breadboard-friendly pitch',
        },
        images: [
          { url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80', is_primary: true, alt: 'ESP32 Development Board' },
        ],
        variants: [
          { name: 'Standard Pin Header (Soldered)', sku: 'LF-CTRL-001-SOL', attribute_name: 'Headers', attribute_value: 'Soldered', price_adjustment: 0.00, stock: 80 },
          { name: 'Unsoldered Header Edition', sku: 'LF-CTRL-001-UNS', attribute_name: 'Headers', attribute_value: 'Unsoldered', price_adjustment: -30.00, stock: 45 },
        ],
      },
      {
        name: 'Arduino Mega 2560 R3 Pro Lab Edition',
        slug: 'arduino-mega-2560-r3-pro-lab-edition',
        sku: 'LF-CTRL-002',
        category_slug: 'smart-controllers',
        regular_price: 1850.00,
        sale_price: 1550.00,
        is_featured: false,
        short_description: 'ATmega2560 microcontroller board with 54 digital I/O pins, 16 analog inputs, and 4 hardware UARTs.',
        description: 'Ideal for 3D printers, CNC routers, robotics, and complex multi-sensor automation projects. Comes with high-grade crystal oscillator and high-speed USB interface cable.',
        specifications: {
          'Microcontroller': 'ATmega2560 @ 16MHz',
          'Digital I/O Pins': '54 (of which 15 provide PWM output)',
          'Analog Input Pins': '16',
          'Flash Memory': '256 KB (8 KB used by bootloader)',
          'Operating Voltage': '5V DC',
        },
        images: [
          { url: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80', is_primary: true, alt: 'Arduino Mega 2560' },
        ],
        variants: [
          { name: 'Standard Board with USB Cable', sku: 'LF-CTRL-002-STD', attribute_name: 'Package', attribute_value: 'Board + Cable', price_adjustment: 0.00, stock: 35 },
        ],
      },
      {
        name: 'Articulated Silk Crystal Mech Dragon (50cm)',
        slug: 'articulated-silk-crystal-mech-dragon-50cm',
        slug: 'articulated-silk-crystal-mech-dragon-50cm',
        sku: 'LF-3DP-001',
        category_slug: '3d-printed-models',
        regular_price: 1950.00,
        sale_price: 1650.00,
        is_featured: true,
        short_description: 'Full multi-joint articulated mechanical dragon 3D printed with dual-tone iridescent silk PLA.',
        description: 'Manufactured inside the LazyForge 3D print farm using industrial 0.12mm layer heights. Every individual vertebra and wing segment features print-in-place ball hinges for lifelike fluid articulation. Shimmers between violet and metallic emerald depending on ambient light.',
        specifications: {
          'Length': '50 cm (20 inches)',
          'Material': 'Premium Biocompatible Silk PLA',
          'Layer Resolution': '0.12mm Ultra-Fine High Detail',
          'Infill': '25% Gyroid Structural Density',
          'Joint Type': 'Print-in-Place Multi-Axis Interlocking Hinges',
        },
        images: [
          { url: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80', is_primary: true, alt: 'Articulated Silk Dragon' },
        ],
        variants: [
          { name: 'Violet & Emerald Dichromatic', sku: 'LF-3DP-001-VEM', attribute_name: 'Color', attribute_value: 'Violet/Emerald', price_adjustment: 0.00, stock: 20 },
          { name: 'Obsidian Black & Crimson', sku: 'LF-3DP-001-OBC', attribute_name: 'Color', attribute_value: 'Obsidian/Crimson', price_adjustment: 0.00, stock: 15 },
        ],
      },
      {
        name: 'Cyberpunk Hexagonal LED Headphone Stand',
        slug: 'cyberpunk-hexagonal-led-headphone-stand',
        sku: 'LF-3DP-002',
        category_slug: '3d-printed-models',
        regular_price: 1450.00,
        sale_price: 1250.00,
        is_featured: false,
        short_description: 'Architectural desk headphone pedestal with integrated cable routing and matte graphite finish.',
        description: 'Geometric minimalism meets cyberpunk desk aesthetic. Engineered with weighted lower ballast to securely support heavyweight studio and gaming headsets without tipping.',
        specifications: {
          'Height': '27 cm',
          'Base Diameter': '14 cm',
          'Material': 'High-Impact Carbon Fiber-Infused PETG',
          'Weight': '390g with anti-slip rubber feet',
        },
        images: [
          { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80', is_primary: true, alt: 'Headphone Stand' },
        ],
        variants: [
          { name: 'Matte Graphite', sku: 'LF-3DP-002-GRP', attribute_name: 'Finish', attribute_value: 'Graphite', price_adjustment: 0.00, stock: 30 },
          { name: 'Frosted Violet Accent', sku: 'LF-3DP-002-VIO', attribute_name: 'Finish', attribute_value: 'Violet', price_adjustment: 100.00, stock: 25 },
        ],
      },
      {
        name: 'Neon Cyberpunk Samurai 1/7 Scale LED Statue',
        slug: 'neon-cyberpunk-samurai-1-7-scale-led-statue',
        sku: 'LF-ANI-001',
        category_slug: 'anime-collectibles',
        regular_price: 5200.00,
        sale_price: 4600.00,
        is_featured: true,
        short_description: 'Hand-detailed collector statue with dual optical light-up katanas and diorama base.',
        description: 'A showstopper centerpiece for any enthusiast setup. Intricately sculpted mechanized ronin armor with concealed micro-USB powered LED conduits illuminating the katana edges and visor optics.',
        specifications: {
          'Scale': '1/7 Scale (28 cm tall)',
          'Illumination': 'Dual 5V USB-C Powered Neon Edge LEDs',
          'Material': 'High-Grade Polyresin & Metallic Paint Coating',
          'Packaging': 'Collector Foil Box with Holographic Serial Certificate',
        },
        images: [
          { url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80', is_primary: true, alt: 'Cyberpunk Samurai Figure' },
        ],
        variants: [
          { name: 'Neon Violet Edition', sku: 'LF-ANI-001-NV', attribute_name: 'LED Color', attribute_value: 'Neon Violet', price_adjustment: 0.00, stock: 10 },
          { name: 'Cyan Plasma Edition', sku: 'LF-ANI-001-CP', attribute_name: 'LED Color', attribute_value: 'Cyan Plasma', price_adjustment: 0.00, stock: 8 },
        ],
      },
      {
        name: '18650 Dual-Slot Battery Shield with Type-C BMS',
        slug: '18650-dual-slot-battery-shield-with-type-c-bms',
        sku: 'LF-ACC-001',
        category_slug: 'electronic-accessories',
        regular_price: 450.00,
        sale_price: 380.00,
        is_featured: false,
        short_description: 'Portable uninterruptible power module supporting 5V 3A and 3.3V 1A dual outputs with overcharge protection.',
        description: 'The essential portable power delivery system for robotics and IoT projects. Holds two standard 18650 lithium cells, equipped with Type-C input for fast recharging and battery level indicator LEDs.',
        specifications: {
          'Battery Support': '2x 18650 3.7V Li-ion cells',
          'Output Ports': 'USB Type-A (5V 3A), Pin Headers (5V & 3.3V)',
          'Charging Port': 'USB Type-C with Over-Current Protection',
          'Efficiency': 'Up to 92% synchronous rectification',
        },
        images: [
          { url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80', is_primary: true, alt: 'Battery Shield' },
        ],
        variants: [
          { name: 'Dual Slot 18650 Shield', sku: 'LF-ACC-001-STD', attribute_name: 'Type', attribute_value: 'Dual Slot', price_adjustment: 0.00, stock: 50 },
        ],
      },
    ];

    for (const prod of products) {
      const categoryId = categoryMap[prod.category_slug] || null;

      const [existing] = await connection.query('SELECT id FROM products WHERE slug = ?', [prod.slug]);
      let productId;

      if (existing.length > 0) {
        productId = existing[0].id;
        await connection.query(
          `UPDATE products SET 
            name = ?, sku = ?, short_description = ?, description = ?, 
            specifications = ?, category_id = ?, regular_price = ?, sale_price = ?, is_featured = ?
           WHERE id = ?`,
          [
            prod.name, prod.sku, prod.short_description, prod.description,
            JSON.stringify(prod.specifications), categoryId, prod.regular_price, prod.sale_price, prod.is_featured,
            productId
          ]
        );
      } else {
        const [result] = await connection.query(
          `INSERT INTO products 
            (name, slug, sku, short_description, description, specifications, category_id, regular_price, sale_price, is_featured, is_active)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE)`,
          [
            prod.name, prod.slug, prod.sku, prod.short_description, prod.description,
            JSON.stringify(prod.specifications), categoryId, prod.regular_price, prod.sale_price, prod.is_featured
          ]
        );
        productId = result.insertId;
      }

      // Images
      await connection.query('DELETE FROM product_images WHERE product_id = ?', [productId]);
      for (let i = 0; i < prod.images.length; i++) {
        const img = prod.images[i];
        await connection.query(
          'INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES (?, ?, ?, ?, ?)',
          [productId, img.url, img.alt, i, img.is_primary]
        );
      }

      // Variants
      for (const variant of prod.variants) {
        const [existingVar] = await connection.query('SELECT id FROM product_variants WHERE sku = ?', [variant.sku]);
        if (existingVar.length > 0) {
          await connection.query(
            `UPDATE product_variants SET 
              variant_name = ?, attribute_name = ?, attribute_value = ?, 
              price_adjustment = ?, stock_quantity = ?
             WHERE id = ?`,
            [variant.name, variant.attribute_name, variant.attribute_value, variant.price_adjustment, variant.stock, existingVar[0].id]
          );
        } else {
          await connection.query(
            `INSERT INTO product_variants 
              (product_id, sku, variant_name, attribute_name, attribute_value, price_adjustment, stock_quantity, is_active)
             VALUES (?, ?, ?, ?, ?, ?, ?, TRUE)`,
            [productId, variant.sku, variant.name, variant.attribute_name, variant.attribute_value, variant.price_adjustment, variant.stock]
          );
        }
      }
    }

    await connection.commit();
    console.log(`[SEED] Successfully seeded ${products.length} products in ${databaseName}`);
  } catch (err) {
    await connection.rollback();
    console.error(`[SEED ERROR] Failed to seed products in ${databaseName}:`, err);
    throw err;
  } finally {
    await connection.end();
  }
}

// Allow CLI execution directly
if (process.argv[1]?.endsWith('seedProducts.js')) {
  (async () => {
    try {
      await seedProducts(env.DB.database);
      await seedProducts(env.DB.testDatabase);
      console.log('Product seeding completed.');
      process.exit(0);
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  })();
}
