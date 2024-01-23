export enum VersionComparisonResult {
  LessThan = -1,
  Equal = 0,
  GreaterThan = 1,
}

export default class Version {
  major: number;
  minor: number;
  patch: number;
  build: number;

  constructor(major: number, minor: number, patch: number, build: number) {
    this.major = major;
    this.minor = minor;
    this.patch = patch;
    this.build = build;
  }

  toString(): string {
    return `${this.major}.${this.minor}.${this.patch}.${this.build}`;
  }

  static fromString(versionString: string): Version | null {
    const versionRegex = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
    const match = versionString.match(versionRegex);

    if (match) {
      const [, major, minor, patch, build] = match.map(Number);
      return new Version(major, minor, patch, build);
    }

    console.error('Invalid version string format');
    return null;
  }

  static compareVersions(version1: Version, version2: Version): VersionComparisonResult {
    if (version1.major !== version2.major) {
      return version1.major < version2.major ? VersionComparisonResult.LessThan : VersionComparisonResult.GreaterThan;
    }

    if (version1.minor !== version2.minor) {
      return version1.minor < version2.minor ? VersionComparisonResult.LessThan : VersionComparisonResult.GreaterThan;
    }

    if (version1.patch !== version2.patch) {
      return version1.patch < version2.patch ? VersionComparisonResult.LessThan : VersionComparisonResult.GreaterThan;
    }

    return version1.build < version2.build ? VersionComparisonResult.LessThan : version1.build > version2.build ? VersionComparisonResult.GreaterThan : VersionComparisonResult.Equal;
  }

  public static zero: Version = new Version(0, 0, 0, 0);
}