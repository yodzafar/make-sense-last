export class FileUtil {
  public static loadImage(fileData: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(fileData);
      const image = new Image();
      image.src = url;
      image.onload = () => resolve(image);
      image.onerror = reject;
    });
  }

  public static loadImages(fileData: File[]): Promise<HTMLImageElement[]> {
    return new Promise((resolve, reject) => {
      const promises: Promise<HTMLImageElement>[] = fileData.map((data: File) => FileUtil.loadImage(data));
      Promise
        .all(promises)
        .then((values: HTMLImageElement[]) => resolve(values))
        .catch((error) => reject(error));
    });
  }

  public static readFile(fileData: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = (event: any) => {
        resolve(event?.target?.result);
      };
      reader.onerror = reject;
      reader.readAsText(fileData);
    });
  }

  public static readFiles(fileData: File[]): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const promises: Promise<string>[] = fileData.map((data: File) => FileUtil.readFile(data));
      Promise
        .all(promises)
        .then((values: string[]) => resolve(values))
        .catch((error) => reject(error));
    });
  }

  public static extractFileExtension(name: string): string | null {
    const parts = name.split('.');
    return parts.length > 1 ? parts[parts.length - 1] : null;
  }

  public static extractFileName(name: string): string | null {
    const splitPath = name.split('.');
    let fName = '';
    for (const idx of Array(splitPath.length - 1).keys()) {
      if (fName === '') fName += splitPath[idx];
      else fName += '.' + splitPath[idx];
    }
    return fName;
  }

  public static base64StringToFile(base64String, filename) {
    const arr = base64String.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }
}
