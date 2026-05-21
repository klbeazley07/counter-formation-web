/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian:   'var(--cf-obsidian)',
        champagne:  'var(--cf-gold)',
        ivory:      'var(--cf-ivory)',
        'cf-gold':  'var(--cf-gold)',
        'cf-ivory': 'var(--cf-ivory)',
        'cf-rule':  'var(--cf-rule-bg)',
        'cf-hero':  'var(--cf-hero-bg)',
      },
      fontFamily: {
        display:    ['Michroma', 'sans-serif'],
        brand:      ['Barlow Condensed', 'sans-serif'],
        devotional: ['Spectral', 'Georgia', 'serif'],
      },
      borderRadius: {
        'cf-card':  '20px',
        'cf-pill':  '999px',
      },
    },
  },
  plugins: [],
}
