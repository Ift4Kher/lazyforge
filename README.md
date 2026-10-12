# LazyForge Technologies 🤖⚡

> **Next-Generation Robotics & Premium Futuristic Gadgets E-Commerce Ecosystem**
> Built with Node.js, Express, MySQL/MariaDB, Vite, React, Tailwind CSS, Three.js, and SSLCommerz Payment Gateway.

---

## 🌟 Key Highlights & Architecture

- **Interactive 3D Product Showcase & CAD Viewer:**
  - Real-time 3D model visualization powered by Canvas / WebGL & Three.js.
  - Interactive lighting presets (*Studio Cyber*, *Solar Flare*, *Deep Neon*, *Minimal Lab*), wireframe toggle, rotation speed control, and zoom.
  - Full Admin CAD model management: upload `.glb`, `.gltf`, `.obj`, or configure Three.js geometry presets with instant real-time modal previews.
- **Visual Landing Page & Campaign Builder:**
  - Drag-and-drop / block-based modular builder for promotional campaigns and robot launches.
  - Live typography, background color palette, and custom CSS injection with immediate storefront preview.
- **Full E-Commerce Core & Checkout:**
  - Futuristic catalog with category filters, instant keyword search, and responsive pagination.
  - Cart state management with promo code application (percentage & fixed discount validation).
  - Cash on Delivery (COD) and SSLCommerz automated payment gateway integration (Sandbox & Production).
  - Order tracking, customer invoices, and automated stock reservation.
- **Customer & Partner Ecosystem:**
  - Customer profile, order history, and live order tracking timeline.
  - Affiliate partner registration, referral link generator, and commission balance tracker.
  - Verified customer product reviews and star rating breakdown.
- **Enterprise Admin Suite:**
  - Executive dashboard with gross revenue metrics, total orders, sales graphs, and low-stock alerts.
  - Complete order lifecycle management (Pending, Processing, Shipped, Delivered, Cancelled).
  - Product catalog manager with image gallery and 3D CAD asset attachments.
  - Coupon code generator with usage limits and expiry dates.
  - SEO metadata editor (OpenGraph tags, meta descriptions, search indexing).
  - Customer review moderation (Approve, Reject, Flag).

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS, Glassmorphic UI design tokens, Lucide Icons
- **3D Graphics:** Three.js, HTML5 Canvas CAD Engine
- **State & Routing:** React Router v6, Context API, Axios

### Backend
- **Runtime:** Node.js (ES Modules)
- **Server:** Express 4
- **Database:** MySQL 8 / MariaDB (XAMPP compatible) via `mysql2/promise` with connection pooling
- **Security:** JWT authentication, bcryptjs, Helmet, XSS / SQL injection sanitization, CORS protection, rate-limiting
- **Testing:** Jest + Supertest (61 automated unit & integration tests)

---

## 🚀 Quick Start Guide

### Prerequisites
1. **Node.js:** v18.x or v20.x
2. **XAMPP / MySQL:** MySQL server running on port `3306`

### 1. Database Setup
1. Start MySQL in XAMPP Control Panel.
2. Create the database:
   ```sql
   CREATE DATABASE lazyforge_db;
   ```
3. Run migrations and database seeds:
   ```bash
   cd backend
   npm run db:migrate
   npm run db:seed
   ```

### 2. Backend Setup
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```
*Backend will run on [http://localhost:5000](http://localhost:5000)*

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Frontend will run on [http://localhost:3000](http://localhost:3000)*

---

## 🔑 Default Credentials (Seed Data)

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@lazyforge.com` | `admin123` |
| **Customer** | `customer@lazyforge.com` | `customer123` |
| **Affiliate** | `affiliate@lazyforge.com` | `affiliate123` |

---

## 🧪 Running Automated Tests

Run backend test suites:
```bash
cd backend
npm test
```
Run frontend unit tests:
```bash
cd frontend
npm test
```

---

## 📂 Project Structure

```
lazyforge/
├── backend/
│   ├── src/
│   │   ├── config/          # Database connection pool & environment variables
│   │   ├── controllers/     # Route business logic (Admin, Auth, Products, Orders, etc.)
│   │   ├── database/        # SQL schemas, migrations, and seed scripts
│   │   ├── middleware/      # JWT auth, RBAC, file upload, error handling
│   │   ├── routes/          # Express API route endpoints
│   │   ├── services/        # SSLCommerz & payment processing services
│   │   └── utils/           # Input sanitization and formatters
│   └── tests/               # Backend Jest & Supertest suites
├── frontend/
│   ├── public/              # Static public assets & icons
│   └── src/
│       ├── components/      # UI components (Storefront, 3D Showcase, Customer)
│       ├── layouts/         # Storefront & Admin sidebar layouts
│       ├── pages/           # Storefront, Admin, Auth, Customer views
│       ├── routes/          # Protected and public routes
│       └── styles/          # Tailwind CSS & custom animations
├── docs/                    # Architecture, deployment guide, and traceability matrix
└── uploads/                 # Media assets & demo video
```

---

## 📄 License
ISC © LazyForge Technologies
