# 🚀 Pubudu Tharanga - Professional Portfolio

![Portfolio Preview](./public/og-image-2026.jpg)

A high-performance, SEO-optimized personal portfolio and blog built with the latest modern web technologies. Designed to showcase projects, skills, and technical articles with a premium user experience.

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge&logo=vercel)](https://pubudu-tharanga.vercel.app/)
[![React 19](https://img.shields.io/badge/React-19.0-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-purple?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

---

## ✨ Key Features

### 🎨 UI/UX Design
- **Modern Aesthetics**: Glassmorphism effects, gradient text, and smooth transitions.
- **Theme-Aware**: Fully supported **Dark Mode** & Light Mode with persistent state.
- **Responsive**: Mobile-first design that adapts flawlessly to any screen size.
- **Animations**: Powered by `framer-motion` for engaging entry and scroll interactions.

### ⚡ Performance & Core Web Vitals
- **React 19**: Utilizing the latest concurrent features and compiler optimizations.
- **Vite Powered**: Instant start, lightning-fast HMR, and optimized production builds.
- **Lazy Loading**: Route-based code splitting and lazy-loaded images(`loading="lazy"`).
- **Resource Hints**: DNS prefetching and asset preloading for critical fonts/styles.

### 🔍 Advanced SEO Strategy
- **Single Source of Truth**: Centralized metadata management via `SeoMeta.jsx`.
- **Structured Data (JSON-LD)**: Rich `Person` and `Article` schema for Google Knowledge Graph integration.
- **Dynamic Metadata**: Unique meta tags, Open Graph, and Twitter Cards for every page and blog post.
- **Canonical URLs**: Strict domain consolidation to prevent duplicate content penalties.
- **Sitemap & Robots**: Automatically generated and optimized for crawlers.

### 📱 Progressive Web App (PWA)
- **Installable**: Full manifest support allows valid PWA installation.
- **Offline Ready**: Caching strategies for resilient user experience.
- **Mobile Native Feel**: `theme-color` and touch icons configured.

---

## 🛠 Tech Stack

- **Core**: React 19, JavaScript (ES6+)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer
- **Routing**: React Router v7
- **Animations**: Framer Motion
- **SEO**: React Helmet Async
- **Icons**: React Icons (Fa, Fi, Si packs)
- **Deployment**: Vercel (CI/CD)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/pubudutharanga/pubudu-portfolio.git
   cd pubudu-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

### Build for Production

```bash
npm run build
```
This enables the type check, linting, and produces optimized static assets in the `dist` folder.

---

## 📂 Project Structure

```bash
src/
├── assets/          # Static assets imports
├── components/      # Reusable UI components (Header, Footer, SeoMeta...)
├── pages/           # Route components (Home, Blog, PostPage...)
├── sections/        # Homepage sections (Hero, About, Portfolio...)
├── styles/          # Global styles & Tailwind directives
├── App.jsx          # Main application layout & provider setup
├── data.js          # Centralized content (Projects, Education, Site Config)
└── main.jsx         # Entry point (Strict Mode, Helmet, Router)
public/              # Static files (images, standard favicon, robots.txt, sitemap)
```

---

## 🚢 Deployment

The project is configured for automated deployment via **Vercel**.

### Manual Deployment
You can also use the included scripts for manual updates:

- **Bash (Linux/Mac/Git Bash)**:
  ```bash
  npm run push
  # or
  ./deploy.sh "Your commit message"
  ```

- **PowerShell (Windows)**:
  ```powershell
  npm run push:ps
  # or
  ./deploy.ps1
  ```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Made with ❤️ by <a href="https://pubudu-tharanga.vercel.app/">Pubudu Tharanga</a>
</p>
