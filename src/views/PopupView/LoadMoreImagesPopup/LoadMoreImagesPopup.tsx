import React from 'react';
import './LoadMoreImagesPopup.scss';
import { AppState } from '../../../store';
import { connect } from 'react-redux';
import { ImageActionType } from '../../../store/general/types';
import LoadFromLocal from './LoadFromLocal/LoadFromLocal';
import LoadFromDb from './LoadFromDb/LoadFromDb';


interface IProps {
  imageActionTypes: ImageActionType;
}

const LoadMoreImagesPopup = ({ imageActionTypes }: IProps) => {
  return (
    <>
      {imageActionTypes === 'local' && <LoadFromLocal />}
      {imageActionTypes === 'db' && <LoadFromDb />}
    </>
  );
};

const mapDispatchToProps = {};

const mapStateToProps = (state: AppState) => ({
  imageActionTypes: state.general.imageActionType
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoadMoreImagesPopup);
