import { JSX } from 'react'
import './GameBackground.css'

interface Props {
  children?: JSX.Element | JSX.Element[] | null;
  backgroundStyle?: React.CSSProperties;
}

export default function GameBackground({
  children = null,
  backgroundStyle = {}
}: Props
): JSX.Element {
  return (
    <div className='window-background' style={backgroundStyle}>
      {children}
    </div>
  );
}