import { BrowserWindow, ipcRenderer, contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import path from 'path'
import * as fs from 'fs'
import fsasync from 'fs/promises'
import { app } from 'electron'
import { randomUUID } from 'crypto'
import { promisify } from 'util'
import { get } from 'http'
import { pipeline } from 'stream'
import JSZip from 'jszip'
import { ExecException, exec, spawn } from 'child_process'

// Custom APIs for renderer
const api = {}

const native = {
  ipcRenderer: ipcRenderer,
  path: path,
  fs: fs,
  appData: process.env.APPDATA,
  randomUuid: () => randomUUID(),
  createWriteStream: fs.createWriteStream,
  promisify: promisify,
  get: get,
  pipeline: pipeline
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('native', native)
    contextBridge.exposeInMainWorld('require', require);
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
  // @ts-ignore (define in dts)
  window.native = native;
  // @ts-ignore (define in dts)
  window.require = require;
}
