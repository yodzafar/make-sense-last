import { GeneralActionTypes, GeneralState } from './types';
import { Action } from '../Actions';
import { CustomCursorStyle } from '../../data/enums/CustomCursorStyle';
import { ViewPointSettings } from '../../settings/ViewPointSettings';
import { ProjectType } from '../../data/enums/ProjectType';
import Cookies from 'js-cookie';

const initialState: GeneralState = {
  isAuth: !!Cookies.get('token'),
  windowSize: null,
  activePopupType: null,
  customCursorStyle: CustomCursorStyle.DEFAULT,
  activeContext: null,
  preventCustomCursor: false,
  imageDragMode: false,
  crossHairVisible: true,
  enablePerClassColoration: true,
  projectData: {
    type: ProjectType.OBJECT_DETECTION,
    name: 'my-project-name',
  },
  zoom: ViewPointSettings.MIN_ZOOM,
  imageActionType: null,
};

export function generalReducer(
  state = initialState,
  action: GeneralActionTypes
): GeneralState {
  switch (action.type) {
    case Action.UPDATE_PROJECT_AUTH:
      return {
        ...state,
        isAuth: action.payload.isAuth,
      };
    case Action.UPDATE_WINDOW_SIZE: {
      return {
        ...state,
        windowSize: action.payload.windowSize,
      };
    }
    case Action.UPDATE_ACTIVE_POPUP_TYPE: {
      return {
        ...state,
        activePopupType: action.payload.activePopupType,
      };
    }
    case Action.UPDATE_CUSTOM_CURSOR_STYLE: {
      return {
        ...state,
        customCursorStyle: action.payload.customCursorStyle,
      };
    }
    case Action.UPDATE_CONTEXT: {
      return {
        ...state,
        activeContext: action.payload.activeContext,
      };
    }
    case Action.UPDATE_PREVENT_CUSTOM_CURSOR_STATUS: {
      return {
        ...state,
        preventCustomCursor: action.payload.preventCustomCursor,
      };
    }
    case Action.UPDATE_IMAGE_DRAG_MODE_STATUS: {
      return {
        ...state,
        imageDragMode: action.payload.imageDragMode,
      };
    }
    case Action.UPDATE_CROSS_HAIR_VISIBLE_STATUS: {
      return {
        ...state,
        crossHairVisible: action.payload.crossHairVisible,
      };
    }
    case Action.UPDATE_PROJECT_DATA: {
      return {
        ...state,
        projectData: action.payload.projectData,
      };
    }
    case Action.UPDATE_ZOOM: {
      return {
        ...state,
        zoom: action.payload.zoom,
      };
    }
    case Action.UPDATE_IMAGE_ACTION_TYPE: {
      return {
        ...state,
        imageActionType: action.payload.type,
      };
    }
    case Action.UPDATE_ENABLE_PER_CLASS_COLORATION_STATUS: {
      return {
        ...state,
        enablePerClassColoration: action.payload.enablePerClassColoration,
      };
    }
    default:
      return state;
  }
}
