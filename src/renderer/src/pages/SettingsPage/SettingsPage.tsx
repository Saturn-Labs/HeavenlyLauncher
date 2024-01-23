import { WindowHeaderController } from "@renderer/controllers/WindowHeaderController";
import { PageArguments, PageController } from "../PageController";
import { useEffect } from "react";
import MinecraftButton from "@renderer/components/MinecraftButton/MinecraftButton";
import RemoveProfileModal from "@renderer/modals/RemoveProfileModal";
import { ProfileManager } from "@renderer/internal/Profile/ProfileManager";

export default function SettingsPage({
  changePage,
  pageArgs
}: PageArguments
): JSX.Element {
  useEffect(() => {
    WindowHeaderController.exposition.setWindowTitle('Settings');
  }, []);

  return (
    <div style={
      {
        width: '100%', height: '100%',
        display: 'flex',
        justifyContent: 'left'
      }
    }>
      <MinecraftButton buttonOptions={
        {
          textProperties: {
            text: '<',
            fontSize: '24px'
          },
          color: {
            r: 255,
            g: 0,
            b: 0,
            a: 1
          },
          size: {
            width: '40px',
            height: '40px'
          },
          css: {
            container: {
              position: 'absolute',
              margin: '5px'
            },
            top: {

            }
          }
        }
      } onClick={() => {
        changePage('LauncherPage', []);
      }} />
      <div style={{width: '100%', height: '100%', display: "flex", justifyContent: 'center', alignItems: 'center'}}>
      
      </div>
    </div>
  );
}