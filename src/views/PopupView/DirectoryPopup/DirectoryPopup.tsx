import { useCallback, useMemo } from 'react';
import { connect } from 'react-redux';
import LoadTaskImages from '../../../components/LoadTaskImages';
import { PopupWindowType } from '../../../data/enums/PopupWindowType';
import { PopupActions } from '../../../logic/actions/PopupActions';
import { AppState } from '../../../store';
import { updateActivePopupType } from '../../../store/general/actionCreators';
import { resetRemoteState } from '../../../store/remote/actionCreators';
import { GenericYesNoPopup } from '../GenericYesNoPopup/GenericYesNoPopup';
import './DirectoryPopup.scss';
import { ImageData, LabelName } from '../../../store/labels/types';
import { ImageDataUtil } from '../../../utils/ImageDataUtil';
import {
  addImageData,
  updateActiveImageIndex,
  updateActiveLabelId,
  updateActiveLabelType,
  updateImageData,
  updateLabelNames
} from '../../../store/labels/actionCreators';
import { IAnnotation, ITaskImage } from '../../../entities/image';
import { LabelType } from '../../../data/enums/LabelType';
import httpClient from '../../../service';
import axios from 'axios';
import { YOLOImporter } from '../../../logic/import/yolo/YOLOImporter';

interface IProps {
  selectedImage: { [key: string]: File };
  addImage: (imageData: ImageData[]) => void;
  changeActiveImageIndex: (x: number) => void;
  activeImageIndex: number | null;
  updatePopupType: (type: PopupWindowType) => void;
  reset: () => void;
  images: ImageData[];
  annotation: IAnnotation[];
  changeActiveLabelId: (activeLabelId: string) => void;
  remoteImage: ITaskImage[]
  labelFile: File | null,
  updateImageDataAction: (imageData: ImageData[]) => void,
  updateLabelNamesAction: (labels: LabelName[]) => void,
  updateActiveLabelTypeAction: (activeLabelType: LabelType) => void;
}

const DirectoryPopup = (
  {
    selectedImage,
    addImage,
    activeImageIndex,
    changeActiveImageIndex,
    images,
    updateImageDataAction,
    updateLabelNamesAction,
    updateActiveLabelTypeAction,
    remoteImage,
    labelFile
  }: IProps
) => {

  const filesLength = useMemo(
    () => Object.values(selectedImage).length,
    [selectedImage]
  );

  const onSuccessCallback = (imagesData: ImageData[], labelNames: LabelName[]) => {
    updateImageDataAction(imagesData);
    updateLabelNamesAction(labelNames);
    updateActiveLabelTypeAction(LabelType.RECT);
  };

  const getAnnotations = async (ids: string[]) => {

    try {
      const requests = ids.map((attSeq) => httpClient.get<Blob>(
        `/api/create-file-for-import-annotation/${attSeq}`,
        { responseType: 'blob' }));
      const res = await axios.all(requests);
      const tmp: File[] = [];
      for (const item of res) {
        const imgId = item.config.url.match(/\/(\d+)+\/?/g).map((id) => id.replace(/\//g, ''))[0];
        const img = remoteImage.find((imgItem) => String(imgItem.attSeq) === imgId);
        if (img) {
          tmp.push(new File([item.data], `${img.name.split('.').slice(0, -1).join('.')}.txt`));
        }
      }
      if (tmp.length > 0 && labelFile) {
        const yoloImporter = new YOLOImporter([LabelType.RECT]);
        yoloImporter.import([...tmp, labelFile], onSuccessCallback, () => {
          // 1
        });
      }
    } catch (e) {
      // tslint:disable-next-line:no-console
      console.log(e);
    }
  };
  const onAccept = () => {
    if (filesLength > 0) {
      const tmp: ImageData[] = [];
       for (const key in selectedImage) {
        if (images.findIndex((item) => item.id === key) === -1) {
          const remote = remoteImage.find(item => String(item.attSeq) === key);
          tmp.push(
            {
              ...ImageDataUtil.createImageDataFromFileData(selectedImage[key], key), ...(remote ? {
                adminID: remote.qcId,
                status: remote.status
              } : {})
            }
          );
        }
      }
      getAnnotations(tmp.filter(item => item.status !== 'UNDONE').map(item => item.id));
      addImage(tmp);
      if (activeImageIndex === null) {
        changeActiveImageIndex(0);
      }
      PopupActions.close();
    }
  };

  const onReject = useCallback(() => {
    PopupActions.close();
  }, []);

  const renderContent = () => (
    <div className='Directory'>
      <LoadTaskImages />
    </div>
  );

  return (
    <GenericYesNoPopup
      popupClassName='large'
      title={'Images from Database'}
      renderContent={renderContent}
      acceptLabel={'Open'}
      disableAcceptButton={Object.values(selectedImage).length === 0}
      onAccept={onAccept}
      rejectLabel={'Cancel'}
      onReject={onReject}
    />
  );
};

const mapDispatchToProps = {
  updatePopupType: updateActivePopupType,
  reset: resetRemoteState,
  addImage: addImageData,
  changeActiveImageIndex: updateActiveImageIndex,
  changeActiveLabelId: updateActiveLabelId,
  updateImageDataAction: updateImageData,
  updateLabelNamesAction: updateLabelNames,
  updateActiveLabelTypeAction: updateActiveLabelType
};

const mapStateToProps = (state: AppState) => ({
  selectedImage: state.remote.images,
  activeImageIndex: state.labels.activeImageIndex,
  images: state.labels.imagesData,
  annotation: state.remote.annotation,
  remoteImage: state.remote.data,
  labelFile: state.remote.labelFile
});

export default connect(mapStateToProps, mapDispatchToProps)(DirectoryPopup);
