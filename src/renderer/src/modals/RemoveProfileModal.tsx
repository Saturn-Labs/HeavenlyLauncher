import { Profile } from '@renderer/internal/Profile/Profile';
import './RemoveProfileModal.css'
import MinecraftButton from '@renderer/components/MinecraftButton/MinecraftButton';
import { ColorUtils } from '@renderer/utils/Utils';

interface ModalProperties {
  profile: Profile;
  onAccept?: (profile: Profile) => void;
  onReject?: (profile: Profile) => void;
}

export default function RemoveProfileModal({
  profile,
  onAccept,
  onReject
}: ModalProperties
): JSX.Element {
  return (
    <div className='modal-base'>
      <div className='modal-text'>
        {`Are you sure that you want to remove the profile "${profile.name}"?`}
      </div>
      <div className='modal-buttons'>
        <MinecraftButton buttonOptions={
          {
            size: {
              width: '45%',
              height: '50px'
            },
            color: ColorUtils.fromHexCode('#00FF00FF'),
            textProperties: {
              text: 'Cancel'
            }
          }
        } onClick={() => {
          if (onReject) {
            onReject(profile);
          }
        }}/>
        <MinecraftButton buttonOptions={
          {
            size: {
              width: '45%',
              height: '50px'
            },
            color: ColorUtils.fromHexCode('#FF0000FF'),
            textProperties: {
              text: 'Proceed'
            }
          }
        } onClick={() => {
          if (onAccept) {
            onAccept(profile);
          }
        }}/>
      </div>
    </div>
  );
}