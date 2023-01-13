import React, { useState } from 'react';
import './LabelControlPanel.scss';
import { updatePreventCustomCursorStatus } from '../../../store/general/actionCreators';
import { AppState } from '../../../store';
import { connect } from 'react-redux';
import { IPoint } from '../../../interfaces/IPoint';
import classNames from 'classnames';
import { ImageData, LabelName, LabelPoint, LabelRect } from '../../../store/labels/types';
import { ImageButton } from '../../Common/ImageButton/ImageButton';
import { LabelActions } from '../../../logic/actions/LabelActions';
import { LabelStatus } from '../../../data/enums/LabelStatus';
import { updateImageDataById } from '../../../store/labels/actionCreators';
import { findLast } from 'lodash';
import { LabelsSelector } from '../../../store/selectors/LabelsSelector';

interface IProps {
  position: IPoint;
  updateCustomCursorStatus: (preventCustomCursor: boolean) => void;
  activeLabelId: string;
  highlightedLabelId: string;
  labelData: LabelRect | LabelPoint;
  imageData: ImageData;
  updateImgDataById: (id: string, newImageData: ImageData) => void;
}

const LabelControlPanel: React.FC<IProps> = (
  {
    position,
    updateCustomCursorStatus,
    activeLabelId,
    highlightedLabelId,
    labelData,
    imageData,
    updateImgDataById
  }) => {
  const [isActive, setIsActiveStatus] = useState(false);

  const onMouseEnter = () => {
    updateCustomCursorStatus(true);
    setIsActiveStatus(true);
  };

  const onMouseLeave = () => {
    updateCustomCursorStatus(false);
    setIsActiveStatus(false);
  };

  const onAccept = () => {
    const newImageData = {
      ...imageData,
      labelRects: imageData.labelRects.map((labelRect: LabelRect) => {
        if (labelRect.id === labelData.id) {
          const labelName: LabelName = findLast(LabelsSelector.getLabelNames(), { name: labelRect.suggestedLabel });
          return {
            ...labelRect,
            status: LabelStatus.ACCEPTED,
            labelId: labelName ? labelName.id : labelRect.labelId
          };
        } else {
          return labelRect;
        }
      }),
      labelPoints: imageData.labelPoints.map((labelPoint: LabelPoint) => {
        if (labelPoint.id === labelData.id) {
          const labelName: LabelName = findLast(LabelsSelector.getLabelNames(), { name: labelPoint.suggestedLabel });
          return {
            ...labelPoint,
            status: LabelStatus.ACCEPTED,
            labelId: labelName ? labelName.id : labelPoint.labelId
          };
        } else {
          return labelPoint;
        }
      })
    };
    updateImgDataById(imageData.id, newImageData);
    updatePreventCustomCursorStatus(false);
  };

  const onReject = () => {
    LabelActions.deleteImageLabelById(imageData.id, labelData.id);
    updatePreventCustomCursorStatus(false);
  };

  const isPanelActive = () => {
    return isActive || labelData.id === activeLabelId || labelData.id === highlightedLabelId;
  };

  const getClassName = () => {
    return classNames(
      'LabelControlPanel', {
        'is-active': isPanelActive()
      }
    );
  };

  return <div
    className={getClassName()}
    style={{ top: position.y, left: position.x }}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    {isPanelActive() && <>
      <ImageButton
        image={'ico/plus.png'}
        imageAlt={'plus'}
        buttonSize={{ width: 30, height: 30 }}
        padding={15}
        onClick={onAccept}
      />
      <ImageButton
        image={'ico/trash.png'}
        imageAlt={'trash'}
        buttonSize={{ width: 30, height: 30 }}
        padding={15}
        onClick={onReject}
      />
      {labelData.suggestedLabel && LabelActions.labelExistsInLabelNames(labelData.suggestedLabel) ?
        <div className='SuggestedLabel'>
          {labelData.suggestedLabel}
        </div> :
        null
      }
    </>}
  </div>;
};

const mapDispatchToProps = {
  updateCustomCursorStatus: updatePreventCustomCursorStatus,
  updateImgDataById: updateImageDataById
};

const mapStateToProps = (state: AppState) => ({
  activeLabelId: state.labels.activeLabelId,
  highlightedLabelId: state.labels.highlightedLabelId
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LabelControlPanel);