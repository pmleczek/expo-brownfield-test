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

export const configureBuildSettings = (project: XcodeProject) => {
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
};
