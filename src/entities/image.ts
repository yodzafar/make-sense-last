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

export interface YoloDTOS {
  labelOrder: number,
  yolo1: number,
  yolo2: number,
  yolo3: number,
  yolo4: number
}

export interface IAnnotation {
  attSeq: number,
  vrifysttus: string,
  loginId: string,
  qcId: string,
  'yoloDTOS': YoloDTOS[]
}

export interface ILabelOrder {
  labelName: string,
  labelSeq: number,
  labelOrder: number
}