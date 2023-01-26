import httpClient from './index';
import { IAnnotation, ICatalog, IImage, ILabelOrder, ITaskImage, TaskImageStatus } from '../entities/image';

type ImageWithCatalog = {
  images: IImage[],
  catalogs: ICatalog[]
}

export type TaskImageQuery = {
  userId: string,
  qcCheck: boolean,
  dtlSeq: string
}

type TaskCheckData = {
  attSeq: string
  taskCheckStatEnum: TaskImageStatus
}

type TaskCheckParams = {
  taskId: string
  loginId: string
  qcId :string
}

export default {
  getImageWithCatalog: (id?: number) => httpClient.get<ImageWithCatalog>('/api/catalogs/img', { params: { id } }),
  getTaskImages: (params: TaskImageQuery) => httpClient.get<ITaskImage[]>('/api/listOfImagesByTask', {params}),
  getAnnotations: (dtlSeq: string) => httpClient.get<IAnnotation>('/api/import-annotation', {params: {dtlSeq}}),
  getLabels: (dtlSeq: string) => httpClient.get<Blob>(`/api/get-labels/${dtlSeq}`, {responseType: 'blob'}),
  checkTask: (data: TaskCheckData[], params: TaskCheckParams) => httpClient.post('/api/check-task', data, {params})
};