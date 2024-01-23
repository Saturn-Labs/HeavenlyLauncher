import './LauncherPage.css';
import GameBackground from '@components/GameBackground/GameBackground';
import React, { JSX, useState, useEffect } from 'react';
import DivisionSection from '@renderer/components/DivisionSection/DivisionSection';
import MinecraftDropdown from '@renderer/components/MinecraftDropdown/MinecraftDropdown';
import MinecraftDropup, { DropupItem } from '@renderer/components/MinecraftDropup/MinecraftDropup';
import MinecraftButton from '@renderer/components/MinecraftButton/MinecraftButton';
import MinecraftProgressBar from '@renderer/components/MinecraftProgressBar/MinecraftProgressBar';
import { download } from '@renderer/utils/MinecraftVersionDownloader';
import { Path } from '@renderer/utils/Path';
import { PageArguments } from '../PageController';
import { ProfileManager } from '@renderer/internal/Profile/ProfileManager';
import { VersionManager } from '@renderer/internal/Version/VersionManager';
import Version from '@renderer/internal/Version';
import CancellationToken from '@renderer/utils/CancellationToken';
import { MainProgressBarController } from '@renderer/controllers/MainProgressBarController';
import { WindowHeaderController } from '@renderer/controllers/WindowHeaderController';

export default function LauncherPage({
  changePage,
  pageArgs
}: PageArguments
): JSX.Element {
  const [selectedProfileUuid, setSelectedProfileUuid] = useState<string | undefined>(undefined);

  const profileManager = ProfileManager.getInstance()!;
  const versionManager = VersionManager.getInstance()!;
  const isProfileVersionDownloaded = selectedProfileUuid ? versionManager.isVersionDownloaded(Version.fromString(profileManager.findProfileByUuid(selectedProfileUuid!)!.version) ?? Version.zero) : false;
  const isProfileVersionRegistered = selectedProfileUuid ? versionManager.isVersionRegistered(Version.fromString(profileManager.findProfileByUuid(selectedProfileUuid!)!.version) ?? Version.zero) : false;
  const progressBar = MainProgressBarController.exposition;

  useEffect(() => {
    WindowHeaderController.exposition?.setWindowTitle('Heavenly Launcher');
  }, []);

  const registerMCPE = async () => {
    if (!selectedProfileUuid) return;
    const profile = profileManager.findProfileByUuid(selectedProfileUuid);
    if (profile) {
      const mcVersion = versionManager.findMinecraftVersionByVersion(Version.fromString(profile?.version) ?? Version.zero);
      if (mcVersion) {
        const curVersion = versionManager.getCurrentlyInstalledVersion();
        if (curVersion) {
          progressBar.setIsShowingProgressBar(true);
          progressBar.setProgressBarText(`Unregistering Minecraft ${curVersion.toString()} (50%)`);
          progressBar.setProgressBarPercent(0.5);
        }
        await versionManager.tryUnregisterVersion();

        progressBar.setIsShowingProgressBar(true);
        progressBar.setProgressBarText(`Registering Minecraft ${mcVersion.version.toString()} (50%)`);
        progressBar.setProgressBarPercent(0.5);
        const response = await versionManager.registerVersion(mcVersion.version);
        console.log(response ? `Version ${mcVersion.version.toString()} registered successfully!` : `Failed to register version ${mcVersion.version.toString()}!`)
        progressBar.setIsShowingProgressBar(false);
      }
    }
  };

  const EventHandlers = {
    extractComplete: async (success: boolean) => {
      if (success) {
        await registerMCPE();
      }
    },
    downloadComplete: async (success: boolean, version: Version) => {
      if (success) {
        await versionManager.extractVersion(versionManager.findMinecraftVersionByVersion(version)!, new CancellationToken());
      }
    }
  }

  useEffect(() => {
    versionManager.OnDownloadCompleteEvent.push(EventHandlers.downloadComplete);
    return () => {
      versionManager.OnDownloadCompleteEvent.slice(
        versionManager.OnDownloadCompleteEvent.findIndex((v) => v === EventHandlers.downloadComplete), 1);
    };
  }, []);

  useEffect(() => {
    versionManager.OnExtractCompleteEvent.push(EventHandlers.extractComplete);
    return () => {
      versionManager.OnExtractCompleteEvent.slice(
        versionManager.OnExtractCompleteEvent.findIndex((v) => v === EventHandlers.extractComplete), 1);
    };
  }, []);

  return (
    <div className='base'>
      <GameBackground backgroundStyle={
        {
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'right'
        }
      } >
        <MinecraftButton buttonOptions={
          {
            textProperties: {
              text: '\u{2699}',
              fontSize: '24px'
            },
            color: {
              r: 255,
              g: 100,
              b: 0,
              a: 1
            },
            size: {
              width: '40px',
              height: '40px'
            },
            css: {
              container: {
                margin: '5px'
              },
              top: {
                paddingBottom: '4px'
              }
            }
          }
        } onClick={() => {
          changePage('SettingsPage', []);
        }} />
      </GameBackground>
      <DivisionSection style={
        {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }
      }>
        <div style={
          {
            width: '100%',
            height: 'fit-content',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center'
          }
        }>
          <MinecraftDropup size={
            {
              width: '30%',
              height: '50px'
            }
          }
            dropupItems={[...profileManager.getProfiles().map((profile) => {
              return {
                itemText: profile.name,
                itemDescription: `Version ${profile.version}`,
                data: [profile.uuid],
                special: false
              };
            }), {
              itemText: 'Manage Profiles',
              itemDescription: 'Go to the Profiles page.',
              data: [0],
              special: true
            }]}
            onChange={(i, v) => {
              if (v) {
                setSelectedProfileUuid(v.data[0] as string);
              }
            }}
            onChangeSpecial={(i, v) => {
              if (v) {
                changePage('ProfilesPage', []);
              }
            }}>

          </MinecraftDropup>
          {
            <MinecraftButton buttonOptions={
              {
                color: !selectedProfileUuid ? {
                  r: 170, g: 170, b: 170, a: 1
                } : isProfileVersionDownloaded ? (
                  isProfileVersionRegistered ? {
                    r: 20,
                    g: 255,
                    b: 20,
                    a: 1
                  } : {
                    r: 120,
                    g: 255,
                    b: 10,
                    a: 1
                  }
                ) : {
                  r: 255,
                  g: 220,
                  b: 10,
                  a: 1
                },
                textProperties: {
                  text: !selectedProfileUuid ? 'No Profile Selected' : isProfileVersionDownloaded ? (isProfileVersionRegistered ? 'Launch Game' : 'Install Version') : 'Download Version'
                },
                css: {
                  container: {
                    pointerEvents: versionManager.isBusy() || !selectedProfileUuid ? 'none' : 'all',
                    width: '30%',
                    height: '107.5%',
                    position: 'relative',
                    bottom: '20px'
                  }
                }
              }
            } onClick={async () => {
              if (!selectedProfileUuid) return;

              if (!isProfileVersionDownloaded) {
                const profile = profileManager.findProfileByUuid(selectedProfileUuid);
                if (profile) {
                  const mcVersion = versionManager.findMinecraftVersionByVersion(Version.fromString(profile?.version) ?? Version.zero);
                  if (mcVersion) {
                    await versionManager.downloadVersion(mcVersion, new CancellationToken());
                  }
                }
              }
              else if (!isProfileVersionRegistered) {
                await registerMCPE();
              }
              else {
                const profile = profileManager.findProfileByUuid(selectedProfileUuid);
                if (profile) {
                  const mcVersion = versionManager.findMinecraftVersionByVersion(Version.fromString(profile?.version) ?? Version.zero);
                  if (mcVersion && isProfileVersionRegistered) {
                    const reponse = await versionManager.launchVersion(mcVersion.version);
                  }
                }
              }
            }} />
          }
          <div style={
            {
              width: '30%', height: '100%',
              fontFamily: 'Minecraft-Ten',
              fontSize: '18px',
              display: 'flex',
              color: '#FFFFFFFF',
              alignItems: 'center',
              justifyContent: 'center',
              textShadow: '2px 2px #212121FF',
              userSelect: 'none'
            }
          }>
            Launcher v1.0.0
          </div>
        </div>
      </DivisionSection>
    </div>
  );
}