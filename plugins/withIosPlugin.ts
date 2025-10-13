import {
  ConfigPlugin,
  withPodfile,
  withPodfileProperties,
  withXcodeProject,
} from "expo/config-plugins";
import path from "node:path";
import { addNewPodsTarget } from "./ios/podfile";
import {
  configureBuildSettings,
  createFramework,
  createGroup,
} from "./ios/project";
import { mkdir } from "./utils/filesystem";

const TARGET_NAME = "BrownfieldApp";

const withXcodeProjectPlugin: ConfigPlugin = (config) => {
  return withXcodeProject(config, (config) => {
    const projectRoot = config.modRequest.projectRoot;
    const xcodeProject = config.modResults;

    createFramework(xcodeProject, TARGET_NAME);

    const groupPath = path.join(projectRoot, "ios", TARGET_NAME);
    mkdir(groupPath);
    createGroup(xcodeProject, TARGET_NAME, groupPath);

    // TODO: Create and add the entrypoint file

    configureBuildSettings(xcodeProject);

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
