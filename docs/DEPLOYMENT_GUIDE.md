# LazyForge Technologies — Production Deployment & Operations Guide

This guide describes how to deploy and configure the **LazyForge Technologies** full-stack e-commerce platform on production hosting (cPanel shared hosting, VPS, or cloud container environments).

---

## 1. System Requirements & Architecture

| Component | Minimum Version | Production Specification |
| :--- | :--- | :--- |
| **Node.js** | v18.x or v20.x LTS | ESM native runtime |
| **MySQL / MariaDB** | 10.4+ / MySQL 8.0+ | `utf8mb4_unicode_ci` |
| **Web Server** | Apache 2.4+ or Nginx | `mod_rewrite`, `mod_headers`, `mod_deflate` |
| **SSL Certificate** | TLS 1.2+ | Required for SSLCommerz & secure cookies |

---

## 2. cPanel Deployment Options

### Option A: cPanel "Setup Node.js App" (Recommended for cPanel)
Many cPanel hosts provide the CloudLinux **Setup Node.js App** (Passenger) manager:
1. In cPanel, click **Setup Node.js App**.
2. Click **Create Application**:
   - **Node.js version:** Select `20.x` or `18.x`.
   - **Application mode:** `Production`.
   - **Application root:** `lazyforge-backend`.
   - **Application URL:** `api.lazyforge.com` or `lazyforge.com/api`.
   - **Application startup file:** `src/server.js`.
3. Upload the `backend/` folder contents via SFTP or cPanel File Manager into `lazyforge-backend/`.
4. In the Node.js application screen, click **Run NPM Install**.
5. Set environment variables under the **Environment variables** section (see Section 3 below).
6. Upload the built static frontend (`frontend/dist/` contents) to `public_html/`.

### Option B: VPS / Cloud (PM2 + Nginx / Apache Reverse Proxy)
1. **Clone & install:**
   ```bash
   cd /var/www/lazyforge/backend
   npm install --omit=dev
   cd /var/www/lazyforge/frontend
   npm install && npm run build
   ```
2. **Launch with PM2:**
   ```bash
   cd /var/www/lazyforge/backend
   pm2 start src/server.js --name "lazyforge-api"
   pm2 save
   pm2 startup
   ```
3. **Serve Frontend via Apache or Nginx:**
   Point document root to `/var/www/lazyforge/frontend/dist` with the provided `.htaccess` for SPA routing.

---

## 3. Production Environment Configuration (`.env`)

Create a production `.env` file in `backend/`:

```env
# Server
PORT=5000
NODE_ENV=production
APP_URL=https://lazyforge.com
CORS_ORIGIN=https://lazyforge.com

# Database (cPanel MySQL database & user)
DB_HOST=localhost
DB_PORT=3306
DB_USER=cpaneluser_lazyforge
DB_PASSWORD=YourStrongDatabasePassword2026!
DB_NAME=cpaneluser_lazyforge_db

# Security & Sessions
JWT_SECRET=YOUR_64_CHAR_RANDOM_HEX_SECRET_STRING_2026_LAZYFORGE
COOKIE_SECRET=YOUR_64_CHAR_RANDOM_HEX_COOKIE_STRING_2026_LAZYFORGE

# Payment Gateway (SSLCommerz Live)
SSLCOMMERZ_STORE_ID=your_live_store_id
SSLCOMMERZ_STORE_PASSWORD=your_live_store_password
SSLCOMMERZ_IS_SANDBOX=false
SSLCOMMERZ_SUCCESS_URL=https://lazyforge.com/api/v1/payments/sslcommerz/success
SSLCOMMERZ_FAIL_URL=https://lazyforge.com/api/v1/payments/sslcommerz/fail
SSLCOMMERZ_CANCEL_URL=https://lazyforge.com/api/v1/payments/sslcommerz/cancel
SSLCOMMERZ_IPN_URL=https://lazyforge.com/api/v1/payments/sslcommerz/ipn
```

---

## 4. Database Setup & Migrations

1. In cPanel, navigate to **MySQL Databases**:
   - Create database: `cpaneluser_lazyforge_db`
   - Create user: `cpaneluser_lazyforge` with strong password
   - Add user to database with **ALL PRIVILEGES**.
2. Run database migration and initial seed:
   ```bash
   node src/database/migrate.js
   node src/database/seed.js
   ```
3. Default credentials provisioned:
   - **Master Administrator:** `admin@lazyforge.com`
   - **Password:** `LazyForgeAdmin2026!` (Change immediately after first login in Admin -> Settings)

---

## 5. Frontend SPA `.htaccess` Routing

The `frontend/dist/.htaccess` file automatically manages React Router client-side routing and compression:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^ index.html [L]
</IfModule>
```

---

## 6. Verification Checklist

- [ ] `GET /api/v1/health` returns status `UP` with database latency.
- [ ] `GET /sitemap.xml` dynamic XML sitemap generated with all live products and categories.
- [ ] `GET /robots.txt` disallows `/admin` and links to sitemap.
- [ ] Storefront loads at `https://lazyforge.com/`.
- [ ] Three.js 3D Viewer renders interactive mascot at `/campaigns/robot-mascot`.
- [ ] Customer reviews display on `/products/:slug` with verified buyer badges.
- [ ] Affiliate partner program accessible at `/account` (Alliance tab) with referral link copy and real-time commission tracking.
- [ ] Admin panel accessible at `/admin` for orders, reviews moderation, and affiliate management.
