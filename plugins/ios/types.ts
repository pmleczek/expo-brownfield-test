export interface PbxNativeTarget {
  isa: string;
  name: string;
  productName: string;
  productReference: string;
  productType: string;
  buildConfigurationList: string;
  buildPhases: unknown[];
  buildRules: unknown[];
  dependencies: unknown[];
}

export interface Target {
  uuid: string;
  pbxNativeTarget: PbxNativeTarget;
}

export interface PbxGroupChild {
  value: string;
  comment: string;
}

export interface PbxGroup {
  isa: string;
  children: PbxGroupChild[];
  name: string;
  path: string;
  sourceTree: string;
}

export interface Group {
  uuid: string;
  pbxGroup: PbxGroup;
}
