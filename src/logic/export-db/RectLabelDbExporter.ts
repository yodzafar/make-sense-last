import { ImageData, LabelName } from '../../store/labels/types';
import { LabelsSelector } from '../../store/selectors/LabelsSelector';
import { ExportDbBase } from './ExportDbBase';
import { ExportDbAnnotation, ExportDbObject, ExportDbRectangle } from './types';
import { LabelDataMap } from '../export/polygon/COCOExporter';
import { flatten } from 'lodash';
import { ImageRepository } from '../imageRepository/ImageRepository';

export class RectLabelDbExporter {
  public static export = () => {
    const imagesData: ImageData[] = LabelsSelector.getImagesData();
    const labelNames: LabelName[] = LabelsSelector.getLabelNames();
    return this.mapImagesData(imagesData, labelNames);
  };

  public static getRectData = (): ExportDbRectangle[] => {
    const tmp: ExportDbRectangle[] = [];
    const imagesData: ImageData[] = LabelsSelector.getImagesData().filter(item => item.labelRects.length > 0 && item.status !== 'APPROVED');
    const labelNames: LabelName[] = LabelsSelector.getLabelNames();
    for (const item of imagesData) {
      const image: HTMLImageElement = ImageRepository.getById(item.id);
      const arr = item.labelRects;
      for (const label of arr) {
        const labelData = labelNames.find((x) => x.id === label.labelId)
        if(labelData) {
          tmp.push(({
            imgHeight: image.height,
            imgWidth: image.width,
            bboxX: label.rect.x,
            bboxY: label.rect.y,
            bboxWidth: label.rect.width,
            bboxHeight: label.rect.height,
            attSeq: Number(item.id),
            labelName: labelNames.find(item => item.id === label.labelId)?.name || '',
            labelOrder: 0,
          }));
        }
      }
    }
    return tmp;
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
      .filter((imgItem) => imgItem.loadStatus && imgItem.labelRects.length !== 0)
      .map((imageData: ImageData) => {
        return imageData.labelRects.map((labelRect) => {
          return {
            'id': id++,
            'iscrowd': 0,
            'image_id': imageData.id,
            'category_id': labelsMap[labelRect.labelId],
            'segmentation': null,
            'bbox': [labelRect.rect.x, labelRect.rect.y, labelRect.rect.width, labelRect.rect.height],
            'area': null
          };
        });
      });

    return flatten(annotations);
  }
}