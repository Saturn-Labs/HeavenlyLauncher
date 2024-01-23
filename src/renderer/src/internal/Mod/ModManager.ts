import { Path } from "@renderer/utils/Path";
import Mod from "./Mod";
const fs = window.require('fs') as typeof import('fs');

export default class ModManager {
  public m_ModsPath: string;
  public m_Mods: Mod[] = [];

  public constructor(dataPath: string) {
    this.m_ModsPath = Path.Combine(dataPath, 'mods');
    this.loadMods();
  }

  public loadMods(): void {
    const directories = fs.readdirSync(this.m_ModsPath, { encoding: 'utf-8', recursive: false })
        .filter((name) => fs.statSync(Path.Combine(this.m_ModsPath, name)).isDirectory()).map((name) => Path.Combine(this.m_ModsPath, name));

    for (let modDir of directories) {
      const modJson = Path.Combine(modDir, 'mod.json');
      if (!fs.existsSync(modJson)) {
        continue;
      }

      this.m_Mods.push(JSON.parse(fs.readFileSync(modJson, { encoding: 'utf-8' })));
    }
  }

  public static Instance: ModManager;
  public static getInstance(): ModManager {
    return ModManager.Instance;
  }
}