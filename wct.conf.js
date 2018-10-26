module.exports = {
  plugins: {
    local: {
      'skipSeleniumInstall': true,
      'disabled': true,
    },
    "headless": {
      "browsers": [
        "chrome"
      ],
      "browsersOptions": {
        "chrome": [
          "window-size=1920,1080",
          "headless",
          "disable-gpu",
          "no-sandbox"
        ]
      }
    }
  },
  // sauce: false,
},
  skipUpdateCheck: true
};
