import './ProfilesPage.css'
import './ProfilesList.css'
import React, { JSX, useEffect, useState } from 'react';
import { PageArguments } from '../PageController';
import DivisionSection from '@renderer/components/DivisionSection/DivisionSection';
import { PageController } from '@renderer/pages/PageController';
import MinecraftButton from '@renderer/components/MinecraftButton/MinecraftButton';
import { VersionManager } from '@renderer/internal/Version/VersionManager';
import { VersionType } from '@renderer/internal/Version/MinecraftVersion';
import { ProfileManager } from '@renderer/internal/Profile/ProfileManager';
import Version from '@renderer/internal/Version';
import { WindowHeaderController } from '@renderer/controllers/WindowHeaderController';
import { ModalController } from '@renderer/controllers/ModalController';
import RemoveProfileModal from '@renderer/modals/RemoveProfileModal';

interface Properties {
  changePage: (pageName: string, args: any[]) => void;
}

function ProfilesList({
  changePage
}: Properties
): JSX.Element {
  const versionManager = VersionManager.getInstance()!;
  const profileManager = ProfileManager.getInstance()!;
  const jsxElements = [...profileManager.getProfiles().flatMap((profile, index) => {
    console.log(profile)
    return (
      <div className='profileslist-item' key={index}>
        <div>
          <div className='profileslist-item-text'>{profile.name}</div>
          <div className='profileslist-item-description'>Version {profile.version}</div>
        </div>
        <div className='profileslist-item-buttons'>
          <div className='profileslist-item-edit-button' onClick={() => {
            changePage('ProfileEditorPage', [false, profile]);
          }}>
            &#x270E;
          </div>
          <div className='profileslist-item-remove-button' onClick={() => {
            ModalController.showModal({
              modalElement: <RemoveProfileModal profile={profile} 
                onAccept={(p) => {
                  ModalController.hideModal();
                  profileManager.removeProfile(p);
                }}
                onReject={(p) => {
                  ModalController.hideModal();
                }}
              />
            });
          }}>
            &#x2715;
          </div>
        </div>
      </div>
    );
  }), 
    (
      <div className='profileslist-item' onClick={() => {
        changePage('ProfileEditorPage', [true, '']);
      }}>
        <div>
          <div className='profileslist-item-text'>Create Profile</div>
          <div className='profileslist-item-description'>Adds a new profile.</div>
        </div>
      </div>
    )
  ];

  console.log(jsxElements);

  return (
    <div className='profileslist-base'>
      <div className='profileslist-content'>
        {jsxElements}
      </div>
    </div>
  );
}

export default function ProfilesPage({
  changePage,
  pageArgs
}: PageArguments
): JSX.Element {
  useEffect(() => {
    WindowHeaderController.exposition?.setWindowTitle('Profiles');
  }, []);

  return (
    <div className='base'>
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
              margin: '5px',
              position: 'absolute'
            }
          }
        }
      } onClick={() => {
        changePage('LauncherPage', []);
      }} />
      <DivisionSection style={
        {
          height: '100%',
          display: 'flex',
          alignItems: 'end',
          justifyContent: 'center'
        }
      }>
        <ProfilesList changePage={changePage}/>
      </DivisionSection>
    </div>
  );
}