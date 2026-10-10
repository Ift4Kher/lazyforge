# LazyForge Technologies — System Architecture Document

**Document Version:** 1.0.0  
**Target Architecture:** Node.js/Express ESM + React/Vite/Tailwind Monorepo + MariaDB/MySQL  
**Author:** Senior Full-Stack Software Architect  

---

## 1. Architecture Overview

LazyForge Technologies is architected as a high-performance, unified e-commerce platform where storefront browsing, marketing campaigns, centralized checkout, inventory control, and administrative management share a single reliable core backend.

```
+-----------------------------------------------------------------------------------+
|                                 CLIENT LAYER                                      |
|  +--------------------------------+       +------------------------------------+  |
|  |     Storefront & Catalog       |       |   Visual Campaign Page Builder     |  |
|  | (React / Vite / Tailwind / 3D) |       |  (Drag & Drop / Live Previews)     |  |
|  +--------------------------------+       +------------------------------------+  |
|  +--------------------------------+       +------------------------------------+  |
|  |   Shared Responsive Checkout   |       |      Operations Admin Portal       |  |
|  |    (BDT Localized / COD / SSL) |       | (Metrics, Orders, Catalog, RBAC)   |  |
|  +--------------------------------+       +------------------------------------+  |
+-----------------------------------------------------------------------------------+
                                         |
                                (REST API / HTTPS)
                                         v
+-----------------------------------------------------------------------------------+
|                                 BACKEND LAYER                                     |
|  Express.js Application (Node.js ESM)                                              |
|  - Security: Helmet, CORS, Rate-Limiting, HTTP-Only Cookie Auth                   |
|  - Modules: Auth/RBAC, Products, Orders, Payments, Campaigns, Affiliates, SEO     |
|  - Commerce Engine: Concurrency-Safe Inventory, Price Calculation, Coupons        |
+-----------------------------------------------------------------------------------+
                                         |
                            (Connection Pool / SQL)
                                         v
+-----------------------------------------------------------------------------------+
|                                DATABASE LAYER                                     |
|  MariaDB 10.4.32 / MySQL (mysql2/promise)                                          |
|  - Character Set: utf8mb4_unicode_ci                                              |
|  - Currency Storage: DECIMAL(12,2) with transaction isolation                     |
|  - Tables: Users, Roles, Products, Variants, Inventory, Orders, Transactions,     |
|            Landing Pages, Sections, Campaigns, Affiliates, Coupons, Audit Logs    |
+-----------------------------------------------------------------------------------+
```

---

## 2. Directory Layout

```
lazy-forge/
├── backend/
│   ├── src/
│   │   ├── config/          # DB connection pool, env validator
│   │   ├── controllers/     # HTTP route controllers
│   │   ├── database/        # Migrations, seeders, schema runner
│   │   ├── middleware/      # Auth, RBAC, error handler, rate limiters, security
│   │   ├── routes/          # Versioned REST endpoints (/api/v1/...)
│   │   ├── services/        # Centralized business logic (checkout, payments, catalog)
│   │   ├── utils/           # Sanitizers, logger, currency helpers
│   │   ├── validators/      # Request validation schemas
│   │   ├── app.js           # Express app definition
│   │   └── server.js        # Server bootstrapper & graceful shutdown
│   ├── tests/               # Supertest & Vitest backend integration tests
│   └── package.json
├── frontend/
│   ├── public/              # Favicon, robots.txt, static assets
│   ├── src/
│   │   ├── assets/          # Brand logos, icons, 3D models, video posters
│   │   ├── components/      # Reusable UI (Navbar, Footer, Modal, Button, 3D Canvas)
│   │   ├── context/         # AuthContext, CartContext, NotificationContext
│   │   ├── pages/           # Storefront pages, Campaign pages, Admin pages
│   │   ├── services/        # Axios/Fetch API client
│   │   ├── styles/          # Tailwind base, design tokens, animations
│   │   ├── utils/           # Formatters, currency, local storage helpers
│   │   ├── App.jsx          # Router & layout provider
│   │   └── main.jsx         # React DOM root
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── docs/                    # Architectural & operational documentation
├── uploads/                 # Media library & public product assets
└── package.json             # Root workspace runner
```

---

## 3. Database Strategy: `mysql2/promise` with Connection Pooling

### 3.1 Selection Justification
- **Platform Compatibility:** Node.js v24 on Windows with XAMPP MariaDB 10.4.32. `mysql2/promise` eliminates binary compilation issues, is battle-tested, and uses native JavaScript.
- **Transaction Safety:** Full support for `BEGIN`, `COMMIT`, `ROLLBACK`, and pessimistic locking (`SELECT ... FOR UPDATE`) to prevent overselling.
- **Data Types:** Strict mapping of monetary values using `DECIMAL(12, 2)` to eliminate floating-point arithmetic errors.

---

## 4. Security & Authentication Architecture

1. **Password Hashing:** `bcrypt` with work factor 12.
2. **Session / Token Security:** Tokens delivered in secure `HttpOnly`, `SameSite=Lax` cookies to prevent client-side script inspection.
3. **Role-Based Access Control (RBAC):** Every privileged endpoint is guarded by `verifyAuth` and `requireRole([...])`.
4. **Input Sanitization:** HTML sanitizer with allowlist for campaign custom markup; parameterized SQL queries across all repositories.
5. **Rate Limiting:** IP-based rate limiting on sensitive routes (`/api/v1/auth/login`, `/api/v1/checkout`).

---

## 5. Commerce Engine & Concurrency Control

- **Centralized Computation:** The browser never supplies prices, discounts, or delivery fees. All amounts are computed server-side from active catalog and zone tables.
- **Pessimistic Inventory Locking:** At checkout time, variant inventory rows are locked (`SELECT stock_quantity FROM product_variants WHERE id = ? FOR UPDATE`). If requested quantity exceeds available stock, the transaction rolls back cleanly.
- **Payment Verification:** Webhooks from SSLCommerz undergo server-side validation against SSLCommerz validation API before order status transitions to `PAID`.
