import httpClient from './index';
import { ICatalog, IImage } from '../entities/image';

type ImageWithCatalog = {
  images: IImage[],
  catalogs: ICatalog[]
}

export default {
  getImageWithCatalog: (id?: number) => httpClient.get<ImageWithCatalog>('/api/catalogs/img', { params: { id } })
};