const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);
const navigationNamespace = "@react-navigation/";

config.resolver.extraNodeModules = {
  ...(config.resolver.extraNodeModules ?? {}),
  "@react-navigation/bottom-tabs": path.resolve(
    __dirname,
    "node_modules/@react-navigation/bottom-tabs",
  ),
  "@react-navigation/native": path.resolve(
    __dirname,
    "node_modules/@react-navigation/native",
  ),
};

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName.startsWith(navigationNamespace)) {
    return context.resolveRequest(
      context,
      path.resolve(__dirname, "node_modules", moduleName),
      platform,
    );
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativeWind(config, { input: "./global.css" });
