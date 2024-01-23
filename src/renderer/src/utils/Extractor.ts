const fs = window.require('fs') as typeof import('fs');
const path = window.require('path') as typeof import('path');
import * as JSZip from 'jszip';
import CancellationToken from './CancellationToken';
import { Path } from './Path';
import { ActionComplete, ExtractProgress } from './Progress';

export class Extractor {
  static async extractFile(file: string, to: string, excludes: string[], cancellationToken: CancellationToken, onProgress: ExtractProgress = () => { }, onComplete: ActionComplete = () => { }) {
    try {
      fs.mkdirSync(to);
    } catch (err) {

    }

    let isSuccess = false;

    try {
      const data = await fs.promises.readFile(file);
      const zip = await JSZip.loadAsync(data);

      let extracted = 0;

      const files = Object.entries(zip.files).filter(([filename, file]) => {
        return !file.dir;
      });
      const allFiles = files.length;

      for await (const [filename, file] of files) {
        if (cancellationToken.isCancellationRequested())
          break;
        try {
          const filePath = path.join(to, filename);
          if (excludes.find((str) => str === filename))
            continue;
          await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
        } catch (fileError) {
          console.error(`Error creating dir "${filename}":`, fileError);
        }
      }

      for await (const [filename, file] of files) {
        if (cancellationToken.isCancellationRequested())
          break;
        try {
          const fileData = await file.async('uint8array');
          const filePath = path.join(to, filename);
          if (excludes.find((str) => str === filename)) {
            extracted += 1;
            continue;
          }
          await fs.promises.writeFile(filePath, fileData);

          extracted += 1;
          onProgress(extracted, allFiles, filename);
        } catch (fileError) {
          console.error(`Error extracting file "${filename}":`, fileError);
        }
      }

      isSuccess = extracted === allFiles;
    } catch (error) {
      console.error('Error loading zip file:', error);
    } finally {
      if (cancellationToken.isCancellationRequested()) {
        console.log('Extraction cancelled');
        await fs.promises.rmdir(to);
      }

      onComplete(isSuccess);
    }
  }
}