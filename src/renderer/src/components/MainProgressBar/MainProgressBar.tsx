import { ColorUtils } from '@renderer/utils/Utils';
import './MainProgressBar.css'
import React, { forwardRef, useImperativeHandle, useState } from 'react'

export interface MainProgressBarExposition {
  setIsShowingProgressBar: (b: boolean) => void;
  setProgressBarText: (s: string) => void;
  setProgressBarPercent: (p: number) => void;
  setProgressBarColor: (c: Color) => void;
};

const MainProgressBar = forwardRef<MainProgressBarExposition>(({ }, ref) => {
  const [isShowingProgressBar, setIsShowingProgressBar] = useState(false);
  const [progressBarText, setProgressBarText] = useState('');
  const [progressBarPercent, setProgressBarPercent] = useState(0.0);
  const [progressBarColor, setProgressBarColor] = useState<Color>({ r: 60, g: 177, b: 60, a: 1 })

  useImperativeHandle(ref, () => ({
    setIsShowingProgressBar: setIsShowingProgressBar,
    setProgressBarText: setProgressBarText,
    setProgressBarPercent: setProgressBarPercent,
    setProgressBarColor: setProgressBarColor
  }));

  return isShowingProgressBar ? (
    <div className='bar-container'>
      <div className='bar-slider' style={{ width: `calc(100% * ${progressBarPercent})`, backgroundColor: ColorUtils.getHexCode(progressBarColor) }}>
      </div>
      <div className='bar-text'>
        {progressBarText}
      </div>
    </div>
  ) : null;
});

export default MainProgressBar;