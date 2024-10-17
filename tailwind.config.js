/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{svelte,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#F9FAFB', // Blanc cassé pour le texte principal
          DEFAULT: '#111827', // Presque noir pour le fond principal
          dark: '#030712', // Noir profond pour les éléments d'accentuation
        },
        secondary: {
          light: '#E5E7EB', // Gris très clair pour le texte secondaire
          DEFAULT: '#1F2937', // Gris très foncé pour les fonds secondaires
          dark: '#374151', // Gris foncé pour les bordures et séparateurs
        },
        accent: {
          light: '#D1D5DB', // Gris clair pour les éléments interactifs inactifs
          DEFAULT: '#4B5563', // Gris moyen pour les éléments interactifs au survol
          dark: '#6B7280', // Gris clair-moyen pour les éléments interactifs actifs
        },
      },
    },
  },
  plugins: [],
};
