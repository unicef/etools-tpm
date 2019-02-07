module.exports = {
  plugins: {
    local: {
      // browsers: ["chrome", ]
      browsers: ["firefox"],
      browserOptions: {
        firefox: [
          "http://localhost:8081/components/tpm/generated-index.html?cli_browser_id=0",
          "--headless"
        ]
      }
    },
    sauce: false,
  },
  skipUpdateCheck: true
};
