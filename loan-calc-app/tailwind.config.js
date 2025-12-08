/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: '#023852',
        teal: '#079FA0',
        mint: '#9FD8C5',
        yellow: '#FAC005',
        orange: '#F58B01',
        red: '#DC2E2F',
        'bg-main': '#E8EEF1',
        'bg-card': '#FFFFFF',
      },
      fontFamily: {
        sans: ['Prompt', 'sans-serif'],
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(2, 56, 82, 0.08), 0 1px 2px rgba(2, 56, 82, 0.04)',
        'card-lg': '0 8px 24px rgba(2, 56, 82, 0.12), 0 2px 8px rgba(2, 56, 82, 0.08)',
        'card-xl': '0 12px 40px rgba(2, 56, 82, 0.15), 0 4px 12px rgba(2, 56, 82, 0.1)',
      },
    },
  },
  plugins: [],
}
