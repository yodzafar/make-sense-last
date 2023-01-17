import httpClient from './index';
import { ICatalog, IImage, ITaskImage } from '../entities/image';

type ImageWithCatalog = {
  images: IImage[],
  catalogs: ICatalog[]
}

export type TaskImageQuery = {
  userId: string,
  qcCheck: boolean,
  dtlSeq: number
}

export default {
  getImageWithCatalog: (id?: number) => httpClient.get<ImageWithCatalog>('/api/catalogs/img', { params: { id } }),
  getTaskImages: (params: TaskImageQuery) => httpClient.get<ITaskImage[]>('/api/listOfImagesByTask', {params})
};