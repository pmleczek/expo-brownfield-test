import {
  ConfigPlugin,
  withPodfile,
  withPodfileProperties,
  withXcodeProject,
} from "expo/config-plugins";
import fs from "node:fs";
import path from "node:path";
import { addNewPodsTarget } from "./ios/podfile";
import { createFramework, createGroup } from "./ios/project";

const TARGET_NAME = "BrownfieldApp";

const withXcodeProjectPlugin: ConfigPlugin = (config) => {
  return withXcodeProject(config, (config) => {
    const projectRoot = config.modRequest.projectRoot;
    const xcodeProject = config.modResults;

    createFramework(xcodeProject, TARGET_NAME);

    fs.mkdirSync(path.join(projectRoot, "ios", TARGET_NAME), {
      recursive: true,
    });
    createGroup(
      xcodeProject,
      TARGET_NAME,
      path.join(projectRoot, "ios", TARGET_NAME)
    );

    return config;
  });
};

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
  config = withXcodeProjectPlugin(config);
  config = withPodfilePlugin(config);
  config = withPodfilePropertiesPlugin(config);
  return config;
};

export default withIosPlugin;
