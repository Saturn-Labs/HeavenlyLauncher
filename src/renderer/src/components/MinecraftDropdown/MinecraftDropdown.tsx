import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import MinecraftButton from '../MinecraftButton/MinecraftButton';
import ScrollContainer from '../VerticalScrollContainer/VerticalScrollContainer';
import './MinecraftDropdown.css'

interface Props {
  dropdownItems?: DropdownItem[] | null;
  size?: Size;
  defaultSelection: number | undefined;
  onChange?: (index: number, item: DropdownItem | null) => void;
  onChangeSpecial?: (index: number, item: DropdownItem | null) => void;
}

export interface DropdownItem {
  special: boolean;
  itemText: string;
  itemDescription: string;
  data: any[];
}

export default function MinecraftDropdown({
  dropdownItems = null,
  size = { width: '50%', height: '100%' },
  defaultSelection = undefined,
  onChange = () => {},
  onChangeSpecial = () => {}
}: Props
): JSX.Element {
  const [dropdownSelectedItemIndex, setDropdownSelectedItemIndex] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (dropdownSelectedItemIndex !== 0 && (dropdownItems?.length ?? 0) <= 0) {
      setDropdownSelectedItemIndex(undefined);
      onChange(-1, null);
    }
  }, [dropdownItems]);

  useEffect(() => {
    if (dropdownSelectedItemIndex === undefined && dropdownItems !== null ? dropdownItems.length > 0 : false) {
      if (dropdownItems![0].special)
        return;
      setDropdownSelectedItemIndex(0);
      onChange(0, dropdownItems !== null ? dropdownItems[0] : null);
    }
  }, []);

  useEffect(() => {
    setDropdownSelectedItemIndex(defaultSelection);
    onChange(defaultSelection ?? 0, dropdownItems !== null && (defaultSelection ?? 0) < dropdownItems?.length ? dropdownItems[defaultSelection ?? 0] : null);
  }, [defaultSelection]);

  let dropdownElements: JSX.Element[] = [];
  for (let i = 0; i < (dropdownItems == undefined ? 0 : dropdownItems?.length); i++) {
    dropdownElements.push(
      <div className='dropdown-content-item' onClick={() => {
        if (dropdownItems![i].special) {
          onChangeSpecial(i, dropdownItems![i]);
          return;
        }
        setDropdownSelectedItemIndex(i);
        onChange(i, dropdownItems == null ? null : dropdownItems[i]);
      }} key={i}>
        <div className='dropdown-item-text'>
          {dropdownItems == null ? 'None' : dropdownItems[i].itemText}
        </div>
        <div className='dropdown-item-description'>
          {dropdownItems == null ? 'None' : dropdownItems[i].itemDescription}
        </div>
      </div>
    );
  }

  let selectedText: string = (dropdownItems === null || dropdownItems.length <= 0 ? 'None' : dropdownSelectedItemIndex === undefined ? 'None' : dropdownItems[dropdownSelectedItemIndex ?? 0]?.special ? 'None' : dropdownItems[dropdownSelectedItemIndex ?? 0]?.itemText);
  let selectedDescription: string = (dropdownItems === null || dropdownItems.length <= 0 ? '' : dropdownSelectedItemIndex === undefined ? 'None' : dropdownItems[dropdownSelectedItemIndex ?? 0]?.special ? 'None' : dropdownItems[dropdownSelectedItemIndex ?? 0]?.itemDescription);
  return (
    <div className='dropdown-box' style={size}>
      <div className='dropdown-content'>
        {dropdownElements}
      </div>
      <div className='dropdown-main-container'>
        <div className='dropdown-text'>
          {selectedText}
        </div>
        <div className='dropdown-description'>
          {selectedDescription}
        </div>
        <div className='dropdown-icon' />
      </div>
    </div>
  );
}