export interface ICatalog {
  id: number,
  name: string,
  parent: null
}

export interface IImage {
  id: number,
  originalFileUrl: string,
  thumbnailFileUrl: string,
  originalFileName: string,
  fileName: string,
  contentType: string,
  fileSize: string,
  width: number,
  height: number
}