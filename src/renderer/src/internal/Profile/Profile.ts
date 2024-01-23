import Version from "../Version";

export class Profile {
  uuid: string;
  name: string;
  version: string;

  constructor (uuid: string, name: string, gameVersion: Version) {
    this.uuid = uuid;
    this.name = name;
    this.version = gameVersion.toString();
  }

  static compare(lhs: Profile, rhs: Profile): boolean {
    return lhs.uuid === rhs.uuid;
  }
}