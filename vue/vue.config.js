const { defineConfig } = require("@vue/cli-service");
const WebpackObfuscator = require("webpack-obfuscator");

const isDev = process.env.NODE_ENV !== "production";

const webpackSourceMap = isDev
  ? {
      devtool: "source-map",
      optimization: {
        splitChunks: {
          chunks: "all",
        },
      },
    }
  : {};

module.exports = defineConfig({
  transpileDependencies: false,
  productionSourceMap: isDev,
  configureWebpack: webpackSourceMap,
  pluginOptions: {
    electronBuilder: {
      chainWebpackMainProcess: (config) => {
        if (!isDev) config.plugin("webpack-obfuscator").use(WebpackObfuscator);
      },
      customFileProtocol: "./",
      preload: "./src/preload.js",
      builderOptions: {
        appId: "com.mikosh-launcher.app",
        productName: "Mikosh Launcher",
        icon: "./public/icon.ico",
        publish: [
          {
            provider: "github",
            private: false,
            owner: "Mikosh2010",
            repo: "ms-storage",
          },
        ],
        win: {
          target: [
            {
              target: "nsis",
              arch: ["ia32", "x64"],
            },
          ],
          requestedExecutionLevel: "requireAdministrator",
        },
        nsis: {
          oneClick: true,
          deleteAppDataOnUninstall: true,
          runAfterFinish: true,
          guid: "mikosh-launcher",
        },
        nodeVersion: "19.9.0",
        extraResources: "7z",
      },
    },
  },
});
