import {
  ConfigPlugin,
  withPodfile,
  withPodfileProperties,
  withXcodeProject,
} from "expo/config-plugins";
import path from "node:path";
import { addNewPodsTarget } from "./ios/podfile";
import {
  configureBuildPhases,
  configureBuildSettings,
  createFramework,
  createGroup,
} from "./ios/project";
import {
  createFileFromTemplate,
  createFileFromTemplateAs,
  mkdir,
} from "./utils/filesystem";

const TARGET_NAME = "BrownfieldApp";

const withXcodeProjectPlugin: ConfigPlugin = (config) => {
  return withXcodeProject(config, (config) => {
    const projectRoot = config.modRequest.projectRoot;
    const xcodeProject = config.modResults;

    const target = createFramework(xcodeProject, TARGET_NAME);

    const groupPath = path.join(projectRoot, "ios", TARGET_NAME);
    mkdir(groupPath);
    createFileFromTemplate("ExpoApp.swift", "ios", groupPath);
    createGroup(xcodeProject, TARGET_NAME, groupPath, ["ExpoApp.swift"]);

    createFileFromTemplate("Info.plist", "ios", groupPath, {
      targetName: TARGET_NAME,
    });
    createFileFromTemplateAs(
      "Target.entitlements",
      "ios",
      groupPath,
      TARGET_NAME + ".entitlements"
    );

    configureBuildPhases(xcodeProject, target);
    configureBuildSettings(
      xcodeProject,
      TARGET_NAME,
      config.ios?.buildNumber || "1"
    );

    xcodeProject.addBuildPhase(
      ["BrownfieldApp/ExpoApp.swift"],
      "PBXSourcesBuildPhase",
      target.pbxNativeTarget.name,
      target.uuid,
      "framework",
      '""'
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
