import React, { JSX, useState, useEffect, useRef } from 'react';
import './MinecraftProgressBar.css'

interface Properties {
  sliderProgress?: number;
  sliderText?: string;
  size?: Size;
}

export default function MinecraftProgressBar({
  sliderProgress = 0.0,
  sliderText = '',
  size = {
    width: '30%',
    height: '15px'
  }
}: Properties
): JSX.Element {
  return (
    <div className='progress-object'>
      <div className='progress-bar-text'>
        {sliderText}
      </div>
      <div className='progress-bar-container' style={{ width: size.width, height: size.height }}>
        <div className='progress-bar-slider' style={{ width: 'calc(100% * ' + sliderProgress + ')' }}>

        </div>
      </div>
    </div>
  );
}