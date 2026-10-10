# LazyForge Technologies — Master Implementation Plan

**Document Version:** 1.0.0  
**Target Architecture:** Full-Stack Monorepo (Node.js/Express ESM Backend + React/Vite/Tailwind Frontend + MariaDB/MySQL)  
**Execution Strategy:** Phased incremental development with working verification at every phase.

---

## Phase 1 — Workspace Audit & Foundation (CURRENT PHASE)
- **Goal:** Set up robust full-stack foundation, configuration, logging, database connection pooling, schema migration engine, base authentication, RBAC, and responsive design system.
- **Deliverables:**
  1. Root workspace structure (`backend/`, `frontend/`, `docs/`, `uploads/`).
  2. Backend: Express application with ESM, security headers (Helmet, CORS, rate-limiting), environment validator (`dotenv`), structured logger.
  3. Database: `mysql2/promise` connection pool, SQL schema runner, migration manager, initial database schema with `users`, `roles`, `audit_logs`, and seed script.
  4. Auth & RBAC: Password hashing (`bcrypt`), HTTP-only cookie JWT/session, role-based permission middleware.
  5. Frontend: React 18+ with Vite, Tailwind CSS configured with the LazyForge brand palette (silver/slate + vibrant violet/purple accents), layout shells for Storefront and Admin.
  6. Automated Tests: Backend health check test, auth test, and database connectivity test via Vitest/Supertest.

## Phase 2 — Catalog & Storefront Core
- **Goal:** Comprehensive database-backed product catalog and public discovery.
- **Deliverables:**
  1. Database tables for `categories`, `products`, `product_variants`, `product_images`, and `inventory`.
  2. Public REST APIs for listing, filtering, sorting, searching, and viewing single product details.
  3. Storefront UI: Responsive Navbar with search, Category navigation, Product Cards, Product Listing Page with filters, and comprehensive Product Detail Page.
  4. Homepage Sections: Interactive Hero with sound-enabled video playback & image fallback, Featured Categories, Best Sellers, and New Arrivals.
  5. Verification: Supertest catalog API tests, Vitest frontend component tests.

## Phase 3 — Centralized Commerce Engine & Payments
- **Goal:** Secure, centralized cart, concurrency-safe checkout, Bangladesh localization, and payment workflows.
- **Deliverables:**
  1. Database tables for `orders`, `order_items`, `payment_transactions`, and `shipping_zones`.
  2. Centralized cart logic with server-side price and inventory revalidation.
  3. Concurrency-safe checkout flow using SQL transactions (`FOR UPDATE` locking on stock).
  4. Bangladesh localization: BDT currency formatting, BD mobile number validation (`01XXXXXXXXX`), Dhaka vs outside Dhaka shipping fee computation.
  5. Cash on Delivery (COD) workflow with order creation in `PENDING` status.
  6. SSLCommerz payment integration: Session initiation, IPN callback verification, transaction reconciliation, and idempotent state handling.
  7. Verification: Stock overselling prevention tests, payment validation tests.

## Phase 4 — Administration Dashboard
- **Goal:** Real database-driven management interface for the business operations team.
- **Deliverables:**
  1. Admin metrics overview: Real aggregated orders, revenue, inventory alerts, and order status counts (no hardcoded/faked data).
  2. Product & Variant CRUD with image upload and inventory adjustments.
  3. Order lifecycle management: Pending -> Confirmed -> Processing -> Shipped -> Delivered / Cancelled.
  4. Customer management and administrative audit logging.
  5. System settings management (Hero media, shipping fees, store contact).
  6. Verification: Role-based access control tests on all administrative endpoints.

## Phase 5 — Visual Landing Page Builder
- **Goal:** Visual section-based drag-and-drop landing page builder for standalone campaign pages.
- **Deliverables:**
  1. Schema and database tables for `landing_pages`, `landing_page_versions`, and `landing_page_templates`.
  2. Pre-built section library: Hero, Product Showcase, Features, Specs, Comparison, Reviews, FAQ, and Sticky CTA.
  3. Visual section editor with reordering, real-time preview (desktop/tablet/mobile), draft saving, and publishing workflow.
  4. Safe custom HTML/CSS editor with sanitizer (preventing script injection and style leakage).
  5. Version history and instant rollback.
  6. Verification: Sanitizer XSS prevention tests, draft vs published isolation tests.

## Phase 6 — Product-Specific Campaigns & Three.js 3D Viewer
- **Goal:** Independent campaign URLs with marketing attribution and interactive 3D product previews.
- **Deliverables:**
  1. Campaign routing: Dedicated URLs (e.g. `/campaigns/smart-robot-car`).
  2. Campaign attribution tracking: UTM parameters, referral IDs, conversion tracking tied to validated order outcomes.
  3. Three.js interactive 3D product viewer: GLB/glTF rendering, rotation, zoom, camera reset, loading spinner, and responsive image fallback.
  4. Safe 3D asset handling separating public preview models from private manufacturing CAD files.
  5. Verification: Three.js canvas initialization and fallback tests.

## Phase 7 — Marketing, Coupons, Affiliates & Technical SEO
- **Goal:** Growth tools, affiliate commission management, customer reviews, and search engine optimization.
- **Deliverables:**
  1. Server-recalculated coupon engine (percentage/fixed discounts, minimum spends, usage limits).
  2. Affiliate management: Unique referral links, server-side commission calculation, payout ledger.
  3. Customer reviews with admin moderation and verified purchase badges.
  4. Technical SEO: Dynamic metadata (`react-helmet-async`), Open Graph cards, JSON-LD Schema (Product, Organization), XML sitemap generator (`/sitemap.xml`), and `robots.txt`.
  5. Verification: SEO tag validation, coupon calculation tests, affiliate commission tests.

## Phase 8 — Hardening, QA & Production Readiness
- **Goal:** Security audits, performance benchmarking, end-to-end testing, and deployment operations.
- **Deliverables:**
  1. Comprehensive automated test runs (Unit, API, and Playwright E2E checkout).
  2. Security audit: Rate-limiting, SQL injection defenses, CSRF/XSS sanitization, HTTP-only cookies.
  3. Core Web Vitals optimization: Image compression, lazy loading below the fold, script bundle optimization.
  4. Production deployment guide, backup/restore runbooks, and environment variable documentation.
  5. Final Requirements Traceability Matrix verification.
