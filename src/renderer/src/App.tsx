import { useState, JSX, useEffect, useRef } from 'react';
import { MainScreen } from './MainScreen';
import WindowHeader, { WindowHeaderExposition } from './components/WindowHeader/WindowHeader';
import { ProfileManager } from './internal/Profile/ProfileManager';
import { Profile } from './internal/Profile/Profile';
import { Crypto } from './utils/Utils';
import Version from './internal/Version';
import { Downloader } from './utils/Downloader';
import { Path } from './utils/Path';
import CancellationToken from './utils/CancellationToken';
import { Extractor } from './utils/Extractor';
import { VersionManager } from './internal/Version/VersionManager';
import { WindowHeaderController } from './controllers/WindowHeaderController';



export default function App(): JSX.Element {
  const windowHeaderRed = useRef<WindowHeaderExposition>(null);
  useEffect(() => {
    if (windowHeaderRed.current) {
      WindowHeaderController.exposition = windowHeaderRed.current;
    } 
  }, []);


  return (
    <div>
      <WindowHeader
        ref={windowHeaderRed}
      />
      <MainScreen/>
    </div>
  );
}