module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        backdrop: "#121212",
        primary: "#1db954",
        active: "#282828",
        link: "#b3b3b3",
        footer: "#181818",
      },
      fontFamily: {
        hartwell: ["Hartwell", "sans-serif"],
      },
      fontSize: {
        s: "0.813rem",
      },
      boxShadow: {
        spotify: "0 2px 4px 0 rgb(0 0 0 / 20%)",
      },
      backgroundImage: {
        gradientIntroTitle: "linear-gradient(90deg, #CE5AFF, #7C64BD)",
        woodFrame: "url('./resources/frame.png')",
        greenBtn: "url('./resources/greenBtn.png')",
        mainBorder: "url('./resources/mainBorder.png')",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("daisyui")],
};
