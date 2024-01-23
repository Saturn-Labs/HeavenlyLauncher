import Version from "../Version";

export enum VersionType
{
  Release = 0,
  Beta = 1,
  Preview = 2
}

export default class MinecraftVersion {
  version: Version;
  uuid: string;
  versionType: VersionType;

  constructor(version: Version, uuid: string, versionType: VersionType) {
    this.version = version;
    this.uuid = uuid;
    this.versionType = versionType;
  }
}