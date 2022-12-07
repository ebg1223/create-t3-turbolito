/* eslint-disable */
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */

const { withExpo } = require("@expo/next-adapter");
const withFonts = require("next-fonts");
const withImages = require("next-images");
const withPlugins = require("next-compose-plugins");
const withTM = require("next-transpile-modules")([
  "@acme/api",
  "@acme/auth",
  "@acme/db",
  "@acme/app",
  "solito",
  "dripsy",
  "@dripsy/core",
  //"moti",
]);

const nextConfig = {
  reactStrictMode: true, // off in solito due to moti, which is fixed pending dependancy update
  swcMinify: true, //not in solito
  images: {
    disableStaticImages: true,
  },
  experimental: {
    // Enables hot-reload and easy integration for local packages
    /*
    NOT WORKING FOR SOME REASON. EXPERIMENTAL
    transpilePackages: [
      "@acme/api",
      "@acme/auth",
      "@acme/db",
      "@acme/app",
      "solito",
      "dripsy",
      "@dripsy/core",
      "moti",
    ],
    */
    //forceSwcTransforms: false, // set this to true to use reanimated + swc experimentally
    swcPlugins: [[__dirname + "/plugins/swc_plugin_reanimated.wasm", {}]],
  },
  // We already do linting on GH actions
  eslint: {
    ignoreDuringBuilds: !!process.env.CI,
  },
};

const transform = withPlugins([withTM, withFonts, withImages, withExpo]);

module.exports = function (name, { defaultConfig }) {
  return transform(name, {
    ...defaultConfig,
    ...nextConfig,
  });
};
