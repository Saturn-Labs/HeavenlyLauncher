import React, { JSX, forwardRef, useState, useImperativeHandle } from 'react'
import './WindowHeader.css'
import WindowHeaderButtons from '@components/WindowHeaderButtons/WindowHeaderButtons';

interface Props {
  enableWindowButtons?: boolean;
  enableWindowDrag?: boolean;
}

export interface WindowHeaderExposition {
  setWindowTitle: (value: string) => void;
}

const WindowHeader = forwardRef<WindowHeaderExposition>(({
  enableWindowButtons = true,
  enableWindowDrag = true
}: Props, ref) => {
  const [windowTitle, setWindowTitle] = useState<string>('Heavenly Launcher');

  useImperativeHandle(ref, () => ({
    setWindowTitle: setWindowTitle
  }));

  let headerStyleVars: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: '8px',
    paddingRight: '8px',
  };

  return (
    <div className="header" style={headerStyleVars}>
      <div className="window-title">{windowTitle}</div>
      {enableWindowDrag ? <div style={
        new Object(
          {
            width: enableWindowButtons ? 'calc(100% - (var(--window-title-custom-buttons-total-width)))' : '100%',
            height: 'var(--header-height)',
            WebkitAppRegion: 'drag',
            position: 'absolute',
            top: '0px',
            left: '0px'
          }
        )
      } /> : null}
      {enableWindowButtons ? <WindowHeaderButtons /> : null}
    </div>
  );
});

export default WindowHeader;