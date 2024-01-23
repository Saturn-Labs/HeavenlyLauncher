export class MinecraftVersionList {
  static initializeVersionList(apiUrl: string, onComplete: (data: string[][]) => void): void {
    fetch(apiUrl).then(response => {
      if (response.status === 200) {
        return response.json();
      }
      return null;
    }).then(data => {
      if (data != null)
      {
        onComplete(data);
      }
    }).catch(error => {
      console.error(error);
    });
  }
};