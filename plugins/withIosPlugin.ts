import { ConfigPlugin, withXcodeProject } from "expo/config-plugins";

const withIosPlugin: ConfigPlugin = (config) => {
  return withXcodeProject(config, (config) => {
    console.log("Test iOS");
    return config;
  });
};

export default withIosPlugin;
