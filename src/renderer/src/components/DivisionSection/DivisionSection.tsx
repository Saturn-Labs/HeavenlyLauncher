import { JSX } from 'react';
import './DivisionSection.css'

interface Props {
  children?: (JSX.Element | null) | (JSX.Element | null)[] | null;
  style?: Style
}

export default function DivisionSection({
  children = null,
  style = {}
}: Props
): JSX.Element {
  let defaultStyle: Style = {};
  Object.assign(defaultStyle, style);

  return (
    <div className='division-section' style={defaultStyle}>
      {children}
    </div>
  );
}