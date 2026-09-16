/**
 * Tailwind v3 config — deliberately v3, not v4. v4's build engine
 * (@tailwindcss/oxide) is a native Rust/NAPI binary with per-platform
 * builds, the same kind of native dependency that broke Next's own SWC
 * compiler on constrained shared-hosting build containers (see the
 * comment in next.config.mjs). v3's PostCSS plugin is pure JS, so it has
 * no such platform-compatibility failure mode.
 *
 * Colors below reference the CSS custom properties defined in
 * globals.css's :root block, so changing a brand color only requires
 * editing that one place. Those variables hold RGB triplets (e.g.
 * "27 27 24", not "#1b1b18"), and the rgb(var(--x) / <alpha-value>)
 * wrapper here is what makes opacity modifiers like text-brand-ink/70
 * actually generate — Tailwind substitutes <alpha-value> with the
 * modifier (or 1 with none). A bare var(--x) reference does NOT get
 * opacity-modifier support in Tailwind v3.
 *
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        "brand-ink": "rgb(var(--brand-ink) / <alpha-value>)",
        "brand-paper": "rgb(var(--brand-paper) / <alpha-value>)",
        "brand-surface": "rgb(var(--brand-surface) / <alpha-value>)",
        "brand-muted": "rgb(var(--brand-muted) / <alpha-value>)",
        "brand-line": "rgb(var(--brand-line) / <alpha-value>)",
        "brand-primary": "rgb(var(--brand-primary) / <alpha-value>)",
        "brand-primary-dark": "rgb(var(--brand-primary-dark) / <alpha-value>)",
        "brand-primary-soft": "rgb(var(--brand-primary-soft) / <alpha-value>)",
        "brand-accent": "rgb(var(--brand-accent) / <alpha-value>)",
        "brand-accent-soft": "rgb(var(--brand-accent-soft) / <alpha-value>)",
        "brand-danger": "rgb(var(--brand-danger) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
