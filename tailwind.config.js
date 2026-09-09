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
 * editing that one place.
 *
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "brand-ink": "var(--brand-ink)",
        "brand-paper": "var(--brand-paper)",
        "brand-surface": "var(--brand-surface)",
        "brand-muted": "var(--brand-muted)",
        "brand-line": "var(--brand-line)",
        "brand-primary": "var(--brand-primary)",
        "brand-primary-dark": "var(--brand-primary-dark)",
        "brand-primary-soft": "var(--brand-primary-soft)",
        "brand-accent": "var(--brand-accent)",
        "brand-accent-soft": "var(--brand-accent-soft)",
        "brand-danger": "var(--brand-danger)",
      },
      fontFamily: {
        sans: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
