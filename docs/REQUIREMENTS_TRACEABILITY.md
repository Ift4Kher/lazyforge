# LazyForge Technologies — Requirements Traceability Matrix

**Document Version:** 1.0.0  
**Baseline Specifications:**
- Specification A: Master Project Prompt — LazyForge Technologies
- Specification B: Custom Landing Page Builder & Campaign Management System
- Supplied Brand Video Asset (`uploads/hero-video.mp4`)

---

## Traceability Mapping

| Req ID | Domain & Requirement | Implementation Module(s) | Verification & Acceptance Test | Status |
| :--- | :--- | :--- | :--- | :--- |
| **REQ-01** | **Brand Identity & Color Tokens**<br>Silver, slate, violet/purple lighting, robot mascot. | `frontend/src/styles/theme.js`<br>`frontend/tailwind.config.js` | UI visual inspection & token unit test | Phase 1 Foundation |
| **REQ-02** | **Hero Media with Sound-Enabled Video**<br>Image & video toggle, interactive audio playback. | `frontend/src/components/storefront/Hero.jsx`<br>`backend/src/controllers/settingsController.js` | Component tests: click play, audio unmuted | Phase 1 & 2 |
| **REQ-03** | **Product & Catalog Management**<br>Categories, variants, SKU, pricing, images, 3D model refs. | `backend/src/controllers/productController.js`<br>`backend/src/services/catalogService.js` | Supertest API CRUD tests, inventory checks | Phase 2 |
| **REQ-04** | **Centralized Cart & Concurrency-Safe Checkout**<br>Cart revalidation, server-side price & stock verification. | `backend/src/controllers/cartController.js`<br>`backend/src/services/checkoutService.js` | Concurrency & stock reservation integration tests | Phase 3 |
| **REQ-05** | **Bangladesh Localization**<br>BDT currency formatting, BD phone validation, district shipping rates. | `backend/src/validators/orderValidator.js`<br>`frontend/src/utils/currency.js` | Phone regex unit tests, shipping calculation tests | Phase 3 |
| **REQ-06** | **Payment: Cash on Delivery (COD)**<br>Explicit order creation, admin payment collection tracking. | `backend/src/services/paymentService.js`<br>`backend/src/controllers/orderController.js` | Order creation with `PAYMENT_PENDING`, admin collection audit | Phase 3 |
| **REQ-07** | **Payment: SSLCommerz Integration**<br>Server session init, IPN verification, idempotent state change. | `backend/src/services/sslcommerzService.js`<br>`backend/src/controllers/paymentController.js` | Supertest IPN callback verification, duplicate callback rejection | Phase 3 |
| **REQ-08** | **Three.js Interactive 3D Product Viewer**<br>GLB/glTF rendering, rotation, zoom, memory cleanup, fallback. | `frontend/src/components/3d/ProductViewer3D.jsx`<br>`frontend/src/components/3d/ModelCanvas.jsx` | WebGL canvas render test, fallback rendering if WebGL unavailable | Phase 6 |
| **REQ-09** | **Visual Landing Page Builder**<br>Drag & drop sections, responsive preview, version history. | `frontend/src/pages/admin/builder/LandingPageBuilder.jsx`<br>`backend/src/services/landingPageService.js` | Builder state tests, section reorder, draft vs published test | Phase 5 |
| **REQ-10** | **Custom HTML/CSS Safe Sanitizer**<br>Sanitize custom campaign markup, isolate styles, prevent XSS. | `backend/src/utils/sanitizer.js`<br>`frontend/src/components/campaign/CustomCodeBlock.jsx` | Sanitizer tests stripping `<script>`, `javascript:` URIs | Phase 5 |
| **REQ-11** | **Product-Specific Campaign Engine**<br>Unique slugs (`/campaigns/:slug`), UTM tracking, scheduling. | `backend/src/controllers/campaignController.js`<br>`backend/src/services/attributionService.js` | Attribution persistence test, slug routing test | Phase 6 |
| **REQ-12** | **Coupon & Discount Engine**<br>Fixed/percentage discounts, usage limits, server recalculation. | `backend/src/services/couponService.js`<br>`backend/src/validators/couponValidator.js` | Unit tests: discount logic, expired/exhausted coupons rejection | Phase 7 |
| **REQ-13** | **Affiliate System**<br>Referral codes, commission tracking, fraud prevention, payouts. | `backend/src/controllers/affiliateController.js`<br>`backend/src/services/affiliateService.js` | Commission calculation test on completed orders | Phase 7 |
| **REQ-14** | **Admin Dashboard & RBAC**<br>Role-based access (Owner, Catalog, Order, Marketing), audit logs. | `backend/src/middleware/authMiddleware.js`<br>`backend/src/middleware/rbacMiddleware.js` | 403 Forbidden tests for unauthorized roles, audit log entries | Phase 1 & 4 |
| **REQ-15** | **Technical SEO & Social Metadata**<br>Dynamic meta tags, OpenGraph, JSON-LD schema, sitemap generator. | `backend/src/controllers/seoController.js`<br>`frontend/src/components/seo/MetaTags.jsx` | Sitemap XML validation, JSON-LD Schema testing | Phase 7 & 8 |
| **REQ-16** | **Security Controls**<br>Argon2id/bcrypt passwords, Helmet, CSP, rate-limiting, SQL parameterization. | `backend/src/middleware/securityMiddleware.js`<br>`backend/src/config/database.js` | OWASP security checklist verification, rate-limit test | Phase 1 & 8 |
| **REQ-17** | **Automated Testing Suite**<br>Unit tests (Vitest), integration tests (Supertest), E2E (Playwright). | `backend/tests/`<br>`frontend/src/__tests__/` | Automated CLI execution reporting exact results | All Phases |
