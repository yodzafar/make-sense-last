import { RemoteActionTypes, RemoteState } from './types';
import { Action } from '../Actions';

const initialState: RemoteState = {
  images: {},
  breadcrumb: [],
  loading: false,
  data: []
};

export function remoteReducer(
  state = initialState,
  action: RemoteActionTypes
): RemoteState {
  switch (action.type) {
    case Action.FETCHING_IMAGES_LOADING:
      return {
        ...state,
        loading: action.payload.isLoading
      };
    case Action.SUCCESSFULLY_FETCHING_IMAGES:
      return {
        ...state,
        data: action.payload.data
      };
    case Action.UPDATE_BREADCRUMB:
      return {
        ...state,
        breadcrumb: action.payload
      };
    case Action.FETCHING_ORIGINAL_IMAGE_SUCCESSFULLY:
      return {
        ...state, images: { ...state.images, [action.payload.id]: action.payload.file }
      };
    case Action.UPDATE_SELECTED_IMAGE:
      return {
        ...state,
        images: action.payload
      };
    case Action.RESET_REMOTE_STATE:
      return {
        ...state,
        images: {},
        data: [],
        breadcrumb: []
      };
    default:
      return state;
  }
}
