import React, { useEffect, useState } from 'react';
import './InsertLabelNamesPopup.scss';
import { AppState } from '../../../store';
import { connect } from 'react-redux';
import InsertDescription from './InsertDescription/InsertDescription';
import InsertLabelMain from './InsertLabelMain/InsertLabelMain';
import { LabelsSelector } from '../../../store/selectors/LabelsSelector';
import { LabelName } from '../../../store/labels/types';

interface IProps {
  isUpdate: boolean;
  labels: LabelName[],
  activeLabelId: string
  isUpdateItem?: boolean
}

const InsertLabelNamesPopup = ({ isUpdate, labels, activeLabelId, isUpdateItem }: IProps) => {
  const [labelId, setLabelId] = useState<null | string>(null);
  const [labelNames, setLabelNames] = useState(LabelsSelector.getLabelNames());

  useEffect(() => {
    if (isUpdate && activeLabelId && labels.length > 0 && isUpdateItem) {
      setLabelNames(labels);
      setLabelId(activeLabelId);
    }
  }, [isUpdate, activeLabelId, labels, isUpdateItem]);

  return (
    <>
      {
        labelId
          ? <InsertDescription
            labelNames={labelNames}
            setLabelNames={setLabelNames}
            labelId={labelId}
            setLabelId={setLabelId}
            isUpdate={isUpdate}
            isUpdateItem={isUpdateItem}
          />
          : <InsertLabelMain
            labelNames={labelNames}
            setLabelNames={setLabelNames}
            setLabelId={setLabelId}
            isUpdate={isUpdate}
          />
      }
    </>
  );
};

const mapDispatchToProps = {};

const mapStateToProps = (state: AppState) => ({
  labels: state.labels.labels,
  activeLabelId: state.labels.activeLabelNameId
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InsertLabelNamesPopup);
