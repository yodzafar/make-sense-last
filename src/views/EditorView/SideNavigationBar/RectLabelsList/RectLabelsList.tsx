import React from 'react';
import { ISize } from '../../../../interfaces/ISize';
import Scrollbars from 'react-custom-scrollbars-2';
import { ImageData, LabelName, LabelRect } from '../../../../store/labels/types';
import './RectLabelsList.scss';
import {
  updateActiveLabelId,
  updateActiveLabelNameId,
  updateImageDataById
} from '../../../../store/labels/actionCreators';
import { AppState } from '../../../../store';
import { connect } from 'react-redux';
import LabelInputField from '../LabelInputField/LabelInputField';
import EmptyLabelList from '../EmptyLabelList/EmptyLabelList';
import { LabelActions } from '../../../../logic/actions/LabelActions';
import { LabelStatus } from '../../../../data/enums/LabelStatus';
import { findLast } from 'lodash';
import { updateActivePopupType } from '../../../../store/general/actionCreators';
import { PopupWindowType } from '../../../../data/enums/PopupWindowType';

interface IProps {
  size: ISize;
  imageData: ImageData;
  updateImageDataByIdAction: (id: string, newImageData: ImageData) => void;
  activeLabelId: string;
  highlightedLabelId: string;
  updateActiveLabelNameIdAction: (activeLabelId: string) => void;
  labelNames: LabelName[];
  updateActiveLabelIdAction: (activeLabelId: string) => void;
  changeActivePopupType: (type: PopupWindowType) => void;
}

const RectLabelsList: React.FC<IProps> = (
  {
    size,
    imageData,
    updateImageDataByIdAction,
    labelNames,
    updateActiveLabelNameIdAction,
    activeLabelId,
    highlightedLabelId,
    updateActiveLabelIdAction,
    changeActivePopupType
  }) => {
  const labelInputFieldHeight = 40;
  const listStyle: React.CSSProperties = {
    width: size.width,
    height: size.height
  };
  const listStyleContent: React.CSSProperties = {
    width: size.width,
    height: (imageData?.labelRects?.length || 1) * labelInputFieldHeight
  };

  const deleteRectLabelById = (labelRectId: string) => {
    LabelActions.deleteRectLabelById(imageData.id, labelRectId);
  };

  const toggleRectLabelVisibilityById = (labelRectId: string) => {
    LabelActions.toggleLabelVisibilityById(imageData.id, labelRectId);
  };

  const updateRectLabel = (labelRectId: string, labelNameId: string) => {
    const newImageData = {
      ...imageData,
      labelRects: imageData.labelRects.map((labelRect: LabelRect) => {
        if (labelRect.id === labelRectId) {
          return {
            ...labelRect,
            labelId: labelNameId,
            status: LabelStatus.ACCEPTED
          };
        } else {
          return labelRect;
        }
      })
    };
    updateImageDataByIdAction(imageData.id, newImageData);
    updateActiveLabelNameIdAction(labelNameId);
  };

  const onClickHandler = () => {
    updateActiveLabelIdAction(null);
  };

  const onEdit = (id: string) => {
    changeActivePopupType(PopupWindowType.UPDATE_LABEL_ITEM);
    updateActiveLabelNameIdAction(id);
  };

  const getChildren = () => {
    return imageData?.labelRects
      ?.filter(
        (labelRect: LabelRect) => labelRect.status === LabelStatus.ACCEPTED
      )
      .map((labelRect: LabelRect) => {
        return (
          <LabelInputField
            size={{
              width: size.width,
              height: labelInputFieldHeight
            }}
            onEdit={() => onEdit(labelRect.labelId)}
            isActive={labelRect.id === activeLabelId}
            isHighlighted={labelRect.id === highlightedLabelId}
            isVisible={labelRect.isVisible}
            id={labelRect.id}
            key={labelRect.id}
            onDelete={deleteRectLabelById}
            value={
              labelRect.labelId !== null
                ? findLast(labelNames, { id: labelRect.labelId })
                : null
            }
            options={labelNames}
            onSelectLabel={updateRectLabel}
            toggleLabelVisibility={toggleRectLabelVisibilityById}
          />
        );
      });
  };

  return (
    <div
      className='RectLabelsList'
      style={listStyle}
      // onClickCapture={onClickHandler}
    >
      {imageData?.labelRects?.filter(
        (labelRect: LabelRect) => labelRect.status === LabelStatus.ACCEPTED
      ).length === 0 ? (
        <EmptyLabelList
          labelBefore={'draw your first bounding box'}
          labelAfter={'no labels created for this image yet'}
        />
      ) : (
        <Scrollbars>
          <div className='RectLabelsListContent' style={listStyleContent}>
            {getChildren()}
          </div>
        </Scrollbars>
      )}
    </div>
  );
};

const mapDispatchToProps = {
  updateImageDataByIdAction: updateImageDataById,
  updateActiveLabelNameIdAction: updateActiveLabelNameId,
  updateActiveLabelIdAction: updateActiveLabelId,
  changeActivePopupType: updateActivePopupType
};

const mapStateToProps = (state: AppState) => ({
  activeLabelId: state.labels.activeLabelId,
  highlightedLabelId: state.labels.highlightedLabelId,
  labelNames: state.labels.labels
});

export default connect(mapStateToProps, mapDispatchToProps)(RectLabelsList);
