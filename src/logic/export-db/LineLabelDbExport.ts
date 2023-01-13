import { ImageData, LabelName } from '../../store/labels/types';
import { LabelsSelector } from '../../store/selectors/LabelsSelector';
import { ExportDbAnnotation, ExportDbObject } from './types';
import { ExportDbBase } from './ExportDbBase';
import { LabelDataMap } from '../export/polygon/COCOExporter';
import { flatten } from 'lodash';

export class LineLabelDbExport {
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
      .filter((imgItem) => imgItem.loadStatus && imgItem.labelLines.length !== 0)
      .map((imageData: ImageData) => {
        return imageData.labelLines.map((labelLine) => {
          return {
            'id': id++,
            'iscrowd': 0,
            'image_id': imageData.id,
            'category_id': labelsMap[labelLine.labelId],
            'segmentation': null,
            'bbox': [labelLine.line.start.x, labelLine.line.start.y, labelLine.line.end.x, labelLine.line.end.y],
            'area': null
          };
        });
      });

    return flatten(annotations);
  }
}