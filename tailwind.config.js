/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html'],
  theme: {
    fontFamily: {
      sans: ['Poppins', 'sans-serif'],
    },
    extend: {
      screens: {
        xs: '375px',
        '2xl': '1440px',
      },
      colors: {
        cyan: 'hsl(180, 66%, 49%)',
        'violet-medium': 'hsl(257, 27%, 26%)',
        red: 'hsl(0, 87%, 67%)',
        'custom-gray': 'hsl(0, 0%, 75%)',
        'custom-gray-light': 'hsl(255, 33%, 95%)',
        'gray-violet': 'hsl(257, 7%, 63%)',
        'blue-dark': 'hsl(255, 11%, 22%)',
        'violet-dark': 'hsl(260, 8%, 14%)',
        attribution: 'hsl(228, 45%, 44%)',
      },
    },
  },
  plugins: [],
};
