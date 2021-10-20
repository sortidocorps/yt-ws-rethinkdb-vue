// vue.config.js
module.exports = {
  // options...
  devServer: {
    proxy: "https://localhost:8090/chat",
  },
  configureWebpack: {
    devServer: {
      headers: { "Access-Control-Allow-Origin": "*" },
    },
  },
};
