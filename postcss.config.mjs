/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {}, // Updated Tailwind PostCSS plugin
    autoprefixer: {},           // Ensure autoprefixer is included
  },
};

export default config;
