/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff9f0',
          100: '#fef3e0',
          200: '#fde7c1',
          300: '#fcd89d',
          400: '#fac574',
          500: '#f8b04b',
          600: '#e69937',
          700: '#c97d28',
          800: '#a0621d',
          900: '#7a4a15',
        },
        secondary: {
          50: '#fdf8f6',
          100: '#f9ede8',
          200: '#f2d9cf',
          300: '#e9c0af',
          400: '#dda383',
          500: '#cd8357',
          600: '#b8693d',
          700: '#9a5530',
          800: '#7c4426',
          900: '#63361e',
        },
      },
    },
  },
  plugins: [],
}
