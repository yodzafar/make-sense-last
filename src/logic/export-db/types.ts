export type ExportDBSegmentation = number[][]
export type ExportDBBBox = number[]

export type ExportDBInfo = {
  description: string;
}

export type ExportDBImage = {
  id: string;
  width: number;
  height: number;
  file_name: string;
}

export type ExportDbCategory = {
  id: number;
  name: string;
  description: string,
  colorCode: string
}

export type ExportDbAnnotation = {
  id: number;
  category_id: number;
  iscrowd: number;
  segmentation: ExportDBSegmentation | null;
  image_id: string;
  area: number | null;
  bbox: ExportDBBBox;
}

export type ExportDbObject = {
  info: ExportDBInfo,
  images: ExportDBImage[],
  annotations: ExportDbAnnotation[],
  categories: ExportDbCategory[]
}

