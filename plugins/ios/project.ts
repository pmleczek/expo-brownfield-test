import type { XcodeProject } from "@expo/config-plugins";
import type { Group, PbxGroup, Target } from "./types";

const FRAMEWORK_TYPE = "framework";

export const createFramework = (
  project: XcodeProject,
  targetName: string
): Target => {
  return project.addTarget(
    targetName,
    FRAMEWORK_TYPE,
    targetName,
    // TODO: use value from config instead of hardcoding
    `com.pmleczek.expo-brownfield-test.${targetName}`
  ) as unknown as Target;
};

export const getGroupByUUID = (
  project: XcodeProject,
  uuid: string
): PbxGroup => {
  return project.getPBXGroupByKey(uuid) as unknown as PbxGroup;
};

export const createGroup = (
  project: XcodeProject,
  name: string,
  path: string,
  files: string[] = []
): Group => {
  const group = project.addPbxGroup(
    files,
    name,
    path,
    '"<group>"'
  ) as unknown as Group;

  const mainGroup = getGroupByUUID(
    project,
    project.getFirstProject().firstProject.mainGroup
  );

  mainGroup.children = [
    ...mainGroup.children,
    { value: group.uuid, comment: name },
  ];

  return group;
};

export const configureBuildPhases = (project: XcodeProject, target: Target) => {
  const nativeTargetSection = project.pbxNativeTargetSection();

  const mainTargetKey = Object.keys(nativeTargetSection).find(
    (key) =>
      !key.endsWith("_comment") &&
      nativeTargetSection[key].productType ===
        '"com.apple.product-type.application"'
  );
  const mainTarget = nativeTargetSection[mainTargetKey];

  const BUNDLE_PHASE_NAME = "Bundle React Native code and images";
  const bundlePhase = mainTarget.buildPhases.find((phase: any) =>
    phase.comment.includes(BUNDLE_PHASE_NAME)
  );

  const destTargetKey = Object.keys(nativeTargetSection).find(
    (key) =>
      !key.endsWith("_comment") &&
      nativeTargetSection[key].productType !==
        '"com.apple.product-type.application"'
  );
  const destTarget = nativeTargetSection[destTargetKey];

  destTarget.buildPhases = [...destTarget.buildPhases, bundlePhase];

  const script = `
  FILE="\${SRCROOT}/Pods/Target Support Files/Pods-expobrownfieldtest-BrownfieldApp/ExpoModulesProvider.swift"

  if [ -f "$FILE" ]; then
    echo "Patching $FILE to hide Expo from public interface"

    # 1. Replace imports with internal imports
    sed -i '' 's/^import EX/internal import EX/' "$FILE"
    
    sed -i '' 's/^import Ex/internal import Ex/' "$FILE"

    # 2. Replace class visibility
    sed -i '' 's/public class ExpoModulesProvider/internal class ExpoModulesProvider/' "$FILE"
  fi
  `;

  project.addBuildPhase(
    [],
    "PBXShellScriptBuildPhase",
    "Patch ExpoModulesProvider",
    target.uuid,
    { shellPath: "/bin/sh", shellScript: script }
  );
};

export const configureBuildSettings = (
  project: XcodeProject,
  targetName: string,
  currentProjectVersion: string
) => {
  const commonBuildSettings = getCommonBuildSettings(
    targetName,
    currentProjectVersion,
    // TODO: use value from config instead of hardcoding
    `com.pmleczek.expo-brownfield-test.${targetName}`
  );

  const buildConfigurationList = [
    {
      name: "Debug",
      isa: "XCBuildConfiguration",
      buildSettings: {
        ...commonBuildSettings,
      },
    },
    {
      name: "Release",
      isa: "XCBuildConfiguration",
      buildSettings: {
        ...commonBuildSettings,
      },
    },
  ];

  const configurationList = project.addXCConfigurationList(
    buildConfigurationList,
    "Release",
    "Build configuration list for PBXNativeTarget"
  );

  const nativeTargetSection = project.pbxNativeTargetSection();

  const destTargetKey = Object.keys(nativeTargetSection).find(
    (key) =>
      !key.endsWith("_comment") &&
      nativeTargetSection[key].productType !==
        '"com.apple.product-type.application"'
  );
  const destTarget = nativeTargetSection[destTargetKey];

  destTarget.buildConfigurationList = configurationList.uuid;
};

const getCommonBuildSettings = (
  targetName: string,
  currentProjectVersion: string,
  bundleIdentifier: string
): Record<string, string> => {
  return {
    /* ASSETCATALOG_COMPILER_GLOBAL_ACCENT_COLOR_NAME = AccentColor;
    ASSETCATALOG_COMPILER_WIDGET_BACKGROUND_COLOR_NAME = WidgetBackground;
    CLANG_ANALYZER_NONNULL = YES;
    CLANG_ANALYZER_NUMBER_OBJECT_CONVERSION = YES_AGGRESSIVE;
    CLANG_CXX_LANGUAGE_STANDARD = "gnu++20";
    CLANG_ENABLE_OBJC_WEAK = YES;
    CLANG_WARN_DOCUMENTATION_COMMENTS = YES;
    CLANG_WARN_QUOTED_INCLUDE_IN_FRAMEWORK_HEADER = YES;
    CLANG_WARN_UNGUARDED_AVAILABILITY = YES_AGGRESSIVE;
    CODE_SIGN_STYLE = Automatic;
    DEBUG_INFORMATION_FORMAT = dwarf;
    DEVELOPMENT_TEAM = ;
    GCC_C_LANGUAGE_STANDARD = gnu11;
    
    LD_RUNPATH_SEARCH_PATHS = "$(inherited) @executable_path/Frameworks @executable_path/../../Frameworks";
    MARKETING_VERSION = 1.0;
    MTL_ENABLE_DEBUG_INFO = INCLUDE_SOURCE;
    MTL_FAST_MATH = YES;
    SKIP_INSTALL = YES;
    SWIFT_ACTIVE_COMPILATION_CONDITIONS = DEBUG;
    SWIFT_EMIT_LOC_STRINGS = YES;
    SWIFT_OPTIMIZATION_LEVEL = "-Onone"; */
    PRODUCT_NAME: `"$(TARGET_NAME)"`,
    SWIFT_VERSION: "5.0",
    TARGETED_DEVICE_FAMILY: `"1,2"`,
    INFOPLIST_FILE: `${targetName}/Info.plist`,
    CURRENT_PROJECT_VERSION: `"${currentProjectVersion}"`,
    // IPHONEOS_DEPLOYMENT_TARGET: `"${deploymentTarget}"`,
    PRODUCT_BUNDLE_IDENTIFIER: `"${bundleIdentifier}"`,
    GENERATE_INFOPLIST_FILE: `"YES"`,
    INFOPLIST_KEY_CFBundleDisplayName: targetName,
    INFOPLIST_KEY_NSHumanReadableCopyright: `""`,
    // MARKETING_VERSION: `"${marketingVersion}"`,
    SWIFT_OPTIMIZATION_LEVEL: `"-Onone"`,
    CODE_SIGN_ENTITLEMENTS: `"${targetName}/${targetName}.entitlements"`,
    // DEVELOPMENT_TEAM: `""`,
  };
};
