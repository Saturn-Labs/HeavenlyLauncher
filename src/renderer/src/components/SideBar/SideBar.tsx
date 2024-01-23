import React, { JSX, useState, useEffect } from 'react';
import './SideBar.css'

interface Props {
  style?: Style;
  onChangeSelected?: (selectionIndex: number) => void;
}

export default function SideBar({
  style = {},
  onChangeSelected = (n) => {}
}: Props
): JSX.Element {
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  useEffect(() => {
    onChangeSelected(selectedItemIndex);
  }, [selectedItemIndex]);
  
  return (
    
    <div className='side-bar-container' style={style}>
      <div className={selectedItemIndex === 0 ? 'side-bar-item-selected' : 'side-bar-item'} onClick={() => setSelectedItemIndex(0)}>
        <div className='side-bar-item-launcher-icon' />
      </div>
      <div className={selectedItemIndex === 1 ? 'side-bar-item-selected' : 'side-bar-item'} onClick={() => setSelectedItemIndex(1)}>
        <div className='side-bar-item-bedrock-icon' />
      </div>
      <div className={selectedItemIndex === 2 ? 'side-bar-item-selected' : 'side-bar-item'} onClick={() => setSelectedItemIndex(2)}>
        <div className='side-bar-item-settings-icon' />
      </div>
    </div>
  );
}