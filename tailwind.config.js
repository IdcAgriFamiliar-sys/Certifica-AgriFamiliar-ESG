/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Garante que o Tailwind analise todos os seus arquivos de código
  ],
  theme: {
    extend: {
      // Você pode adicionar cores personalizadas, fontes, etc., aqui
    },
  },
  plugins: [],
}
