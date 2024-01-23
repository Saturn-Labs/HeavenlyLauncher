import React, { JSX, useEffect, useState } from 'react';
import './MinecraftTextInput.css';

interface TextInputProperties {
  default: string;
  placeholder: string;
  onChangeText: (text: string) => void;
}

interface Properties {
  textInputProperties?: TextInputProperties;
  size?: Size;
}

export default function MinecraftTextInput({
  size = { width: '80%', height: '20px' },
  textInputProperties = {
    default: 'Text',
    placeholder: 'Text here...',
    onChangeText: (s) => {}
  }
}: Properties
): JSX.Element {
  const [inputValue, setInputValue] = useState(textInputProperties.default);
  useEffect(() => {
    textInputProperties.onChangeText(inputValue);
  }, [inputValue]);
  return (
    <input type='text' value={inputValue} onChange={(event) => { setInputValue(event.target.value) }} placeholder={textInputProperties.placeholder} className='input-style' style={{ width: size.width, height: size.height }} />
  );
}