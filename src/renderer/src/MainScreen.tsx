import { JSX, useState, useRef, useEffect } from 'react'
import SideBar from '@renderer/components/SideBar/SideBar';
import LauncherPage from './pages/LauncherPage/LauncherPage';
import ProfilesPage from './pages/ProfilesPage/ProfilesPage';
import SettingsPage from './pages/SettingsPage/SettingsPage';
import ProfileEditorPage from './pages/ProfileEditorPage/ProfileEditorPage';
import MainProgressBar, { MainProgressBarExposition } from './components/MainProgressBar/MainProgressBar';
import { MainProgressBarController } from './controllers/MainProgressBarController';
import { WindowHeaderController } from './controllers/WindowHeaderController';
import { PageController } from './pages/PageController';
import './ModalBG.css'
import modalControllerProxy, { ModalController } from './controllers/ModalController';
import { VersionManager } from './internal/Version/VersionManager';
import { ProfileManager } from './internal/Profile/ProfileManager';

export function MainScreen(): JSX.Element {
  const [selectedPageIdentifier, setSelectedPageIdentifier] = useState<string | undefined>('LauncherPage');
  const [isShowingModal, setIsShowingModal] = useState(false);
  const [modalToShow, setModalToShow] = useState<JSX.Element | null>(null);

  useEffect(() => {
    modalControllerProxy.showModal = (modalProps) => {
      setModalToShow(modalProps.modalElement);
      setIsShowingModal(true);
    };

    modalControllerProxy.hideModal = () => {
      setIsShowingModal(false);
      setModalToShow(null);
    };
  }, []);

  const ChangePage = (name, args) => {
    PageController.CurrentPageArguments = args;
    PageController.CurrentPageIdentifier = name;
    PageController.LastPage = selectedPageIdentifier;
    VersionManager.getInstance()?.saveAll();
    ProfileManager.getInstance()?.saveProfiles();
    setSelectedPageIdentifier(name);
  };

  const screens = {
    LauncherPage: <LauncherPage changePage={ChangePage} pageArgs={[...PageController.CurrentPageArguments]} key={0} />,
    ProfilesPage: <ProfilesPage changePage={ChangePage} pageArgs={[...PageController.CurrentPageArguments]} key={1} />,
    SettingsPage: <SettingsPage changePage={ChangePage} pageArgs={[...PageController.CurrentPageArguments]} key={2} />,
    ProfileEditorPage: <ProfileEditorPage changePage={ChangePage} pageArgs={[...PageController.CurrentPageArguments]} key={3} />
  };

  const mainProgressBarRef = useRef<MainProgressBarExposition>(null);
  useEffect(() => {
    if (mainProgressBarRef.current)
      MainProgressBarController.exposition = mainProgressBarRef.current;
  }, []);

  return (
    <div>
      <div style={
        {
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'left',
          alignItems: 'center'
        }
      }>
        <div style={
          {
            width: '100%',
            height: 'calc(100vh - var(--window-top-main-header-height))',
            display: 'flex',
            alignItems: 'top',
            justifyContent: 'left',
            flexDirection: 'column'
          }
        }>
          <div style={{ width: '100%', height: '100%', backgroundColor: 'gray', display: 'flex', flexDirection: 'column' }}>
            {isShowingModal ? <div className='modal-bg'>
              {modalToShow}
            </div> : null}
            {selectedPageIdentifier === undefined ? null : screens[selectedPageIdentifier]}
            <MainProgressBar ref={mainProgressBarRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
