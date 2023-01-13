import { ImageData, LabelName } from '../../store/labels/types';
import { LabelsSelector } from '../../store/selectors/LabelsSelector';
import { ExportDbAnnotation, ExportDBBBox, ExportDbObject, ExportDBSegmentation } from './types';
import { ExportDbBase } from './ExportDbBase';
import { LabelDataMap } from '../export/polygon/COCOExporter';
import { flatten } from 'lodash';
import { IPoint } from '../../interfaces/IPoint';

export class PolygonLabelDbExporter {
  public static export = () => {
    const imagesData: ImageData[] = LabelsSelector.getImagesData();
    const labelNames: LabelName[] = LabelsSelector.getLabelNames();
    return this.mapImagesData(imagesData, labelNames)
  };

  public static mapImagesData(
    imagesData: ImageData[],
    labelNames: LabelName[]
  ): ExportDbObject {
    return {
      info: ExportDbBase.getInfoComponent(),
      images: ExportDbBase.getImagesComponent(imagesData),
      annotations: this.getAnnotationsComponent(imagesData, labelNames),
      categories: ExportDbBase.getCategoriesComponent(labelNames)
    };
  }

  public static getAnnotationsComponent(
    imagesData: ImageData[],
    labelNames: LabelName[]
  ): ExportDbAnnotation[] {
    const labelsMap: LabelDataMap = ExportDbBase.mapLabelsData(labelNames);
    let id = 0;
    const annotations: ExportDbAnnotation[][] = imagesData
      .filter((imgItem) => imgItem.loadStatus && imgItem.labelPolygons.length !== 0)
      .map((imageData: ImageData) => {
        return imageData.labelPolygons.map((labelPolygon) => {
          return {
            'id': id++,
            'iscrowd': 0,
            'image_id': imageData.id,
            'category_id': labelsMap[labelPolygon.labelId],
            'segmentation': this.getSegmentation(labelPolygon.vertices),
            'bbox': this.getBbox(labelPolygon.vertices),
            'area': this.getArea(labelPolygon.vertices)
          };
        });
      });

    return flatten(annotations);
  }

  public static getSegmentation(vertices: IPoint[]): ExportDBSegmentation {
    const points: number[][] = vertices.map((point: IPoint) => [point.x, point.y]);
    return [flatten(points)];
  }

  public static getBbox(vertices: IPoint[]): ExportDBBBox {
    let xMin: number = vertices[0].x;
    let xMax: number = vertices[0].x;
    let yMin: number = vertices[0].y;
    let yMax: number = vertices[0].y;
    for (const vertex of vertices) {
      if (xMin > vertex.x) xMin = vertex.x;
      if (xMax < vertex.x) xMax = vertex.x;
      if (yMin > vertex.y) yMin = vertex.y;
      if (yMax < vertex.y) yMax = vertex.y;
    }
    return [xMin, yMin, xMax - xMin, yMax - yMin];
  }

  public static getArea(vertices: IPoint[]): number {
    let area = 0;
    let j = vertices.length - 1;
    for (let i = 0; i < vertices.length; i++) {
      area += (vertices[j].x + vertices[i].x) * (vertices[j].y - vertices[i].y);
      j = i;
    }
    return Math.abs(area / 2);
  }
}