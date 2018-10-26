module.exports = {
  plugins: {
    local: {
      'skipSeleniumInstall': true,
      'disabled': false,
      'browsers': [
        'chrome'
      ],
      'browsersOptions': {
        'chrome': [
          'start-maximized',
          'headless',
          'disable-gpu',
          'no-sandbox'
        ]
      }
    },
    sauce: false,
  },
  skipUpdateCheck: true
};
