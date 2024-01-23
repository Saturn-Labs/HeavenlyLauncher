import { JSX } from 'react'
import { ColorUtils, Window } from '@utils/Utils';
import MinecraftButton, { } from '@components/MinecraftButton/MinecraftButton';

export default function WindowHeaderButtons(): JSX.Element {
  let buttonsWidth = '35px';
  let buttonsHeight = '35px';
  
  return (
    <div style={
      {
        width: 'auto',
        height: 'auto',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
      }
    }>
      <MinecraftButton
        buttonOptions={
          {
            textProperties: {
              text: '\u{1F5D5}',
              fontSize: '18px',
              fontFamily: 'Minecraft-Seven'
            },
            color: ColorUtils.white,
            size: { 
              width: buttonsWidth,
              height: buttonsHeight 
            },
            css: {
              top: {
                paddingBottom: '3px'
              }
            }
          }
        }
        onClick={() => Window.minimize()}/>
      <MinecraftButton
        buttonOptions={
          {
            textProperties: {
              text: '\u{1F5D6}',
              fontSize: '18px',
              fontFamily: 'Minecraft-Seven'
            },
            color: ColorUtils.white,
            size: { 
              width: buttonsWidth,
              height: buttonsHeight 
            },
            css: {
              top: {
                paddingBottom: '3px'
              }
            }
          }
        }
        onClick={() => Window.maximizeOrRestore()}/>
      <MinecraftButton
        buttonOptions={
          {
            textProperties: {
              text: '\u{2715}',
              fontSize: '18px',
              fontFamily: 'Minecraft-Seven'
            },
            color: ColorUtils.red,
            size: { 
              width: buttonsWidth,
              height: buttonsHeight 
            }
          }
        }
        onClick={() => Window.close()}/>
    </div>
  );
}