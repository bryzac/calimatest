/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./"],
  theme: {
    extend: {
      textColor: {
        test1: 'green',
      },
      //text-white p-1 hover:bg-[#f97020ec] transition ease-in-out rounded-lg
    },
  },
}

