import { Path } from "@renderer/utils/Path";
import { ProfileManager } from "../Profile/ProfileManager";
import { VersionManager } from "../Version/VersionManager";
import ModManager from "../Mod/ModManager";
const fs = window.native.fs;

const additionalDirs = ['mods', 'versions', 'lib'];

export function initializeManagers() {
  const baseFolder = Path.Combine(Path.APP_DATA, 'Saturn/HeavenlyLauncher');
  if (!fs.existsSync(baseFolder)) {
    fs.mkdirSync(baseFolder, { recursive: true });
  }

  for (let dir of additionalDirs) {
    const folder = Path.Combine(baseFolder, dir);
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
  }

  ModManager.Instance = new ModManager(baseFolder);
  ProfileManager.Instance = new ProfileManager(Path.Combine(baseFolder, 'profiles.json'));
  VersionManager.Instance = new VersionManager(baseFolder);
}

export function saveAll(): void {
  ProfileManager.getInstance()!.saveProfiles();
}