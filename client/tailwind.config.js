/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";
import flowbite from "flowbite/plugin"

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    colors: {
      primaryUser: "#D4A85D",
      primaryBusiness: "#7AA6E5",
      primaryAdmin: "#65C4A3",
      secondUser: "#EDD574",
      secondBusiness: "#8A7BE5",
      secondAdmin: "#CFEA7A",
      primaryNoRole: '#3B82F6', // กำหนดสีหลักที่ไม่มีบทบาท
      secondNoRole: '#4FD1C5', // กำหนดสีรองที่ไม่มีบทบาท
      alert: "#dc143c ",
      smoke: "#848884  ",
      white: "#FFFFFF",
      whiteSmoke: "#f1f1f1",
      dark: "#000",
      cardBackgroudDaekMode: "#2C2C2C ",
      borderedDarkMode: "#3D3D3D ",
    },
    boxShadow: {
      'boxShadow': '0 0px 3px 0px rgba(0, 0, 0, 0.3)',
      'buttonShadow': '0 0px 10px 0px rgba(0, 0, 0, 0.3)',
    },
    extend: {
      scale: {
        '101': '1.01',
        '102': '1.02',
        '103': '1.03',
        '104': '1.04',
      },
    },
  },
  plugins: [daisyui, flowbite],
};
