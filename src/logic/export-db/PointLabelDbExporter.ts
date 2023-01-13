import { ImageData, LabelName } from '../../store/labels/types';
import { LabelsSelector } from '../../store/selectors/LabelsSelector';
import { ExportDbAnnotation, ExportDbObject } from './types';
import { ExportDbBase } from './ExportDbBase';
import { LabelDataMap } from '../export/polygon/COCOExporter';
import { flatten } from 'lodash';

export class PointLabelDbExporter {
  public static export = () => {
    const imagesData: ImageData[] = LabelsSelector.getImagesData();
    const labelNames: LabelName[] = LabelsSelector.getLabelNames();
    return this.mapImagesData(imagesData, labelNames);
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
      .filter((imgItem) => imgItem.loadStatus && imgItem.labelPoints.length !== 0)
      .map((imageData: ImageData) => {
        return imageData.labelPoints.map((labelPoint) => {
          return {
            'id': id++,
            'iscrowd': 0,
            'image_id': imageData.id,
            'category_id': labelsMap[labelPoint.labelId],
            'segmentation': null,
            'bbox': [labelPoint.point.x, labelPoint.point.y],
            'area': null
          };
        });
      });

    return flatten(annotations);
  }
}