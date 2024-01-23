import MinecraftButton from '@renderer/components/MinecraftButton/MinecraftButton';
import { PageArguments, PageController } from '../PageController';
import './ProfileEditorPage.css'
import DivisionSection from '@renderer/components/DivisionSection/DivisionSection';
import { useEffect, useState } from 'react';
import { WindowHeaderController } from '@renderer/controllers/WindowHeaderController';
import MinecraftTextInput from '@renderer/components/MinecraftTextInput/MinecraftTextInput';
import MinecraftDropdown from '@renderer/components/MinecraftDropdown/MinecraftDropdown';
import { VersionManager } from '@renderer/internal/Version/VersionManager';
import Version, { VersionComparisonResult } from '@renderer/internal/Version';
import { VersionType } from '@renderer/internal/Version/MinecraftVersion';
import { ColorUtils, Crypto } from '@renderer/utils/Utils';
import { Profile } from '@renderer/internal/Profile/Profile';
import { ProfileManager } from '@renderer/internal/Profile/ProfileManager';

export default function ProfileEditorPage({
  changePage,
  pageArgs
}: PageArguments
): JSX.Element {
  if (pageArgs.length < 2) {
    throw new Error('ProfileEditorPage expected 2 args but received ' + pageArgs.length);
  }

  const versionManager = VersionManager.getInstance()!;
  const profileManager = ProfileManager.getInstance()!;
  const isCreatingNewProfile = pageArgs[0] as boolean;
  const profileEdition = pageArgs[1] as Profile;
  const installedVersion = versionManager.getCurrentlyInstalledVersion() ?? Version.zero;
  const versions = versionManager.getMinecraftVersions();
  const releaseVersions = versions.flatMap((mcVersion) => {
    if (mcVersion.versionType !== VersionType.Release)
      return [];
    return mcVersion;
  });
  const releaseVersionsDropdown = versions.flatMap((mcVersion) => {
    if (mcVersion.versionType !== VersionType.Release)
      return [];
    return {
      itemText: mcVersion.version.toString(),
      itemDescription: !versionManager.isVersionDownloaded(mcVersion.version) ? 'Not downloaded' : Version.compareVersions(mcVersion.version, installedVersion) === VersionComparisonResult.Equal ? 'Installed' : 'Downloaded',
      data: [mcVersion.uuid],
      special: false
    };
  });
  const profile = isCreatingNewProfile ? 
    new Profile(Crypto.randomUuid(), 'Unnamed Profile', versions[0].version) : 
    JSON.parse(JSON.stringify(profileEdition)) as Profile;

  const createOrSave = () => {
    if (isCreatingNewProfile) {
      profileManager.addProfile(profile);
      changePage('ProfilesPage', []);
      return;
    }
    profileManager.removeProfileByUuid(profile.uuid);
    profileManager.addProfile(profile);
    changePage('ProfilesPage', []);
  };

  const cancel = () => {
    changePage('ProfilesPage', []);
  };

  useEffect(() => {
    WindowHeaderController.exposition?.setWindowTitle(isCreatingNewProfile ? 'Create Profile' : 'Edit Profile');
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
            }
          }
        }
      } onClick={() => {
        cancel();
      }} />
      <DivisionSection style={
        {
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'top',
          paddingTop: '50px'
        }
      }>
        <div className='profileeditorpage-profile-name-base'>
          <div style={{ gap: '10px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <div style={
              {
                userSelect: 'none',
                fontFamily: 'Minecraft-Seven',
                fontSize: '18px',
                color: '#FFF'
              }
            }>Profile Name</div>
            <MinecraftTextInput size={{
              width: '50%',
              height: '20px'
            }} textInputProperties={{
              default: profile.name,
              onChangeText: (text) => profile.name = text,
              placeholder: 'Profile name...'
            }} />
          </div>
          <div style={{ gap: '10px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <div style={
              {
                userSelect: 'none',
                fontFamily: 'Minecraft-Seven',
                fontSize: '18px',
                color: '#FFF'
              }
            }>Profile Version</div>
            <MinecraftDropdown size={{
              width: '50%',
              height: '45px'
            }}
            dropdownItems={releaseVersionsDropdown}
            defaultSelection={releaseVersions.findIndex((mcVersion) => {
              return Version.compareVersions(mcVersion.version, Version.fromString(profile.version) ?? Version.zero) === VersionComparisonResult.Equal;
            })}
            onChange={(index, item) => {
              if (item) {
                const mcVersion = versionManager.findMinecraftVersionByUuid(item.data[0] as string);
                if (mcVersion) {
                  const version = mcVersion.version;
                  profile.version = version.toString();
                }
              }
            }}/>
          </div>
          <div style={
            {
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'end',
              justifyContent: 'space-around',
              paddingBottom: '20px'
            }
          }>
            <MinecraftButton buttonOptions={
              {
                textProperties: {
                  text: isCreatingNewProfile ? 'Create Profile' : 'Save Profile'
                },
                color: ColorUtils.fromHexCode('#1FFF1FFF')
              }
            } onClick={() => {
              createOrSave();
            }}/>
          </div>
        </div>
        <div className='profileeditorpage-profile-name-base'>
          
        </div>
      </DivisionSection>
    </div>
  );
}