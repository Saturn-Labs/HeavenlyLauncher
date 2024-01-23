import React, { JSX } from 'react'
import './MinecraftButton.css';
import { ColorUtils } from '@utils/Utils';

interface ButtonCSSStyle {
  container?: Style;
  base?: Style;
  top?: Style;
}

interface ButtonStyle {
  textProperties?: TextProperties;
  color?: Color;
  size?: Size;
  css?: ButtonCSSStyle;
}

interface Props {
  children?: JSX.Element | JSX.Element[] | null;
  buttonOptions?: ButtonStyle;
  onClick?: () => void;
}

const buttonStyleColors = {
  '--button-top-background-color': ColorUtils.fromHexCode('#646464'),
  '--button-top-border-color': ColorUtils.fromHexCode('#747474'),
  '--button-top-hover-color': ColorUtils.fromHexCode('#4A4A4A'),
  '--button-shadow-color': ColorUtils.fromHexCode('#383838'),
  '--text-shadow-color': ColorUtils.fromHexCode('#494949')
};

export default function MinecraftButton({
  children = null,
  buttonOptions = {
    textProperties: {
      text: 'Button',
      fontSize: '18px',
      fontFamily: 'Minecraft-Seven'
    },
    color: {
      r: 0,
      g: 255,
      b: 0, 
      a: 1
    },
    size: {
      width: '409px',
      height: '61px'
    },
    css: {}
  },
  onClick = () => { }
}: Props
): JSX.Element {
  let variableStyles: Style = {
    '--button-top-background-color': ColorUtils.getHexCode(ColorUtils.blend(buttonStyleColors['--button-top-background-color'], buttonOptions.color ?? ColorUtils.white)),
    '--button-top-border-color': ColorUtils.getHexCode(ColorUtils.blend(buttonStyleColors['--button-top-border-color'], buttonOptions.color ?? ColorUtils.white)),
    '--button-top-hover-color': ColorUtils.getHexCode(ColorUtils.blend(buttonStyleColors['--button-top-hover-color'], buttonOptions.color ?? ColorUtils.white)),
    '--button-shadow-color': ColorUtils.getHexCode(ColorUtils.blend(buttonStyleColors['--button-shadow-color'], buttonOptions.color ?? ColorUtils.white)),
    '--text-shadow-color': ColorUtils.getHexCode(ColorUtils.blend(buttonStyleColors['--text-shadow-color'], buttonOptions.color ?? ColorUtils.white)),
    '--text-font-family': buttonOptions.textProperties?.fontFamily ?? 'Minecraft-Seven',
    '--text-font-size': buttonOptions.textProperties?.fontSize ?? '18px',
    width: buttonOptions.size?.width ?? '409px',
    height: buttonOptions.size?.height ?? '61px',
  };
  Object.assign(variableStyles, buttonOptions.css?.container);

  return (
    <div className='minecraft-button-container' style={variableStyles}>
      <div className='minecraft-button' onClick={onClick} style={buttonOptions.css?.base}>
        <div className='minecraft-button-top' style={buttonOptions.css?.top}>
          {buttonOptions.textProperties?.text ?? 'Button'}
          {Array.isArray(children) ? (
            children.map((child, index) => (
              <React.Fragment key={index}>{child as React.ReactNode}</React.Fragment>
            ))
          ) : (
            children !== null && (
              <React.Fragment>{children as React.ReactNode}</React.Fragment>
            )
          )}
        </div>
      </div>
    </div>
  );
}