import React from 'react';
import { ISize } from '../../../../interfaces/ISize';
import Scrollbars from 'react-custom-scrollbars-2';
import {
  ImageData,
  LabelName,
  LabelPolygon,
} from '../../../../store/labels/types';
import './PolygonLabelsList.scss';
import {
  updateActiveLabelId,
  updateActiveLabelNameId,
  updateImageDataById,
} from '../../../../store/labels/actionCreators';
import { AppState } from '../../../../store';
import { connect } from 'react-redux';
import LabelInputField from '../LabelInputField/LabelInputField';
import EmptyLabelList from '../EmptyLabelList/EmptyLabelList';
import { LabelActions } from '../../../../logic/actions/LabelActions';
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

const PolygonLabelsList: React.FC<IProps> = ({
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
    height: size.height,
  };
  const listStyleContent: React.CSSProperties = {
    width: size.width,
    height: (imageData?.labelPolygons?.length || 1) * labelInputFieldHeight,
  };

  const deletePolygonLabelById = (labelPolygonId: string) => {
    LabelActions.deletePolygonLabelById(imageData.id, labelPolygonId);
  };

  const togglePolygonLabelVisibilityById = (labelPolygonId: string) => {
    LabelActions.toggleLabelVisibilityById(imageData.id, labelPolygonId);
  };

  const updatePolygonLabel = (labelPolygonId: string, labelNameId: string) => {
    const newImageData = {
      ...imageData,
      labelPolygons: imageData.labelPolygons.map(
        (currentLabel: LabelPolygon) => {
          if (currentLabel.id === labelPolygonId) {
            return {
              ...currentLabel,
              labelId: labelNameId,
            };
          }
          return currentLabel;
        }
      ),
    };
    updateImageDataByIdAction(imageData.id, newImageData);
    updateActiveLabelNameIdAction(labelNameId);
  };

  // const onClickHandler = () => {
  //   updateActiveLabelIdAction(null);
  // };

  const onEdit = (id: string) => {
    changeActivePopupType(PopupWindowType.UPDATE_LABEL_ITEM);
    updateActiveLabelNameIdAction(id);
  };

  const getChildren = () => {
    return imageData?.labelPolygons?.map((labelPolygon: LabelPolygon) => {
      return (
        <LabelInputField
          size={{
            width: size.width,
            height: labelInputFieldHeight,
          }}
          onEdit={() => onEdit(labelPolygon.labelId)}
          isActive={labelPolygon.id === activeLabelId}
          isHighlighted={labelPolygon.id === highlightedLabelId}
          isVisible={labelPolygon.isVisible}
          id={labelPolygon.id}
          key={labelPolygon.id}
          onDelete={deletePolygonLabelById}
          value={
            labelPolygon.labelId !== null
              ? findLast(labelNames, { id: labelPolygon.labelId })
              : null
          }
          options={labelNames}
          onSelectLabel={updatePolygonLabel}
          toggleLabelVisibility={togglePolygonLabelVisibilityById}
        />
      );
    });
  };

  return (
    <div
      className='PolygonLabelsList'
      style={listStyle}
      // onClickCapture={onClickHandler}
    >
      {imageData?.labelPolygons?.length === 0 ? (
        <EmptyLabelList
          labelBefore={'draw your first polygon'}
          labelAfter={'no labels created for this image yet'}
        />
      ) : (
        <Scrollbars>
          <div className='PolygonLabelsListContent' style={listStyleContent}>
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
  labelNames: state.labels.labels,
});

export default connect(mapStateToProps, mapDispatchToProps)(PolygonLabelsList);
