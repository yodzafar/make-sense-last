import { ImageData, LabelName, LabelsActionTypes } from './types';
import { Action } from '../Actions';
import { LabelType } from '../../data/enums/LabelType';
import { TaskImageStatus } from '../../entities/image';
import api from '../../service/api';
import { NotificationUtil } from '../../utils/NotificationUtil';
import { NotificationsDataMap } from '../../data/info/NotificationsData';
import { Notification } from '../../data/enums/Notification';

export function updateActiveImageIndex(activeImageIndex: number): LabelsActionTypes {
  return {
    type: Action.UPDATE_ACTIVE_IMAGE_INDEX,
    payload: {
      activeImageIndex
    }
  };
}

export function updateActiveLabelNameId(activeLabelNameId: string): LabelsActionTypes {
  return {
    type: Action.UPDATE_ACTIVE_LABEL_NAME_ID,
    payload: {
      activeLabelNameId
    }
  };
}

export function updateActiveLabelId(activeLabelId: string): LabelsActionTypes {
  return {
    type: Action.UPDATE_ACTIVE_LABEL_ID,
    payload: {
      activeLabelId
    }
  };
}

export function updateHighlightedLabelId(highlightedLabelId: string): LabelsActionTypes {
  return {
    type: Action.UPDATE_HIGHLIGHTED_LABEL_ID,
    payload: {
      highlightedLabelId
    }
  };
}

export function updateActiveLabelType(activeLabelType: LabelType): LabelsActionTypes {
  return {
    type: Action.UPDATE_ACTIVE_LABEL_TYPE,
    payload: {
      activeLabelType
    }
  };
}

export function updateImageDataById(id: string, newImageData: ImageData): LabelsActionTypes {
  return {
    type: Action.UPDATE_IMAGE_DATA_BY_ID,
    payload: {
      id,
      newImageData
    }
  };
}

export function addImageData(imageData: ImageData[]): LabelsActionTypes {
  return {
    type: Action.ADD_IMAGES_DATA,
    payload: {
      imageData
    }
  };
}

export function updateImageData(imageData: ImageData[]): LabelsActionTypes {
  return {
    type: Action.UPDATE_IMAGES_DATA,
    payload: {
      imageData
    }
  };
}

export function updateLabelNames(labels: LabelName[]): LabelsActionTypes {
  return {
    type: Action.UPDATE_LABEL_NAMES,
    payload: {
      labels
    }
  };
}

export function updateFirstLabelCreatedFlag(firstLabelCreatedFlag: boolean): LabelsActionTypes {
  return {
    type: Action.UPDATE_FIRST_LABEL_CREATED_FLAG,
    payload: {
      firstLabelCreatedFlag
    }
  };
}

// tslint:disable-next-line:max-line-length
export function updateImageStatus(dtlSeq: string, loginId: string, qcId: string, image: ImageData, status: TaskImageStatus) {
  return async dispatch => {
    try {
      dispatch({type: Action.UPDATING_STATUS_LOADING, payload: {[image.id]: status === 'APPROVED' ? 1 : 2}})
      await api.checkTask([{ attSeq: image.id, taskCheckStatEnum: status }], {
        taskId: dtlSeq,
        qcId,
        loginId
      });
      dispatch({ type: Action.UPDATE_IMAGE_DATA_BY_ID, payload: { id: image.id, newImageData: { ...image, status } } });
      dispatch({
        type: Action.SUBMIT_NEW_NOTIFICATION, payload: {
          notification: NotificationUtil
            .createMessageNotification(NotificationsDataMap[status === 'APPROVED'
              ? Notification.IMAGE_STATUS_CHANGED_APPROVED
              : Notification.IMAGE_STATUS_CHANGED_REJECTED])
        }
      });
    } catch (e) {
      // tslint:disable-next-line:no-console
      console.log(e);
      dispatch({
        type: Action.SUBMIT_NEW_NOTIFICATION, payload: NotificationUtil
          .createMessageNotification(NotificationsDataMap[Notification.UNSUCCESSFULLY_CHANGED_STATUS])
      })
    }
    finally {
      dispatch({type: Action.UPDATING_STATUS_LOADING, payload: {[image.id]: 0}})
    }
  };
}
