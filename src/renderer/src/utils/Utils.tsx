import { CSSProperties } from "react";

interface CSSPropsString {
  [key: string]: string | number
}

export type Operator = '*' | '/' | '+' | '-';
export class Mathf {
  static clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }
  static lerp(start: number, end: number, ratio: number): number {
    return start * (1 - ratio) + end * ratio;
  }
}

declare global {
  interface Size {
    width: string;
    height: string;
  }

  interface Vector2 {
    x: string;
    y: string;
  }

  interface Color {
    r: number;
    g: number;
    b: number;
    a: number;
  }

  interface TextProperties {
    text?: string;
    fontSize?: string;
    fontFamily?: string;
  }
}


export class ColorUtils {
  static getHexCode(color: Color): string {
    return "#" + (
      Math.trunc(color.r).toString(16).padStart(2, '0') + 
      Math.trunc(color.g).toString(16).padStart(2, '0') + 
      Math.trunc(color.b).toString(16).padStart(2, '0') + 
      Math.trunc((color.a * 255.0)).toString(16).padStart(2, '0')
    );
  }

  static blend(lhs: Color, rhs: Color, ratio: number = 0.5): Color {
    ratio = Mathf.clamp(ratio, 0.0, 1.0)
    return {
      r: Mathf.lerp(lhs.r, rhs.r, ratio),
      g: Mathf.lerp(lhs.g, rhs.g, ratio),
      b: Mathf.lerp(lhs.b, rhs.b, ratio),
      a: Mathf.lerp(lhs.a, rhs.a, ratio)
    };
  }

  static fromHexCode(hexCode: string): Color {
    hexCode = hexCode.replace(/^#/, '');
    if (hexCode.length !== 6 && hexCode.length !== 8) {
      throw new Error('Invalid hex code length. Must be 6 or 8 characters.');
    }
    const hexR = hexCode.substring(0, 2);
    const hexG = hexCode.substring(2, 4);
    const hexB = hexCode.substring(4, 6);
    const hexA = hexCode.length === 8 ? hexCode.substring(6, 8) : 'FF';
    const r = parseInt(hexR, 16);
    const g = parseInt(hexG, 16);
    const b = parseInt(hexB, 16);
    const a = parseInt(hexA, 16) / 255.0;
    return { r: r, g: g, b: b, a: a };
  }

  static white: Color = {
    r: 255, g: 255, b: 255, a: 1.0
  };
  static transparent: Color = {
    r: 0, g: 0, b: 0, a: 0
  };
  static red: Color = {
    r: 255, g: 0, b: 0, a: 1
  };
}

export namespace VersionUtils {
  export function getVersionFromBaseFolder(baseFolder: string): string {
    const versionRegex = /(\d+(\.\d+)*)/;
    const matchResult = baseFolder.match(versionRegex);
    return matchResult![0];
  }
}

export class Window {
  static maximizeOrRestore() {
    window.native.ipcRenderer.send('maximizeorrestore');
  }

  static minimize() {
    window.native.ipcRenderer.send('minimize');
  }

  static close() {
    close()
  }
}

interface Crypto {
  randomUuid: typeof window.native.randomUuid;
}

export const Crypto: Crypto = {
  randomUuid: window.native.randomUuid
}