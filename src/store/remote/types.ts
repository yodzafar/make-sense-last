import { Action } from '../Actions';
import { IAnnotation, ILabelOrder, ITaskImage } from '../../entities/image';

export enum RemoteClearType {
  images = 'images',
  data = 'data',
  breadcrumb = 'breadcrumb'
}

export type BreadcrumbType = {
  id: number,
  name: string
}

export type RemoteState = {
  images: { [key: string]: File }
  breadcrumb: BreadcrumbType[],
  loading: boolean,
  data: ITaskImage[]
  annotation: IAnnotation[]
  labelFile: File | null
};

interface FetchImageSuccess {
  type: typeof Action.SUCCESSFULLY_FETCHING_IMAGES;
  payload: {
    data: ITaskImage[]
  };
}

interface FetchingImageLoading {
  type: typeof Action.FETCHING_IMAGES_LOADING;
  payload: {
    isLoading: boolean
  };
}

interface StartFetchingOriginalImage {
  type: typeof Action.START_FETCHING_ORIGINAL_IMAGE;
  payload: {
    id: number,
    url: string
  };
}

interface FetchingOriginalImageSuccess {
  type: typeof Action.FETCHING_ORIGINAL_IMAGE_SUCCESSFULLY,
  payload: {
    id: number,
    file: File
  }
}

interface UpdateBreadcrumb {
  type: typeof Action.UPDATE_BREADCRUMB,
  payload: BreadcrumbType[]
}

interface UpdateSelectedImage {
  type: typeof Action.UPDATE_SELECTED_IMAGE,
  payload: { [key: string]: File }
}

interface ResetRemoteState {
  type: typeof Action.RESET_REMOTE_STATE,
}

interface ImportAnnotation {
  type: Action.IMPORT_ANNOTATION,
  payload: IAnnotation[]
}

interface GetLabelOrder {
  type: Action.FETCH_LABEL_ORDER,
  payload: File
}

export type RemoteActionTypes =
  | ResetRemoteState
  | FetchImageSuccess
  | FetchingImageLoading
  | UpdateBreadcrumb
  | StartFetchingOriginalImage
  | FetchingOriginalImageSuccess
  | UpdateSelectedImage
  | ImportAnnotation
  | GetLabelOrder


