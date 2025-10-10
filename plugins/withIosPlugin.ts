import {
  ConfigPlugin,
  withPodfile,
  withPodfileProperties,
} from "expo/config-plugins";
import { addNewPodsTarget } from "./ios/podfile";

const TARGET_NAME = "BrownfieldApp";

const withPodfilePlugin: ConfigPlugin = (config) => {
  return withPodfile(config, (config) => {
    config.modResults.contents = addNewPodsTarget(
      config.modResults.contents,
      TARGET_NAME
    );
    return config;
  });
};

const withPodfilePropertiesPlugin: ConfigPlugin = (config) => {
  return withPodfileProperties(config, (config) => {
    config.modResults["ios.useFrameworks"] = "static";
    return config;
  });
};

const withIosPlugin: ConfigPlugin = (config) => {
  config = withPodfilePlugin(config);
  config = withPodfilePropertiesPlugin(config);
  return config;
};

export default withIosPlugin;
