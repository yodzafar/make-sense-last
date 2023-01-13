import LoadImagesFromDb from '../../../components/LoadImagesFromDb';
import { GenericYesNoPopup } from '../GenericYesNoPopup/GenericYesNoPopup';
import React, { useCallback } from 'react';
import { AppState } from '../../../store';
import { connect } from 'react-redux';
import { PopupActions } from '../../../logic/actions/PopupActions';
import './DirectoryPopup.scss';
import { updateActivePopupType } from '../../../store/general/actionCreators';
import { PopupWindowType } from '../../../data/enums/PopupWindowType';
import { resetRemoteState } from '../../../store/remote/actionCreators';

interface IProps {
  selectedImage: { [key: string]: File };
  updatePopupType: (type: PopupWindowType) => void;
  reset: () => void;
}

const DirectoryPopup = ({ selectedImage, updatePopupType, reset }: IProps) => {
  const onAccept = useCallback(() => {
    updatePopupType(PopupWindowType.IMPORT_IMAGES);
  }, []);

  const onReject = useCallback(() => {
    PopupActions.close();
    reset();
  }, []);

  const renderContent = () => (
    <div className='Directory'>
      <LoadImagesFromDb />
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
  reset: resetRemoteState
};

const mapStateToProps = (state: AppState) => ({
  selectedImage: state.remote.images
});

export default connect(mapStateToProps, mapDispatchToProps)(DirectoryPopup);