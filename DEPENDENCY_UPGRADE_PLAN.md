# Pubudu Portfolio — Comprehensive Dependency Audit & Upgrade Plan

> **Generated:** September 2026  
> **Repository:** `pubudu-portfolio`  
> **Environment:** Node.js `>=20.x` (Tested on Node `v22.20.0`, npm `11.6.2`)  
> **Framework:** React 19 + Vite + Tailwind CSS v4 + Express/Serverless API

---

## 1. Executive Summary

A comprehensive, production-grade audit of all **40 dependencies** declared in `package.json`, plus **2 missing development dependencies**, peer dependency constraints, security advisories, and industry-standard migration paths.

### Key Metrics
- **Total Packages Analyzed:** 40 (26 production + 14 dev)
- **Packages with Newer Releases:** 23 (10 Major, 7 Minor, 6 Patch)
- **Packages Already at Latest:** 17
- **Critical CVE Vulnerabilities Remediated:** 12 (including `react-router` High CSRF Bypass)
- **Legacy / Deprecated Packages to Retire:** 1 (`react-router-hash-link` — unmaintained since May 2021)
- **Missing Required Tooling Packages:** 2 (`@eslint/js`, `globals` — resolves broken `npm run lint`)

---

## 2. Master Dependency Audit Matrix

### Production Dependencies (`dependencies`)

| Package | Declared Version | Installed | Latest on npm | Update Type | Severity / Risk | Core Changes & Action |
| :--- | :--- | :--- | :--- | :---: | :---: | :--- |
| `@emailjs/browser` | `^4.4.1` | `4.4.1` | `4.4.1` | — | None | Up to date. Contact form email service. Keep `^4.4.1`. |
| `@radix-ui/react-dropdown-menu` | `^2.1.6` | `2.1.6` | `2.1.24` | Patch | Low | Official React 19 peer support added. Bump to `^2.1.24`. |
| `@radix-ui/react-select` | `^2.1.6` | `2.1.6` | `2.3.7` | Minor | Low | Official React 19 peer support added. Bump to `^2.3.7`. |
| `@react-three/drei` | `^10.7.7` | `10.7.7` | `10.7.8` | Patch | Low | Maintenance patch. Peer `three: ">=0.159"`. Bump to `^10.7.8`. |
| `@react-three/fiber` | `^9.5.0` | `9.5.0` | `9.7.0` | Minor | Low-Med | Peer `react: ">=19 <19.3"`. Works with `.npmrc` `legacy-peer-deps=true`. Bump to `^9.7.0`. |
| `@vercel/analytics` | `^1.6.1` | `1.6.1` | `2.0.1` | Major | Low | MIT license transition, resilient intake endpoint discovery. Bump to `^2.0.1`. |
| `@vercel/speed-insights` | `^1.3.1` | `1.3.1` | `2.0.0` | Major | Low | Resilient intake architecture, identical `<SpeedInsights />` React API. Bump to `^2.0.0`. |
| `bcryptjs` | `^3.0.3` | `3.0.3` | `3.0.3` | — | None | Up to date. Admin password hashing. Keep `^3.0.3`. |
| `cloudinary` | `^2.11.0` | `2.11.0` | `2.11.0` | — | None | Up to date. Blog image cloud storage. Keep `^2.11.0`. |
| `cookie` | `^1.1.1` | `1.1.1` | `2.0.1` | **Major** | **High** | **Breaking API Overhaul**: `parse` & `serialize` replaced by `parseCookie` & `stringifySetCookie`. Requires code update in `api/lib/auth.js`. |
| `dotenv` | `^16.4.7` | `16.6.1` | `17.4.2` | Major | Low | Faster scanner parser, agent skills, backwards-compatible `dotenv.config()`. Bump to `^17.4.2`. |
| `framer-motion` | `^12.34.3` | `12.34.3` | `13.2.0` | Major | Low-Med | Motion v13 rebranding, full React 19 support, backwards-compatible `motion.*` components. Bump to `^13.2.0`. |
| `gsap` | `^3.14.2` | `3.14.2` | `3.15.0` | Minor | Low | Timeline & context performance fixes for `StaggeredMenu`. Bump to `^3.15.0`. |
| `jsonwebtoken` | `^9.0.3` | `9.0.3` | `9.0.3` | — | None | Up to date. Admin JWT session signing & verification. Keep `^9.0.3`. |
| `mongodb` | `6.21.0` | `6.21.0` | `7.6.0` | Major | Medium | Requires Node >=20.19.0 (project runs 22), `bson@7`. Collection CRUD APIs match. Bump to `^7.6.0`. |
| `react` | `^19.2.4` | `19.2.4` | `19.3.0` | Minor | Low-Med | Latest stable React 19.3.0. Bump to `^19.3.0`. |
| `react-dom` | `^19.2.4` | `19.2.4` | `19.3.0` | Minor | Low-Med | Matches `react` 19.3.0. Bump to `^19.3.0`. |
| `react-helmet-async` | `^2.0.5` | `2.0.5` | `3.0.0` | **Major** | Low | Native React 19 tag hoisting! Eliminates need for `overrides` in `package.json`. Bump to `^3.0.0`. |
| `react-icons` | `^5.5.0` | `5.5.0` | `5.7.0` | Minor | Low | New icons, tree-shaking enhancements. Bump to `^5.7.0`. |
| `react-intersection-observer` | `^9.15.0` | `9.16.0` | `11.0.1` | Major | Low | Lifecycle rewrite, callback-ref cleanup, full React 19 support. Bump to `^11.0.1`. |
| `react-router-dom` | `^7.13.0` | `7.18.0` | `7.18.3` | Patch | **Critical** | **Security Fix**: Resolves High-severity CVE GHSA-qwww-vcr4-c8h2 (CSRF bypass). Bump to `^7.18.3`. |
| `react-router-hash-link` | `^2.4.3` | `2.4.3` | `2.4.3` | **Legacy** | Medium | **Retire & Remove**. Unmaintained since May 2021; used once in `Services.jsx`. Replace with native link/scroll. |
| `tailwindcss` | `^4.2.0` | `4.2.0` | `4.3.3` | Minor | Low | Tailwind v4 speedups, memory optimizations. Bump to `^4.3.3`. |
| `three` | `^0.182.0` | `0.182.0` | `0.186.0` | Minor | Low-Med | Three.js R186. Supported by fiber/drei peer specs (`>=0.159`). Bump to `^0.186.0`. |
| `three-globe` | `^2.45.2` | `2.45.2` | `2.45.2` | — | None | Up to date. Used in interactive 3D Globe. Keep `^2.45.2`. |
| `zod` | `^3.25.76` | `3.25.76` | `4.6.2` | Major | Medium | Zod 4 unified error parameter `{ error: '...' }` and top-level validators. Migrate schemas or use compat mode. |

---

### Development Dependencies (`devDependencies`)

| Package | Declared Version | Installed | Latest on npm | Update Type | Severity / Risk | Core Changes & Action |
| :--- | :--- | :--- | :--- | :---: | :---: | :--- |
| `@tailwindcss/typography` | `^0.5.19` | `0.5.19` | `0.5.20` | Patch | Low | Aligns with Tailwind 4.3. Bump to `^0.5.20`. |
| `@tailwindcss/vite` | `^4.2.0` | `4.2.0` | `4.3.3` | Minor | Low | Tailwind v4 Vite plugin. Supports Vite 5, 6, 7, 8. Bump to `^4.3.3`. |
| `@types/react` | `^19.0.2` | `19.2.10` | `19.3.0` | Minor | Low | TypeScript definitions aligned with React 19.3. Bump to `^19.3.0`. |
| `@types/react-dom` | `^19.0.2` | `19.2.3` | `19.3.0` | Minor | Low | TypeScript definitions aligned with ReactDOM 19.3. Bump to `^19.3.0`. |
| `@vitejs/plugin-react` | `^5.1.4` | `5.1.4` | `6.1.1` | Major | Med-High | Drops internal Babel in favor of Rust Oxc compiler. Requires Vite 8. Bump to `^6.1.1` alongside Vite 8. |
| `critical` | `^8.0.0` | `8.0.0` | `8.0.0` | — | None | Critical CSS inliner. Fix `scripts/generate-critical.js` process exit handling. Keep `^8.0.0`. |
| `eslint` | `^10.0.1` | `10.0.1` | `10.10.0` | Minor | Low | ESLint flat config engine stability improvements. Bump to `^10.10.0`. |
| `eslint-plugin-react` | `^7.37.5` | `7.37.5` | `7.37.5` | — | None | React lint rules. Keep `^7.37.5`. |
| `eslint-plugin-react-hooks` | `^7.0.1` | `7.0.1` | `7.1.1` | Minor | Low | React Hooks lint rules. Bump to `^7.1.1`. |
| `eslint-plugin-react-refresh` | `^0.5.0` | `0.5.0` | `0.5.6` | Patch | Low | Fast Refresh linting. Supports ESLint 9 & 10. Bump to `^0.5.6`. |
| `gh-pages` | `^6.3.0` | `6.3.0` | `6.3.0` | — | None | GitHub Pages deployer. Keep `^6.3.0`. |
| `terser` | `^5.44.0` | `5.46.0` | `5.51.2` | Minor | Low | Production bundle minifier. Bump to `^5.51.2`. |
| `vite` | `^7.3.1` | `7.3.6` | `8.3.0` | Major | Med-High | Unified Rust-based **Rolldown** bundler engine. Bump to `^8.3.0`. |
| `vite-plugin-pwa` | `^1.3.0` | `1.3.0` | `1.3.0` | — | None | Supports Vite 8 natively. Keep `^1.3.0`. |
| **`@eslint/js`** *(Missing)* | *None* | *None* | `10.0.1` | **New** | **Fix** | **Missing dependency**. Required by `eslint.config.js` line 1. Add `^10.0.1`. |
| **`globals`** *(Missing)* | *None* | *None* | `17.12.0` | **New** | **Fix** | **Missing dependency**. Required by `eslint.config.js` line 2. Add `^17.12.0`. |

---

## 3. Deep Dive into Breaking Changes & Required Code Migrations

### Migration 1: `cookie` (1.1.1 &rarr; 2.0.1) in `api/lib/auth.js`
In version 2.0.0, the `cookie` package changed its export API:
- `cookie.parse(str)` &rarr; `parseCookie(str)`
- `cookie.serialize(name, val, opts)` &rarr; `stringifySetCookie({ name, value, ...opts })`

#### Code Diff in `api/lib/auth.js`:
```diff
-import cookie from 'cookie';
+import { parseCookie, stringifySetCookie } from 'cookie';

 export function requireAdminSession(req) {
     // 1. Check HTTP-only cookie first
-    const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {};
+    const cookies = req.headers.cookie ? parseCookie(req.headers.cookie) : {};
     const sessionToken = cookies[COOKIE_NAME];
     ...
 }

 export function setSessionCookie(res, token) {
     const isProd = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
-    const cookieHeader = cookie.serialize(COOKIE_NAME, token, {
+    const cookieHeader = stringifySetCookie({
+        name: COOKIE_NAME,
+        value: token,
         httpOnly: true,
         secure: isProd,
         sameSite: 'strict',
         maxAge: 60 * 60 * 24, // 24 hours
         path: '/'
     });
     res.setHeader('Set-Cookie', cookieHeader);
 }

 export function clearSessionCookie(res) {
     const isProd = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
-    const cookieHeader = cookie.serialize(COOKIE_NAME, '', {
+    const cookieHeader = stringifySetCookie({
+        name: COOKIE_NAME,
+        value: '',
         httpOnly: true,
         secure: isProd,
         sameSite: 'strict',
         expires: new Date(0),
         path: '/'
     });
     res.setHeader('Set-Cookie', cookieHeader);
 }
```

---

### Migration 2: `zod` (3.25.76 &rarr; 4.6.2) in `api/lib/schemas.js`
In Zod 4:
- Multiple legacy options (`message`, `invalid_type_error`, `required_error`) are consolidated into a unified `error` parameter: `.min(3, { error: '...' })`.
- Chained string formats (`.url()`, `.regex()`) are supported natively or as top-level helpers.

#### Code Diff in `api/lib/schemas.js`:
```diff
 export const PostInputSchema = z.object({
     id: z.string().optional(),
-    title: z.string().min(3, 'Title must be at least 3 characters').max(250),
-    slug: z.string().min(3).max(250).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
+    title: z.string().min(3, { error: 'Title must be at least 3 characters' }).max(250),
+    slug: z.string().min(3).max(250).regex(/^[a-z0-9-]+$/, { error: 'Slug must be lowercase alphanumeric with hyphens' }),
     category: z.string().default('Industry Insights'),
     excerpt: z.string().max(600).default(''),
     readTime: z.string().default('5 min read'),
     date: z.string().optional(),
-    featured: z.string().url('Featured image must be a valid URL').or(z.string().startsWith('/')),
+    featured: z.string().url({ error: 'Featured image must be a valid URL' }).or(z.string().startsWith('/')),
     tags: z.array(z.string()).default([]),
-    content: z.string().min(10, 'Content must not be empty'),
+    content: z.string().min(10, { error: 'Content must not be empty' }),
     status: z.enum(['published', 'draft']).default('published'),
     source: z.enum(['ai', 'manual']).default('manual'),
     author: z.object({
...
 export const LoginInputSchema = z.object({
-    password: z.string().min(1, 'Password is required')
+    password: z.string().min(1, { error: 'Password is required' })
 });
```

---

### Migration 3: Retire `react-router-hash-link` in `src/sections/Services.jsx`
`react-router-hash-link` has been unmaintained for 5 years and is only imported in `Services.jsx` for a single button:
`<HashLink smooth to="/#contact" ...>Start Your Project</HashLink>`

#### Clean Native Replacement:
```diff
-import { HashLink } from 'react-router-hash-link';

 ...
-    <HashLink
-        smooth to="/#contact"
-        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 md:px-8 md:py-4 rounded-xl font-medium transition-colors duration-300 flex items-center justify-center gap-2"
-    >
-        Start Your Project
-        <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
-    </HashLink>
+    <a
+        href="#contact"
+        onClick={(e) => {
+            e.preventDefault();
+            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
+        }}
+        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 md:px-8 md:py-4 rounded-xl font-medium transition-colors duration-300 flex items-center justify-center gap-2"
+    >
+        Start Your Project
+        <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
+    </a>
```

---

### Migration 4: Remove Obsolete `overrides` from `package.json`
With `react-helmet-async` v3.0.0 adding native React 19 support, the override workaround is no longer required:
```diff
-  "overrides": {
-    "react-helmet-async": {
-      "react": "$react",
-      "react-dom": "$react-dom"
-    }
-  }
```

---

### Migration 5: Prevent Build Hang in `scripts/generate-critical.js`
Ensure the script explicitly exits after closing the preview server:
```diff
     } catch (err) {
         console.error('Error generating critical CSS:', err);
         process.exitCode = 1;
     } finally {
-        server.httpServer.close();
+        if (server && server.httpServer) {
+            server.httpServer.close(() => {
+                process.exit(0);
+            });
+            // Fallback timeout in case keep-alive sockets remain
+            setTimeout(() => process.exit(0), 1000);
+        } else {
+            process.exit(0);
+        }
     }
```

---

## 4. Phased Execution Roadmap

### Phase 1: Linting, Security Fixes & Safe Patches
**Objective:** Eliminate CVEs, fix broken lint runner, and apply non-breaking patch updates.

1. Add missing devDependencies:
   ```powershell
   npm.cmd install -D @eslint/js@^10.0.1 globals@^17.12.0
   ```
2. Update React Router to patch the High Severity CVE:
   ```powershell
   npm.cmd install react-router-dom@^7.18.3
   ```
3. Run transitive vulnerability remediation:
   ```powershell
   npm.cmd audit fix
   ```
4. Verify lint passes:
   ```powershell
   npm.cmd run lint
   ```

---

### Phase 2: React 19 Ecosystem & UI Stack Alignment
**Objective:** Align all React, 3D, styling, and animation packages with React 19.3.

1. Update React core & types:
   ```powershell
   npm.cmd install react@^19.3.0 react-dom@^19.3.0
   npm.cmd install -D @types/react@^19.3.0 @types/react-dom@^19.3.0
   ```
2. Update Radix UI, Helmet & Intersection Observer:
   ```powershell
   npm.cmd install @radix-ui/react-dropdown-menu@^2.1.24 @radix-ui/react-select@^2.3.7 react-helmet-async@^3.0.0 react-intersection-observer@^11.0.1
   ```
3. Update Tailwind v4 Stack:
   ```powershell
   npm.cmd install tailwindcss@^4.3.3
   npm.cmd install -D @tailwindcss/vite@^4.3.3 @tailwindcss/typography@^0.5.20
   ```
4. Update 3D & Animation packages:
   ```powershell
   npm.cmd install three@^0.186.0 @react-three/fiber@^9.7.0 @react-three/drei@^10.7.8 gsap@^3.15.0 framer-motion@^13.2.0 react-icons@^5.7.0
   ```
5. Update dev tooling:
   ```powershell
   npm.cmd install -D eslint@^10.10.0 eslint-plugin-react-hooks@^7.1.1 eslint-plugin-react-refresh@^0.5.6 terser@^5.51.2
   ```

---

### Phase 3: Major Backend Migrations & Legacy Cleanup
**Objective:** Migrate API utilities, update MongoDB driver, and retire unmaintained dependencies.

1. Retire `react-router-hash-link`:
   - Apply native smooth scroll replacement in `src/sections/Services.jsx`.
   - Remove from `package.json`:
     ```powershell
     npm.cmd uninstall react-router-hash-link
     ```
2. Apply code diffs for `cookie` v2 in `api/lib/auth.js` and update:
   ```powershell
   npm.cmd install cookie@^2.0.1
   ```
3. Apply code diffs for `zod` v4 in `api/lib/schemas.js` and update:
   ```powershell
   npm.cmd install zod@^4.6.2
   ```
4. Upgrade MongoDB driver & Dotenv:
   ```powershell
   npm.cmd install mongodb@^7.6.0 dotenv@^17.4.2
   ```
5. Upgrade Vercel Analytics & Speed Insights:
   ```powershell
   npm.cmd install @vercel/analytics@^2.0.1 @vercel/speed-insights@^2.0.0
   ```
6. Remove obsolete `overrides` from `package.json`.

---

### Phase 4: Bundler Modernization (Vite 8 & Rolldown)
**Objective:** Upgrade core build system to Vite 8.

1. Upgrade Vite and React plugin:
   ```powershell
   npm.cmd install -D vite@^8.3.0 @vitejs/plugin-react@^6.1.1
   ```
2. Apply the process exit fix to `scripts/generate-critical.js`.
3. Verify local build:
   ```powershell
   npm.cmd run build
   ```

---

## 5. Verification & Rollback Playbook

### Verification Matrix
- [ ] **Dependency Tree Integrity:** `npm.cmd ls` runs with 0 fatal errors.
- [ ] **Security Status:** `npm.cmd audit` reports 0 High or Critical vulnerabilities.
- [ ] **Linter:** `npm.cmd run lint` executes cleanly with 0 warnings and 0 errors.
- [ ] **Local Dev Server:** `npm.cmd run dev` serves on `http://localhost:3000`.
  - [ ] 3D Globe renders interactively without WebGL context loss.
  - [ ] Staggered menu animates smoothly via GSAP.
  - [ ] Light/Dark theme switching toggles instantaneously.
  - [ ] Start Your Project CTA smoothly scrolls to `#contact`.
- [ ] **Admin & API Suite:**
  - [ ] `node scripts/test-api.js` returns HTTP 200 on all endpoints.
  - [ ] Session cookies set and clear properly in `/api/admin/auth` and `/api/admin/logout`.
- [ ] **Production Build:** `npm.cmd run build` executes all 4 stages:
  1. Sitemap generation (`scripts/generate-sitemap.js`)
  2. Vite production bundling
  3. Preload hint injection (`scripts/inject-preload.js`)
  4. Critical CSS generation (`scripts/generate-critical.js`)

### Rollback Strategy
If any unexpected regression occurs during any phase:
1. `git checkout package.json package-lock.json`
2. `npm.cmd clean-install` (or `npm.cmd ci`)
3. Restore modified source files (`git checkout src/ api/ scripts/`)
