import api, { TaskImageQuery } from '../../service/api';
import { Action } from '../Actions';
import { BreadcrumbType, RemoteActionTypes } from './types';
import { ITaskImage } from '../../entities/image';
import axios from 'axios';

export function getOriginalImage(img: ITaskImage) {
  return async (dispatch) => {
    try {
      const res = await axios.get(img.url, { responseType: 'blob' });
      const file = new File([res.data], img.name);
      dispatch({ type: Action.FETCHING_ORIGINAL_IMAGE_SUCCESSFULLY, payload: { file, id: img.attSeq } });
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

export function getTaskImages(data: TaskImageQuery) {
  return async (dispatch) => {
    try {
      dispatch({ type: Action.FETCHING_IMAGES_LOADING, payload: { isLoading: true } });
      const res = await api.getTaskImages(data);
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

export function importAnnotation(dtlSeq: string) {
  return async (dispatch) => {
    try {
      const res = await api.getAnnotations(dtlSeq);
      dispatch({ type: Action.IMPORT_ANNOTATION, payload: res.data });
    } catch (e) {
      // tslint:disable-next-line:no-console
      console.log(e);
    }
  };
}

export function importLabels(dtlSeq: string) {
  return async (dispatch) => {
    try {
      const res = await api.getLabels(dtlSeq);
      dispatch({type: Action.FETCH_LABEL_ORDER, payload: new File([res.data], 'labels.txt')})
    } catch (e) {
// tslint:disable-next-line:no-console
      console.log(e);
    }
  };
}


