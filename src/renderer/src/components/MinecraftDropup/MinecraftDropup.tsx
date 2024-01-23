import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import MinecraftButton from '../MinecraftButton/MinecraftButton';
import ScrollContainer from '../VerticalScrollContainer/VerticalScrollContainer';
import './MinecraftDropup.css'

interface Props {
  dropupItems?: DropupItem[] | null;
  size?: Size;
  onChange?: (index: number, item: DropupItem | null) => void;
  onChangeSpecial?: (index: number, item: DropupItem | null) => void;
}

export interface DropupItem {
  special: boolean;
  itemText: string;
  itemDescription: string;
  data: any[];
}

export default function MinecraftDropup({
  dropupItems = null,
  size = { width: '50%', height: '100%' },
  onChange = () => {},
  onChangeSpecial = () => {}
}: Props
): JSX.Element {
  const [dropupSelectedItemIndex, setDropupSelectedItemIndex] = useState<number | undefined>(undefined);
  
  useEffect(() => {
    if (dropupSelectedItemIndex != 0 && (dropupItems?.length ?? 0) <= 0) {
      setDropupSelectedItemIndex(undefined);
      onChange(-1, null);
    }
  }, [dropupItems]);

  let dropupElements: JSX.Element[] = [];
  for (let i = 0; i < (dropupItems == undefined ? 0 : dropupItems?.length); i++) {
    dropupElements.push(
      <div className='dropup-content-item' onClick={() => {
        if (dropupItems![i].special) {
          onChangeSpecial(i, dropupItems![i]);
          return;
        }
        setDropupSelectedItemIndex(i);
        onChange(i, dropupItems == null ? null : dropupItems[i]);
      }} key={i}>
        <div className='dropup-item-text'>
          {dropupItems == null ? 'None' : dropupItems[i].itemText}
        </div>
        <div className='dropup-item-description'>
          {dropupItems == null ? 'None' : dropupItems[i].itemDescription}
        </div>
      </div>
    );
  }

  let selectedText: string = (dropupItems == null || dropupItems.length <= 0  ? 'None' : dropupSelectedItemIndex === undefined ? 'None' : dropupItems[dropupSelectedItemIndex ?? 0].special ? 'None' : dropupItems[dropupSelectedItemIndex ?? 0].itemText);
  let selectedDescription: string = (dropupItems == null || dropupItems.length <= 0  ? '' : dropupSelectedItemIndex === undefined ? 'None' : dropupItems[dropupSelectedItemIndex ?? 0].special ? 'None' : dropupItems[dropupSelectedItemIndex ?? 0].itemDescription);
  return (
    <div className='dropup-box' style={size}>
      <div className='dropup-content' style={{ top: -(195) + 'px' }}>
        {dropupElements}
      </div>
      <div className='dropup-main-container'>
        <div className='dropup-text'>
          {selectedText}
        </div>
        <div className='dropup-description'>
          {selectedDescription}
        </div>
        <div className='dropup-icon' />
      </div>
    </div>
  );
}