import { VersionUtils } from "@renderer/utils/Utils";
import Version from "../Version";

export default class Mod {
  name: string;
  uuid: string;
  version: string;
  runtimeVersion: string;
  isCoreMod: boolean;

  constructor(name: string, uuid: string, version: Version, runtimeVersion: Version, isCoreMod: boolean) {
    this.name = name;
    this.uuid = uuid;
    this.version = version.toString();
    this.runtimeVersion = runtimeVersion.toString();
    this.isCoreMod = isCoreMod;
  }
}