module.exports = {
  content: ['./pages/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    screens: {
      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }

      'maxsm': {'max': '639px'},
      // => @media (max-width: 639px) { ... }
    },
    extend: {
      colors: {
        primary: {
          100: '#56F569',
          200: '#A3A9A4',
          300: '#56F569',
          400: '#42C851',
          500: '#121212',
        },
        white: {
          100: '#FFFFFF',
          200: '#F5F5F5',
          300: '#D8D8D8',
          400: '#FFFFFF',
        },
        black: {
          100: '#606060',
          200: '#1F1F1F',
          300: '#090808',
          400: '#010101',
        },
        slate: {
          muted: '#A3A9A4',
          border: '#606060',
        },
        silver: {
          light: '#D8D8D8',
        },
      },
    },
    fontFamily: {
      sans: ['Barlow', 'sans-serif'],
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
}
