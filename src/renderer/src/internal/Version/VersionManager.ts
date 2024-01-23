import { Path } from "@renderer/utils/Path";
import MinecraftVersion from "./MinecraftVersion";
import Version, { VersionComparisonResult } from "../Version";
import CancellationToken from "@renderer/utils/CancellationToken";
import { ActionBegin, ActionComplete, DownloadProgress, ExtractProgress } from "@renderer/utils/Progress";
import { download } from "@renderer/utils/MinecraftVersionDownloader";
import { Extractor } from "@renderer/utils/Extractor";
import { VersionUtils } from "@renderer/utils/Utils";
import { MainProgressBarController } from "@renderer/controllers/MainProgressBarController";
const regedit = window.require('regedit-rs') as typeof import('regedit-rs');
const fs = window.require('fs') as typeof import('fs');
const child = window.require('child_process') as typeof import('child_process')
const deasync = window.require('deasync') as typeof import('deasync');
const path = window.require('path') as typeof import('path')

export type VersionDownloadComplete = (success: boolean, version: Version) => void;
export interface VersionDownloadInformation {
  
}

export interface VersionExtractInformation {

}

export class VersionManager {
  private static gameFileExcludes = ["AppxMetadata/CodeIntegrity.cat", "AppxMetadata", "AppxBlockMap.xml", "AppxSignature.p7x", "[Content_Types].xml"];
  private m_MinecraftVersions: MinecraftVersion[] = [];
  private m_CacheVersionsConfigPath: string;
  private m_VersionsAppxPath: string;
  private m_isDownloading: boolean = false;
  private m_isExtracting: boolean = false;
  private m_isRegistering: boolean = false;
  private m_isUnregistering: boolean = false;
  private m_isLaunching: boolean = false;

  public OnDownloadBeginEvent: ActionBegin[] = [];
  public OnDownloadProgressEvent: DownloadProgress[] = [];
  public OnDownloadCompleteEvent: VersionDownloadComplete[] = [];
  public OnExtractBeginEvent: ActionBegin[] = [];
  public OnExtractProgressEvent: ExtractProgress[] = [];
  public OnExtractCompleteEvent: ActionComplete[] = [];

  public constructor(dataPath: string) {
    this.m_CacheVersionsConfigPath = Path.Combine(dataPath, 'versions.json');
    this.m_VersionsAppxPath = Path.Combine(dataPath, 'versions');
    this.cacheAndLoadMinecraftVersions();
  }

  private async cacheAndLoadMinecraftVersions(): Promise<void> {
    this.checkAndCreateJSONFile();
    const response = await fetch('https://mrarm.io/r/w10-vdb');
    if (!response.ok) {
      this.m_MinecraftVersions = JSON.parse(fs.readFileSync(this.m_CacheVersionsConfigPath, { encoding: 'utf-8' }));
      return;
    }
    const json: string[][] = await response.json()
    this.m_MinecraftVersions = json.map((version) => {
      return new MinecraftVersion(Version.fromString(version[0]) ?? Version.zero, version[1], parseInt(version[2]));
    });
    fs.writeFileSync(this.m_CacheVersionsConfigPath, JSON.stringify(this.m_MinecraftVersions));
  }

  private checkAndCreateJSONFile(): void {
    if (!fs.existsSync(this.m_CacheVersionsConfigPath)) {
      fs.writeFileSync(this.m_CacheVersionsConfigPath, JSON.stringify(this.m_MinecraftVersions));
    }
  }

  public getCurrentlyInstalledPackageID(): string | undefined {
    const regKey = 'HKCU\\SOFTWARE\\Classes\\Local Settings\\Software\\Microsoft\\Windows\\CurrentVersion\\AppModel\\Repository\\Packages';
    const listed = regedit.listSync(regKey);
    if (!listed[regKey].exists) return undefined;
    const values = listed[regKey];
    const mcpeKey = values.keys.find(key => key.startsWith('Microsoft.MinecraftUWP_'));
    if (!mcpeKey) return undefined;
    const mcpeKeyValues = regedit.listSync(`${regKey}\\${mcpeKey}`)[`${regKey}\\${mcpeKey}`];
    if (!mcpeKeyValues.exists) return undefined;
    const packageId = mcpeKeyValues.values['PackageID'].value as string;
    return packageId;
  }

  public getCurrentlyInstalledVersion(): Version | undefined {
    const regKey = 'HKCU\\SOFTWARE\\Classes\\Local Settings\\Software\\Microsoft\\Windows\\CurrentVersion\\AppModel\\Repository\\Packages';
    const listed = regedit.listSync(regKey);
    if (!listed[regKey].exists) return undefined;
    const values = listed[regKey];
    const mcpeKey = values.keys.find(key => key.startsWith('Microsoft.MinecraftUWP_'));
    if (!mcpeKey) return undefined;
    const mcpeKeyValues = regedit.listSync(`${regKey}\\${mcpeKey}`)[`${regKey}\\${mcpeKey}`];
    if (!mcpeKeyValues.exists) return undefined;
    const packageId = mcpeKeyValues.values['PackageID'].value as string;
    const packageRootFolder = mcpeKeyValues.values['PackageRootFolder'].value as string;
    if (!packageRootFolder.includes('\\Saturn\\HeavenlyLauncher\\versions\\'))
      return undefined;
    const versionString = VersionUtils.getVersionFromBaseFolder(path.basename(packageRootFolder));
    const version = Version.fromString(versionString)!;
    return version;
  }

  public async registerVersion(version: Version): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      this.m_isRegistering = true;
      const currentVersion = this.getCurrentlyInstalledVersion();
      if (this.isVersionRegistered(version) || !this.isVersionDownloaded(version))
        reject('Version is already installed or not downloaded yet.');
      if (currentVersion !== undefined)
        reject(`Version ${currentVersion.toString()} installed, unregister to install other!`)
      const cmdLine = `powershell -ExecutionPolicy Bypass -Command "& { Add-AppxPackage -Path "${this.getVersionFolder(version)}/AppxManifest.xml" -Register }"`;
      const timeout = setTimeout(() => {
        reject('registerVersion request timed out!');
        this.m_isRegistering = false;
      }, 7500);
      child.spawn(cmdLine, { shell: true }).on('close', (code) => {
        resolve(code === 0);
        clearTimeout(timeout);
        this.m_isRegistering = false;
      });
    });
  }

  public async unregisterVersion(): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      this.m_isUnregistering = true;
      const currentVersion = this.getCurrentlyInstalledVersion();
      const packageId = this.getCurrentlyInstalledPackageID();
      if (currentVersion === undefined || packageId === undefined)
        reject('There is no version currently installed to unregister!');

      const cmdLine = `powershell -ExecutionPolicy Bypass -Command "& { Remove-AppxPackage -Package "${packageId}" }"`;
      const timeout = setTimeout(() => {
        reject('unregisterVersion request timed out!');
        this.m_isUnregistering = false;
      }, 7500);
      child.spawn(cmdLine, { shell: true }).on('close', (code) => {
        resolve(code === 0);
        clearTimeout(timeout);
        this.m_isUnregistering = false;
      });
    });
  }

  public async tryUnregisterVersion(): Promise<boolean> {
    try {
      await this.unregisterVersion();
      return true;
    }
    catch (err) {
      return false;
    }
  }

  public async launchVersion(version: Version): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.m_isLaunching = true;
      const installedVersion = this.getCurrentlyInstalledVersion();
      if (!installedVersion) reject('There is no version installed to launch!');
      if (Version.compareVersions(version, installedVersion!) !== VersionComparisonResult.Equal) reject('Installed version is different from the version that the launcher is trying to launch!');
      const timeout = setTimeout(() => {
        reject('launchVersion request timed out!');
        this.m_isLaunching = false;
      }, 7500);
      child.spawn('start minecraft://', { shell: true }).on('close', (code) => {
        resolve(code === 0);
        clearTimeout(timeout);
        this.m_isLaunching = false;
      });
    });
  }

  public isVersionRegistered(version: Version): boolean {
    const installedVersion: Version | undefined = this.getCurrentlyInstalledVersion();
    if (!installedVersion) return false;
    return Version.compareVersions(version, installedVersion) === VersionComparisonResult.Equal;
  }

  public isVersionDownloaded(version: Version): boolean {
    return (fs.existsSync(Path.Combine(this.getVersionFolder(version)!, `AppxManifest.xml`)));
  }

  public getMinecraftVersions(): MinecraftVersion[] {
    return this.m_MinecraftVersions;
  }

  public getVersionsFolder(): string {
    return Path.Combine(Path.APP_DATA, `Saturn/HeavenlyLauncher/versions`);
  }

  public getVersionFolder(version: Version): string | undefined {
    return Path.Combine(Path.APP_DATA, `Saturn/HeavenlyLauncher/versions/Minecraft-${version.toString()}`);
  }

  public findMinecraftVersionByUuid(uuid: string): MinecraftVersion | undefined {
    return this.m_MinecraftVersions.find((mcVersion) => {
      return mcVersion.uuid === uuid;
    });
  }

  public findMinecraftVersionByVersion(version: Version): MinecraftVersion | undefined {
    return this.m_MinecraftVersions.find((mcVersion) => {
      return Version.compareVersions(mcVersion.version, version) === VersionComparisonResult.Equal;
    });
  }

  public async downloadVersion(version: MinecraftVersion, cancellationToken: CancellationToken): Promise<VersionDownloadInformation> {
    return new Promise<VersionDownloadInformation>(async (resolve, reject) => {

    });
  }

  public async extractVersion(version: MinecraftVersion, cancellationToken: CancellationToken): Promise<VersionExtractInformation> {
    return new Promise<VersionExtractInformation>(async (resolve, reject) => {
      
    });
  }

  public isDownloading(): boolean {
    return this.m_isDownloading;
  }

  public isExtracting(): boolean {
    return this.m_isExtracting;
  }

  public isRegistering(): boolean {
    return this.m_isRegistering;
  }

  public isUnregistering(): boolean {
    return this.m_isUnregistering;
  }

  public isLaunching(): boolean {
    return this.m_isLaunching;
  }

  public isBusy(): boolean {
    return this.isDownloading() || this.isExtracting() || this.isRegistering() || this.isUnregistering() || this.isLaunching();
  }

  public static Instance: VersionManager;
  public static getInstance(): VersionManager {
    return VersionManager.Instance;
  }
}