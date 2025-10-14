import {
  ConfigPlugin,
  withPodfile,
  withPodfileProperties,
  withXcodeProject,
} from "expo/config-plugins";
import path from "node:path";
import { addCustomRubyScriptImport, addNewPodsTarget } from "./ios/podfile";
import {
  configureBuildPhases,
  configureBuildSettings,
  createFramework,
  createGroup,
} from "./ios/project";
import { Constants } from "./utils/constants";
import {
  createFileFromTemplate,
  createFileFromTemplateAs,
  mkdir,
} from "./utils/filesystem";

const withXcodeProjectPlugin: ConfigPlugin = (config) => {
  return withXcodeProject(config, (config) => {
    const projectRoot = config.modRequest.projectRoot;
    const xcodeProject = config.modResults;

    const target = createFramework(xcodeProject, Constants.Target.Name);

    const groupPath = path.join(projectRoot, "ios", Constants.Target.Name);
    mkdir(groupPath);
    createFileFromTemplate("ExpoApp.swift", "ios", groupPath);
    createGroup(xcodeProject, Constants.Target.Name, groupPath, [
      "ExpoApp.swift",
    ]);

    createFileFromTemplate("Info.plist", "ios", groupPath, {
      targetName: Constants.Target.Name,
    });
    createFileFromTemplateAs(
      "Target.entitlements",
      "ios",
      groupPath,
      Constants.Target.Name + ".entitlements"
    );

    configureBuildPhases(xcodeProject, target, [
      `${Constants.Target.Name}/ExpoApp.swift`,
    ]);
    configureBuildSettings(
      xcodeProject,
      Constants.Target.Name,
      config.ios?.buildNumber || "1"
    );

    return config;
  });
};

const withPodfilePlugin: ConfigPlugin = (config) => {
  return withPodfile(config, (config) => {
    config.modResults.contents = addCustomRubyScriptImport(
      config.modResults.contents
    );
    config.modResults.contents = addNewPodsTarget(
      config.modResults.contents,
      Constants.Target.Name
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
