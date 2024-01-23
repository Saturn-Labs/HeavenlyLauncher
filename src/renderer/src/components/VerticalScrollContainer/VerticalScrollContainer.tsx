import React, { JSX, CSSProperties, useState, useEffect, useRef, MouseEvent, MouseEventHandler } from 'react'
import { Mathf } from '@utils/Utils';
import { Animation } from '@utils/Animation';
import './VerticalScrollContainer.css'

interface Props {
  children?: JSX.Element | JSX.Element[] | null,
  scrollStyle?: Style,
  containerHeight?: number;
}

export default function ScrollContainer({
  children = null,
  scrollStyle = {},
  containerHeight = 350
}: Props
): JSX.Element {
  const containerItems = useRef<HTMLDivElement>(null);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 });
  const [mouseDelta, setMouseDelta] = useState({ x: 0, y: 0 });
  const [isScrollbarPressed, setIsScrollbarPressed] = useState(false);
  const [scrollbarPosition, setScrollbarPosition] = useState(0.0);
  const [containerItemsTotalHeight, setContainerItemsTotalHeight] = useState(0.0);
  const [containerItemsPosition, setContainerItemsPosition] = useState(0.0);
  const [overflowPercent, setOverflowPercent] = useState(0.0);
  const [cursorIsOnContents, setCursorIsOnContents] = useState(false);
  const [cursorIsOnScrollbar, setCursorIsOnScrollbar] = useState(false);

  const mouseScroll = (e) => {
    if (cursorIsOnContents || cursorIsOnScrollbar) {
      setScrollbarPosition(Mathf.clamp(scrollbarPosition + e.deltaY / 5, 0.0, 150.0));
    }
  };

  const mouseMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const mouseUp = () => {
    setIsScrollbarPressed(false);
    document.removeEventListener('mouseup', mouseUp);
  };

  const mouseDown = () => {
    setIsScrollbarPressed(true);
    document.addEventListener('mouseup', mouseUp);
  };

  // Use effect to capture mouse position on all screen
  useEffect(() => {
    document.addEventListener('mousemove', mouseMove);
    return () => {
      document.removeEventListener('mousemove', mouseMove);
    };
  }, []);

  // Use effect to update delta when mouse position change
  useEffect(() => {
    setMouseDelta({ x: mousePosition.x - lastMousePosition.x, y: mousePosition.y - lastMousePosition.y });
    setLastMousePosition({ x: mousePosition.x, y: mousePosition.y });
    if (isScrollbarPressed) {
      setScrollbarPosition(Mathf.clamp(scrollbarPosition + mouseDelta.y, 0.0, 150.0));
    }
  }, [mousePosition]);

  useEffect(() => {
    if (containerItems.current) {
      setContainerItemsTotalHeight(containerItems.current?.clientHeight);
    }
  }, [containerItems, containerItems.current, containerItems.current?.clientHeight, children]);

  useEffect(() => {
    setOverflowPercent(Mathf.clamp(containerHeight / containerItemsTotalHeight, 0.15, 1));
  }, [containerItemsTotalHeight]);

  useEffect(() => {
    setContainerItemsPosition((containerItemsTotalHeight * (scrollbarPosition / 150)) - (containerHeight * (scrollbarPosition / 150)));
  }, [scrollbarPosition, containerItemsTotalHeight, containerHeight]);

  let stylesToSet: Style = {
    '--vertical-scroll-container-height': containerHeight + 'px',
    '--vertical-scrollbar-thumb-position': overflowPercent >= 1.0 ? 0.0 : scrollbarPosition / 150,
    '--vertical-scrollbar-thumb-percent': overflowPercent >= 1.0 ? 0.978 : overflowPercent,
    '--vertical-scroll-contents-height': containerItemsTotalHeight,
    '--vertical-scroll-contents-position': overflowPercent >= 1.0 ? 0.0 : (-containerItemsPosition + 'px')
  };
  Object.assign(stylesToSet, scrollStyle);

  return (
    <div className='vertical-scroll-container' style={stylesToSet}>
      <div className='container-items' ref={containerItems}
        onMouseEnter={() => setCursorIsOnContents(true)}
        onMouseLeave={() => setCursorIsOnContents(false)}
        onWheel={mouseScroll}>
        {children}
      </div>
      {
        overflowPercent < 1.0 ? 
        <div className='vertical-scrollbar-container'
          onMouseEnter={() => setCursorIsOnScrollbar(true)}
          onMouseLeave={() => setCursorIsOnScrollbar(false)}
          onWheel={mouseScroll}>
          <div className='vertical-scrollbar-trail'>
            <div className='vertical-scrollbar-thumb-container'
              onMouseDown={mouseDown}>
              <div className='vertical-scrollbar-thumb'>
              </div>
            </div>
          </div>
        </div> : null
      }
    </div>
  );
}