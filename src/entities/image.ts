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

export interface ITaskImage {
  name: string,
  size: number,
  path: string,
  url: string,
  status: string,
  dtlSeq: number,
  attSeq: number,
}