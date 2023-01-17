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
import { ImageData } from '../../../store/labels/types';
import { ImageDataUtil } from '../../../utils/ImageDataUtil';
import { addImageData, updateActiveImageIndex } from '../../../store/labels/actionCreators';

interface IProps {
  selectedImage: { [key: string]: File };
  addImage: (imageData: ImageData[]) => void;
  changeActiveImageIndex: (x: number) => void;
  activeImageIndex: number | null;
  updatePopupType: (type: PopupWindowType) => void;
  reset: () => void;
  images: ImageData[];
}

const DirectoryPopup = ({ selectedImage, reset, addImage, activeImageIndex, changeActiveImageIndex, images }: IProps) => {

  const filesLength = useMemo(
    () => Object.values(selectedImage).length,
    [selectedImage]
  );
  const onAccept = () => {
    if (filesLength > 0) {
      const tmp: ImageData[] = [];
      // tslint:disable-next-line:forin
      for (const key in selectedImage) {
        if (images.findIndex((item) => item.id === key) === -1) {
          tmp.push(
            ImageDataUtil.createImageDataFromFileData(selectedImage[key], key)
          );
        }
      }
      addImage(tmp);
      if (activeImageIndex === null) {
        changeActiveImageIndex(0);
      }
      reset();
      PopupActions.close();
    }
  };

  const onReject = useCallback(() => {
    PopupActions.close();
    reset();
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
};

const mapStateToProps = (state: AppState) => ({
  selectedImage: state.remote.images,
  activeImageIndex: state.labels.activeImageIndex,
  images: state.labels.imagesData,
});

export default connect(mapStateToProps, mapDispatchToProps)(DirectoryPopup);
