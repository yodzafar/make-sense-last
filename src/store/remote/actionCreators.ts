import api from '../../service/api';
import { Action } from '../Actions';
import { BreadcrumbType, RemoteActionTypes } from './types';
import httpClient from '../../service';
import { IImage } from '../../entities/image';

export function getOriginalImage(img: IImage) {
  return async (dispatch) => {
    try {
      const res = await httpClient.get(img.originalFileUrl, { responseType: 'blob' });
      const file = new File([res.data], img.fileName);
      dispatch({ type: Action.FETCHING_ORIGINAL_IMAGE_SUCCESSFULLY, payload: { file, id: img.id } });
    } catch (e) {
      // tslint:disable-next-line:no-console
      console.log(e);
    }
  };
}

export function getImageFromDb(id?: number) {
  return async (dispatch) => {
    try {
      dispatch({ type: Action.FETCHING_IMAGES_LOADING, payload: { isLoading: true } });
      const res = await api.getImageWithCatalog(id);
      dispatch({
        type: Action.SUCCESSFULLY_FETCHING_IMAGES, payload: {
          data: res.data
        }
      });

    } catch (e) {
      // tslint:disable-next-line:no-console
      console.log(e);
    } finally {
      dispatch({ type: Action.FETCHING_IMAGES_LOADING, payload: { isLoading: false } });
    }
  };
}

export function updateRemoteBreadcrumb(breadcrumb: BreadcrumbType[]): RemoteActionTypes {
  return {
    type: Action.UPDATE_BREADCRUMB,
    payload: breadcrumb
  };
}

export function updateSelectedImage(files: { [key: string]: File }): RemoteActionTypes {
  return {
    type: Action.UPDATE_SELECTED_IMAGE,
    payload: files
  };
}

export function resetRemoteState(): RemoteActionTypes {
  return {
    type: Action.RESET_REMOTE_STATE
  };
}


