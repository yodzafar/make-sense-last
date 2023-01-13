import { ExportDbCategory, ExportDBImage, ExportDBInfo } from './types';
import { GeneralSelector } from '../../store/selectors/GeneralSelector';
import { ImageData, LabelName } from '../../store/labels/types';
import { ImageRepository } from '../imageRepository/ImageRepository';
import { LabelDataMap } from '../export/polygon/COCOExporter';

export class ExportDbBase {
  public static getInfoComponent(): ExportDBInfo {
    const projectName: string = GeneralSelector.getProjectName();
    return {
      'description': projectName
    };
  }

  public static getImagesComponent(imagesData: ImageData[]): ExportDBImage[] {
    return imagesData
      .filter((imgItem) => imgItem.loadStatus && imgItem.labelRects.length !== 0)
      .map((imageData: ImageData) => {
        const image: HTMLImageElement = ImageRepository.getById(imageData.id);
        return {
          id: imageData.id,
          width: image.width,
          height: image.height,
          file_name: imageData.fileData.name
        };
      });
  }

  public static mapLabelsData(labelNames: LabelName[]): LabelDataMap {
    return labelNames.reduce((data: LabelDataMap, label: LabelName, index: number) => {
      data[label.id] = index + 1;
      return data;
    }, {});
  }

  public static getCategoriesComponent(labelNames: LabelName[]): ExportDbCategory[] {
    return labelNames.map((labelName: LabelName, index: number) => {
      return {
        id: index + 1,
        name: labelName.name,
        description: labelName.description,
        colorCode: labelName.color
      };
    });
  }
}