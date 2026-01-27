# Pubudu Tharanga - Professional Portfolio

![Portfolio Preview](public/og-image-2026.jpg)

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
- **Analytics**: Integrated Vercel Analytics and Speed Insights for real-time performance monitoring.

### 🔍 Advanced SEO Strategy
- **Single Source of Truth**: Centralized metadata management via `SeoMeta.jsx`.
- **Structured Data (JSON-LD)**: Rich `Person` and `Article` schema for Google Knowledge Graph integration.
- **Dynamic Metadata**: Unique meta tags, Open Graph, and Twitter Cards for every page and blog post.
- **Sitemap & Robots**: Automatically generated and optimized for crawlers.

### 📱 Progressive Web App (PWA)
- **Installable**: Full manifest support allows valid PWA installation.
- **Offline Ready**: Caching strategies for resilient user experience.

---

## 🛠 Tech Stack

- **Core**: React 19, JavaScript (ES6+)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer
- **Routing**: React Router v7
- **Animations**: Framer Motion
- **SEO**: React Helmet Async
- **Icons**: React Icons
- **Analytics**: Vercel Analytics, Speed Insights

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

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
   Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### Build for Production

```bash
npm run build
```
This enables the type check, linting, and produces optimized static assets in the `dist` folder.

---

## 📂 Project Structure

```bash
src/
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

## 🚢 Deployment & CI/CD

The project is optimized for automated deployment via **Vercel**.

### Vercel (Recommended)
- Connect your GitHub repository to Vercel.
- Every push to `main` will trigger a production deployment.
- Pull Requests will generate unique Preview URLs.

### Manual / Custom Deployment
For scenarios requiring manual control or custom status checks, use the included scripts:

- **Bash (Linux/Mac/Git Bash)**:
  ```bash
  ./deploy.sh "Your commit message"
  ```
  *Handles staging, committing, and pushing with status checks.*

- **PowerShell (Windows)**:
  ```powershell
  ./deploy.ps1
  ```

---

## 📄 Copyright & License

**© 2026 Pubudu Tharanga. All Rights Reserved.**

This project is a personal portfolio and is intended for demonstration purposes only.
- You **may not** use this code for commercial purposes.
- You **may not** redistribute or modify this code without explicit permission.
