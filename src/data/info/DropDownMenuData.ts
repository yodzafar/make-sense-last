import { updateActivePopupType, updateImageActionType } from '../../store/general/actionCreators';
import { PopupWindowType } from '../enums/PopupWindowType';
import { store } from '../../index';
import { ImageActionType } from '../../store/general/types';

export type DropDownMenuNode = {
  name: string;
  description?: string;
  imageSrc: string;
  imageAlt: string;
  disabled: boolean;
  getDisabled: (status: boolean) => boolean
  onClick?: () => void;
  children?: DropDownMenuNode[];
  actionType?: ImageActionType;
};

export const DropDownMenuData: DropDownMenuNode[] = [
  {
    name: 'Actions',
    imageSrc: 'ico/actions.png',
    imageAlt: 'actions',
    disabled: false,
    getDisabled: (status) => status,
    children: [
      {
        name: 'Edit Labels',
        description: 'Modify labels list',
        imageSrc: 'ico/tags.png',
        imageAlt: 'labels',
        disabled: false,
        getDisabled: (status) => status,
        onClick: () =>
          store.dispatch(updateActivePopupType(PopupWindowType.UPDATE_LABEL))
      },
      {
        name: 'Import Images',
        description: 'Load more images',
        imageSrc: 'ico/camera.png',
        imageAlt: 'images',
        disabled: false,
        actionType: 'local',
        getDisabled: (status) => status,
        onClick: () => {
          store.dispatch(updateActivePopupType(PopupWindowType.IMPORT_IMAGES));
          store.dispatch(
            updateImageActionType('local')
          );
        }
      },
      {
        name: 'Import Annotations',
        description: 'Import annotations from file',
        imageSrc: 'ico/import-labels.png',
        imageAlt: 'import-labels',
        disabled: false,
        actionType: 'local',
        getDisabled: (status) => status,
        onClick: () => {
          store.dispatch(
            updateActivePopupType(PopupWindowType.IMPORT_ANNOTATIONS)
          );
        }
      },
      {
        name: 'Export Annotations',
        description: 'Export annotations to file',
        imageSrc: 'ico/export-labels.png',
        imageAlt: 'export-labels',
        disabled: true,
        actionType: 'local',
        getDisabled: (status) => status,
        onClick: () => {
          store.dispatch(
            updateActivePopupType(PopupWindowType.EXPORT_ANNOTATIONS)
          );
          store.dispatch(
            updateImageActionType('local')
          );
        }
      },
      {
        name: 'Load AI Model',
        description: 'Load our pre-trained annotation models',
        imageSrc: 'ico/ai.png',
        imageAlt: 'load-ai-model',
        disabled: false,
        getDisabled: (status) => status,
        onClick: () => {
          store.dispatch(updateActivePopupType(PopupWindowType.LOAD_AI_MODEL));
          store.dispatch(
            updateImageActionType('local')
          );
        }
      }
    ]
  },
  {
    name: 'Actions2',
    imageSrc: 'ico/actions.png',
    imageAlt: 'actions',
    disabled: false,
    getDisabled: (status) => status,
    children: [
      {
        name: 'Import Images',
        description: 'Load more images',
        imageSrc: 'ico/camera.png',
        imageAlt: 'images',
        actionType: 'db',
        disabled: false,
        getDisabled: (status) => status,
        onClick: () => {
          store.dispatch(updateImageActionType('db'));
          store.dispatch(updateActivePopupType(PopupWindowType.IMPORT_IMAGES));
        }
      },
      {
        name: 'Export Annotations',
        description: 'Export annotations to file',
        imageSrc: 'ico/export-labels.png',
        imageAlt: 'export-labels',
        disabled: true,
        actionType: 'db',
        getDisabled: (status) => status,
        onClick: () =>
          store.dispatch(
            updateActivePopupType(PopupWindowType.EXPORT_ANNOTATIONS_DB)
          )
      },
      {
        name: 'Load AI Model',
        description: 'Load our pre-trained annotation models',
        imageSrc: 'ico/ai.png',
        imageAlt: 'load-ai-model',
        disabled: false,
        getDisabled: (status) => status,
        onClick: () =>
          store.dispatch(updateActivePopupType(PopupWindowType.LOAD_AI_MODEL_DB))
      }
    ]
  },
  {
    name: 'Community',
    imageSrc: 'ico/plant.png',
    imageAlt: 'community',
    disabled: false,
    getDisabled: (status) => status,
    children: [
      {
        name: 'Documentation',
        description: 'Read more about Make Sense',
        imageSrc: 'ico/documentation.png',
        imageAlt: 'documentation',
        disabled: false,
        getDisabled: (status) => status,
        onClick: () =>
          window.open('https://skalskip.github.io/make-sense', '_blank')
      },
      {
        name: 'Bugs and Features',
        description: 'Report a bug or propose a new feature',
        imageSrc: 'ico/bug.png',
        imageAlt: 'bug',
        disabled: false,
        getDisabled: (status) => status,
        onClick: () =>
          window.open(
            'https://github.com/SkalskiP/make-sense/issues',
            '_blank'
          )
      }
    ]
  }
];

