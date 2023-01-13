import { useDropzone } from 'react-dropzone';
import { ImageDataUtil } from '../../../../utils/ImageDataUtil';
import { PopupActions } from '../../../../logic/actions/PopupActions';
import { GenericYesNoPopup } from '../../GenericYesNoPopup/GenericYesNoPopup';
import React from 'react';
import { connect } from 'react-redux';
import { addImageData, updateActiveImageIndex } from '../../../../store/labels/actionCreators';
import { AppState } from '../../../../store';
import { ImageData } from '../../../../store/labels/types';

interface IProps {
  addImage: (imageData: ImageData[]) => void;
  changeActiveImageIndex: (x: number) => void;
  activeImageIndex: number | null;
}

const LoadFromLocal = ({addImage, changeActiveImageIndex, activeImageIndex}: IProps) => {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.png']
    }
  });

  const onAccept = () => {
    if (acceptedFiles.length > 0) {
      addImage(
        acceptedFiles.map((fileData: File) =>
          ImageDataUtil.createImageDataFromFileData(fileData)
        )
      );
      if (activeImageIndex === null) {
        changeActiveImageIndex(0);
      }
      PopupActions.close();
    }
  };

  const onReject = () => {
    PopupActions.close();
  };

  const getDropZoneContent = () => {
    if (acceptedFiles.length === 0)
      return (
        <>
          <input {...getInputProps()} />
          <img draggable={false} alt={'upload'} src={'ico/box-opened.png'} />
          <p className='extraBold'>Add new images</p>
          <p>or</p>
          <p className='extraBold'>Click here to select them</p>
        </>
      );
    else if (acceptedFiles.length === 1)
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
            {acceptedFiles.length} new images loaded
          </p>
        </>
      );
  };

  const renderContent = () => {
    return (
      <div className='LoadMoreImagesPopupContent'>
        <div {...getRootProps({ className: 'DropZone' })}>
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
      disableAcceptButton={acceptedFiles.length < 1}
      onAccept={onAccept}
      rejectLabel={'Cancel'}
      onReject={onReject}
    />
  );
};

const mapDispatchToProps = {
  addImage: addImageData,
  changeActiveImageIndex: updateActiveImageIndex
};

const mapStateToProps = (state: AppState) => ({
  activeImageIndex: state.labels.activeImageIndex,
  imageActionTypes: state.general.imageActionType
});

export default connect(mapStateToProps, mapDispatchToProps)(LoadFromLocal);