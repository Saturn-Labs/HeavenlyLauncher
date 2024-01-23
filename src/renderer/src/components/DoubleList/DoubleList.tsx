import { useState } from 'react';
import './DoubleList.css'

export interface ListBoxItem {
  text: string;
  data: any[];
}

interface ListBoxProperties {
  title: string;
  items: ListBoxItem[];
  onPush: (item: ListBoxItem) => void;
  onPop: (item: ListBoxItem) => void;
}

interface DoubleListProperties {
  left: ListBoxProperties;
  right: ListBoxProperties;
}

interface Properties {
  listProperties?: DoubleListProperties;
  size?: Size;
}

export default function DoubleList({
  listProperties = {
    left: {
      title: 'Enabled',
      items: [],
      onPush: () => { },
      onPop: () => { }
    },
    right: {
      title: 'Disabled',
      items: [],
      onPush: () => { },
      onPop: () => { }
    }
  },
  size = {
    width: '40px',
    height: '30px'
  }
}: Properties
): JSX.Element {
  const [leftListItems, setLeftListItems] = useState<ListBoxItem[]>(listProperties.left.items);
  const [rightListItems, setRightListItems] = useState<ListBoxItem[]>(listProperties.right.items);

  const leftToRight = (item: ListBoxItem) => {
    setLeftListItems(leftListItems.filter((i, index) => i !== item));
    listProperties.left.onPop(item);
    setRightListItems([...rightListItems, item]);
    listProperties.right.onPush(item);
  };

  const rightToLeft = (item: ListBoxItem) => {
    setRightListItems(rightListItems.filter((i, index) => i !== item));
    listProperties.right.onPop(item);
    setLeftListItems([...leftListItems, item]);
    listProperties.left.onPush(item);
  };

  const leftElements = leftListItems.map((value, i) => {
    return (
      <div className='double-list-container-item' onClick={() => leftToRight(value)} key={i}>
        {value.text}
      </div>
    );
  });

  const rightElements = rightListItems.map((value, i) => {
    return (
      <div className='double-list-container-item' onClick={() => rightToLeft(value)} key={i}>
        {value.text}
      </div>
    );
  });

  return (
    <div className='double-list-box'>
      <div style={{ width: '40%', height: '150px', display: 'flex', justifyContent: 'left', alignItems: 'center', flexDirection: 'column', gap: '10px' }}>
        <div className='double-list-title'>
          {listProperties.left.title}
        </div>
        <div className='double-list-container'>
          {leftElements}
        </div>
      </div>
      <div style={{ width: '40%', height: '150px', display: 'flex', justifyContent: 'left', alignItems: 'center', flexDirection: 'column', gap: '10px' }}>
        <div className='double-list-title'>
          {listProperties.right.title}
        </div>
        <div className='double-list-container'>
          {rightElements}
        </div>
      </div>
    </div>
  );
}