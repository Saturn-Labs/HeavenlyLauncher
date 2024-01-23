import { Path } from '@renderer/utils/Path';
import Version from '../Version';
import { Profile } from './Profile'
const fs = window.native.fs;

export type OnRemoveProfile = (profile: Profile) => void;

export class ProfileManager {
  private m_Profiles: Profile[] = [];
  private m_ProfilesPath: string;
  private m_OnRemoveProfileEvents: OnRemoveProfile[] = [];

  public constructor(jsonPath: string) {
    this.m_ProfilesPath = jsonPath;
    this.loadProfiles();
  }

  private checkAndCreateJSONFile(): void {
    if (!fs.existsSync(this.m_ProfilesPath)) {
      fs.writeFileSync(this.m_ProfilesPath, JSON.stringify(this.m_Profiles));
    }
  }

  private loadProfiles(): void {
    this.checkAndCreateJSONFile();
    this.m_Profiles = JSON.parse(fs.readFileSync(this.m_ProfilesPath, { encoding: 'utf-8' }));
  }

  public saveProfiles(): void {
    this.checkAndCreateJSONFile();
    fs.writeFileSync(this.m_ProfilesPath, JSON.stringify(this.m_Profiles));
  }

  public addProfile(profile: Profile): ProfileManager {
    if (this.findProfile(profile) !== undefined) {
      throw new Error(`Error on ProfileManager, profile "${profile.uuid}" already exists!`);
    }
    this.m_Profiles.push(profile);
    this.saveProfiles();
    return this;
  }

  public removeProfileByUuid(uuid: string): ProfileManager {
    const profile = this.findProfileByUuid(uuid);
    if (profile) {
      this.removeProfile(profile);
    }
    return this;
  }

  public removeProfile(profile: Profile): ProfileManager {
    const foundProfile = this.findProfile(profile);
    if (foundProfile === undefined) {
      throw new Error(`Error on Profile Manager, profile "${profile.uuid}" doesn't exist!`);
    }
    const index = this.m_Profiles.findIndex(value => Profile.compare(value, foundProfile));
    if (index !== -1) {
      this.m_Profiles.splice(index, 1);
    }
    this.saveProfiles();
    for (let callback of this.m_OnRemoveProfileEvents) {
      callback(profile);
    }
    return this;
  }

  public findProfileByUuid(uuid: string): Profile | undefined {
    return this.m_Profiles.find((value) => {
      return value.uuid === uuid;
    });
  }

  public findProfile(profile: Profile): Profile | undefined {
    return this.m_Profiles.find((value) => {
      return value.uuid === profile.uuid;
    });
  }

  public getProfiles(): Profile[] {
    return this.m_Profiles;
  }

  public addOnRemoveProfileEvent(callback: OnRemoveProfile): ProfileManager {
    this.m_OnRemoveProfileEvents.push(callback);
    return this;
  }

  public removeOnRemoveProfileEvent(callback: OnRemoveProfile): ProfileManager {
    const index = this.m_OnRemoveProfileEvents.indexOf(callback);
    if (index !== -1) {
      this.m_OnRemoveProfileEvents.splice(index, 1);
    }
    return this;
  }

  public static Instance: ProfileManager | undefined = undefined;
  public static getInstance(): ProfileManager | undefined {
    return ProfileManager.Instance;
  }
}