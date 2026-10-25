<div align="center">

<h1>&lt;ResumeTemplate /&gt;</h1>

<p><b>A sleek, dark-first, bilingual resume website.</b><br>
Persian (RTL) + English (LTR). Zero frameworks. Zero CDN.</p>

<p>
  <a href="https://MohamadKaviani.github.io/resume-website-template/"><img src="https://img.shields.io/badge/%E2%96%B6_Live_Demo-84cc16?style=for-the-badge&labelColor=18181b" alt="Live Demo"></a>
  <a href="https://github.com/MohamadKaviani/resume-website-template/generate"><img src="https://img.shields.io/badge/Use_this_template-18181b?style=for-the-badge&logo=github&logoColor=84cc16" alt="Use this template"></a>
</p>

<p>
  <img src="https://img.shields.io/badge/HTML5-semantic-84cc16?style=flat-square&logo=html5&logoColor=white&labelColor=18181b" alt="HTML5">
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-84cc16?style=flat-square&logo=tailwindcss&logoColor=white&labelColor=18181b" alt="Tailwind CSS v4">
  <img src="https://img.shields.io/badge/JavaScript-vanilla-84cc16?style=flat-square&logo=javascript&logoColor=white&labelColor=18181b" alt="Vanilla JavaScript">
  <img src="https://img.shields.io/badge/Languages-FA_%7C_EN-84cc16?style=flat-square&labelColor=18181b" alt="Persian and English">
  <img src="https://img.shields.io/badge/License-MIT-84cc16?style=flat-square&labelColor=18181b" alt="MIT License">
</p>

</div>

<!-- Tip: add a screenshot at assets/preview.png and uncomment the line below
<p align="center"><img src="assets/preview.png" alt="Preview" width="800"></p>
-->

---

## ✨ Features

| | |
|---|---|
| 🌍 **Bilingual** | Ready pages in Persian (`index.html`, RTL) and English (`en.html`, LTR) with a language switch |
| 🌗 **Dark / Light theme** | One-click toggle with a glitch-style transition, remembered in the browser |
| 💻 **Hero animation** | Animated code-style canvas background |
| 🧈 **Smooth scrolling** | Buttery scroll powered by Lenis, plus scroll-based effects |
| 📱 **Fully responsive** | Mobile menu, back-to-top button, fluid layout |
| ♿ **Motion-friendly** | Respects `prefers-reduced-motion` |
| 🔤 **Self-hosted font** | Vazirmatn, no external font requests |

## 🧩 Sections

`Hero` → `About` → `Skills` → `Projects` → `Experience` → `Contact`

## 🚀 Quick start

1. Click **Use this template** → **Create a new repository**.
2. Replace the placeholder text, links and images in `index.html` and `en.html`.
3. Go to **Settings → Pages**, choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
4. Your site goes live at `https://USERNAME.github.io/REPO-NAME/`.

> Use **relative** paths (like `assets/css/tailwind.css`) so everything works under the `/REPO-NAME/` subpath.

## 🗂️ Project structure

```text
├── index.html            Persian version (RTL)
├── en.html               English version (LTR)
├── assets/
│   ├── css/              tailwind.css (compiled), custom.css
│   ├── fonts/            Vazirmatn.woff2
│   ├── images/           photo and project placeholders
│   └── js/               main.js, hero-animation.js, smooth-scroll.js
│       └── vendor/       lenis.min.js
└── src/
    └── input.css         Tailwind source
```

## 🎨 Customizing styles

Edit `src/input.css`, then rebuild `assets/css/tailwind.css` with the Tailwind build script from `package.json` (run `npm install` first).

The accent color is Tailwind's **lime** on a **zinc** palette. Change the lime utilities to restyle the whole site.

## ⚠️ Good to know

The contact form is front-end only. Connect it to a form service (Formspree, Web3Forms, etc.) to receive messages.

## 📄 License

Released under the [MIT License](LICENSE). Free to use, modify and share.

<div align="center">

<sub>Built with 💚 and lime-green accents.</sub>

</div>
