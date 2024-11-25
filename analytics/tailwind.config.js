/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        'mainbackgroundcolor':'#202124',
        'columnbackgroundcolor':'#161C22',
        "cardbordercolor":'#404040',
        "cardbackgroundcolor":'#262626',
        'cardtextcolor':"#F5F5F5",
        'textheadingcolor':'#D4D4D4',
        'textblurcolor':'#FFFFFFB3',
        "addbuttoncolor":'#A3A3A3',
        "navActiveColor":"#FF6300",
        "sidehoverColor":'#252628',
        "linecolor":'#373a3d',
        "buttonbordercolor":"#738496",
        "textcolor":"#b6c2cf",
        "buttonPrimary":"#0088ff",
        "errorPrimary":"#E23636",
        "successPrimary":"#82DD55"

      }
    },
  },
  plugins: [],
}