# LazyForge Technologies — Workspace & Environment Audit

**Document Version:** 1.0.0  
**Date:** 2026-10-11  
**Auditor:** Senior Full-Stack Software Architect  
**Workspace Path:** `C:\xampp\htdocs\lazy-forge`  

---

## 1. Executive Summary

This document establishes the verified baseline of the development workspace prior to application construction. All findings distinguish verified facts from assumptions, recommendations, and operational blockers.

---

## 2. Verified Facts

### 2.1 Workspace & Git Status
- **Root Directory:** `C:\xampp\htdocs\lazy-forge`
- **Initial State:** Empty directory upon initiation.
- **Git Version Control:** Initialized via `git init` on `master` branch.
- **Root Directories Established:** `backend/`, `frontend/`, `docs/`, `uploads/`.

### 2.2 System & Runtime Environment
- **Operating System:** Windows 10/11 x64 (`DESKTOP-VRUG4CG`).
- **Node.js Version:** `v24.18.0` (Verified via `node -v`).
- **NPM Version:** `11.16.0` (Verified via `npm -v`).
- **Python Version:** `Python 3.14.0` (System available).
- **Relational Database Server:** XAMPP MariaDB `Ver 15.1 Distrib 10.4.32-MariaDB` running as a service on port `3306` (Verified via CLI & `SHOW DATABASES;`).
- **Database Provisioning:** Successfully created isolated UTF8MB4 databases:
  - `lazyforge_db` (development & production store)
  - `lazyforge_test_db` (automated test suite)

### 2.3 Visual Design Assets & Brand Reference
- **Reference Video Discovered:** `WhatsApp Video 2026-10-11 at 5.44.47 PM.mp4` (Downloaded 2026-10-11 03:38 AM).
- **Video Specifications:**
  - Length: 8.00 seconds.
  - Video Stream: H.264 / 848x478 resolution, 24.00 fps, ~1835 kbps data rate.
  - Audio Stream: Present, 140 kbps bitrate.
  - File Size: 1.88 MB (1,979,401 bytes).
  - Preserved in: `uploads/hero-video.mp4`.
- **Identified Brand Aesthetic:**
  - Futuristic, polished robotic mascot.
  - Sleek silver, chrome, soft white, and deep slate surfaces.
  - Luminous violet/purple accent illumination (`#8B5CF6`, `#A78BFA`, `#6D28D9`, `#4C1D95`).
  - High-tech, trustworthy gadget e-commerce visual tone.

---

## 3. Technology Stack Decisions & Justifications

| Layer | Selection | Justification |
| :--- | :--- | :--- |
| **Language** | Pure JavaScript ES6+ (ES Modules) | Strict compliance with prompt rule forbidding TypeScript (`.ts`/`.tsx`). |
| **Frontend** | React 18 / 19 + Vite + Tailwind CSS | Ultra-fast HMR, lightweight bundle size, modern component architecture. |
| **3D Rendering** | Three.js (`three` + `@react-three/fiber` / Vanilla Three) | Interactive 3D preview of models (GLB, STL, OBJ) with canvas lifecycle cleanup. |
| **Backend** | Node.js + Express.js (ESM) | Non-blocking I/O, mature REST middleware ecosystem, robust security headers. |
| **Database Access** | `mysql2/promise` with Connection Pooling | Zero engine binary compilation issues on Node 24 on Windows; exact numeric precision for BDT currency (`DECIMAL(12,2)`); clean SQL transaction isolation. |
| **Authentication** | Server-Managed HTTP-Only Cookies (Session/JWT) | Immune to client-side XSS token theft; verified role permissions per request. |
| **Payment Gateways** | Cash on Delivery (COD) + SSLCommerz Sandbox/Live | Fully localized for Bangladesh; server-side IPN verification and idempotent state handling. |
| **Testing** | Vitest, Supertest, React Testing Library, Playwright | Multi-tier testing covering unit logic, REST endpoints, UI interactions, and E2E checkout. |

---

## 4. Assumptions & Inferences
1. **Local MySQL Credentials:** Standard XAMPP default (`root` user with empty password on `127.0.0.1:3306`). Tested and confirmed functional.
2. **Bangladesh Locale:** Currency unit is Bangladeshi Taka (`৳` / BDT), formatted with 2 decimal places or clean integer display. Phone validation adheres to BD format `+8801[3-9]\d{8}` or `01[3-9]\d{8}`.
3. **Hero Audio Playback:** Browsers mandate user gesture for audio unmuting. Hero component will implement visible Play/Unmute toggle with sound enabled on interaction.

---

## 5. External Services & Blockers
1. **SSLCommerz Live Credentials:** Sandbox credentials will be used for testing with server-side validation boundary. Live merchant store ID and secret will remain configurable via environment variables without hardcoded secrets.
2. **Production Email/SMS Gateway:** Fallback mock/log transport will be provided for transactional notifications when live SMTP credentials are unconfigured.
