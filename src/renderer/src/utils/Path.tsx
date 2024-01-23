export class Path {
  static Combine(...paths: string[]): string {
    return window.native.path.join(...paths);
  }

  static APP_DATA: string = window.native.appData;
}