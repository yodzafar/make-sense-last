import { GenericYesNoPopup } from '../../GenericYesNoPopup/GenericYesNoPopup';
import React, { useMemo } from 'react';
import { PopupActions } from '../../../../logic/actions/PopupActions';
import { connect } from 'react-redux';
import { AppState } from '../../../../store';
import { updateActivePopupType } from '../../../../store/general/actionCreators';
import { PopupWindowType } from '../../../../data/enums/PopupWindowType';
import { addImageData, updateActiveImageIndex } from '../../../../store/labels/actionCreators';
import { ImageData } from '../../../../store/labels/types';
import { resetRemoteState } from '../../../../store/remote/actionCreators';
import { ImageDataUtil } from '../../../../utils/ImageDataUtil';

interface IProps {
  updatePopupType: (type: PopupWindowType) => void;
  selectedImage: { [key: string]: File };
  addImage: (imageData: ImageData[]) => void;
  changeActiveImageIndex: (x: number) => void;
  activeImageIndex: number | null;
  reset: () => void;
  images: ImageData[];
}

const LoadFromDb = (
  {
    updatePopupType,
    selectedImage,
    changeActiveImageIndex,
    activeImageIndex,
    addImage,
    reset,
    images
  }: IProps) => {

  const filesLength = useMemo(() => Object.values(selectedImage).length, [selectedImage]);

  const onAccept = () => {
    if (filesLength > 0) {
      const tmp: ImageData[] = [];
      // tslint:disable-next-line:forin
      for (const key in selectedImage) {
        if (images.findIndex(item => item.id === key) === -1) {
          tmp.push(ImageDataUtil.createImageDataFromFileData(selectedImage[key], key));
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

  const onReject = () => {
    PopupActions.close();
    reset();
  };

  const getDropZoneContent = () => {
    if (filesLength === 0)
      return (
        <>
          <img draggable={false} alt={'upload'} src={'ico/box-opened.png'} />
          <p className='extraBold'>Add new images</p>
          <p>or</p>
          <p className='extraBold'>Click here to select them</p>
        </>
      );
    else if (filesLength === 1)
      return (
        <>
          <img draggable={false} alt={'uploaded'} src={'ico/box-closed.png'} />
          <p className='extraBold'>1 new image loaded</p>
        </>
      );
    else
      return (
        <>
          <img
            draggable={false}
            key={1}
            alt={'uploaded'}
            src={'ico/box-closed.png'}
          />
          <p key={2} className='extraBold'>
            {filesLength} new images loaded
          </p>
        </>
      );
  };

  const renderContent = () => {
    return (
      <div className='LoadMoreImagesPopupContent' onClick={() => updatePopupType(PopupWindowType.DIRECTORY)}>
        <div className='DropZone'>
          {getDropZoneContent()}
        </div>
      </div>
    );
  };

  return (
    <GenericYesNoPopup
      title={'Load more images'}
      renderContent={renderContent}
      acceptLabel={'Load'}
      disableAcceptButton={filesLength === 0}
      onAccept={onAccept}
      rejectLabel={'Cancel'}
      onReject={onReject}
    />
  );
};

const mapDispatchToProps = {
  updatePopupType: updateActivePopupType,
  addImage: addImageData,
  changeActiveImageIndex: updateActiveImageIndex,
  reset: resetRemoteState
};

const mapStateToProps = (state: AppState) => ({
  selectedImage: state.remote.images,
  activeImageIndex: state.labels.activeImageIndex,
  images: state.labels.imagesData
});

export default connect(mapStateToProps, mapDispatchToProps)(LoadFromDb);