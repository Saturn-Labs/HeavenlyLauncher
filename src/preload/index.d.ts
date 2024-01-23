import { ElectronAPI } from '@electron-toolkit/preload'
import { App, BrowserWindow } from 'electron'
import { PlatformPath } from 'path';
import { CSSProperties } from 'react';
import * as fs from 'fs'
import { promisify } from 'util';
import { get } from 'http';
import { pipeline } from 'stream';
import { deleteFile, downloadFile, extractFile, launchMinecraft, reregisterAppxPackage, shellExecute } from './index'

declare global {
  interface Native {
    ipcRenderer: Electron.IpcRenderer;
    path: PlatformPath;
    fs: typeof fs;
    appData: string;
    randomUuid: () => string;
    createWriteStream: typeof fs.createWriteStream;
    promisify: typeof promisify;
    get: typeof get;
    pipeline: typeof pipeline;
  }

  export interface Style extends CSSProperties {
    [key: string]: string | number;
  }
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: unknown
    native: Native
    require: typeof require;
  }
}
