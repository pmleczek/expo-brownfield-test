import { ExpoConfig } from "expo/config";
import "tsx/cjs";

module.exports = ({ config }: { config: ExpoConfig }) => {
  return {
    name: "expo-brownfield-test",
    slug: "expo-brownfield-test",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "expobrownfieldtest",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      bundleIdentifier: "com.pmleczek.expo-brownfield-test",
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundImage: "./assets/images/android-icon-background.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png",
      },
      edgeToEdgeEnabled: true,
      package: "com.pmleczek.expobrownfieldtest",
      predictiveBackGestureEnabled: false,
    },
    web: {
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            backgroundColor: "#000000",
          },
        },
      ],
      "./plugins/withPlugin.ts",
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
  };
};
