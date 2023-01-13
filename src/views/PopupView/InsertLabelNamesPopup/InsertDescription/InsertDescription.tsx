import { GenericYesNoPopup } from '../../GenericYesNoPopup/GenericYesNoPopup';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../../../store';
import { LabelName } from '../../../../store/labels/types';
import { Box, Grid, Stack, TextField } from '@mui/material';
import { reject, sample } from 'lodash';
import { LabelUtil } from '../../../../utils/LabelUtil';
import { LabelsSelector } from '../../../../store/selectors/LabelsSelector';
import { LabelActions } from '../../../../logic/actions/LabelActions';
import { PopupWindowType } from '../../../../data/enums/PopupWindowType';
import { updateActivePopupType } from '../../../../store/general/actionCreators';
import { updateLabelNames } from '../../../../store/labels/actionCreators';
import { ProjectType } from '../../../../data/enums/ProjectType';
import { ColorSelectorView } from '../ColorSelectorView/ColorSelectorView';
import { Settings } from '../../../../settings/Settings';
import { PopupActions } from '../../../../logic/actions/PopupActions';

interface IProps {
  labelId: string | null;
  setLabelId: (value: string | null) => void;
  labelNames: LabelName[];
  setLabelNames: (value: LabelName[]) => void;
  isUpdate: boolean;
  updateActivePopupTypeAction: (activePopupType: PopupWindowType) => void;
  updateLabelNamesAction: (labels: LabelName[]) => void;
  enablePerClassColoration: boolean;
  projectType: ProjectType;
  isUpdateItem?: boolean;
}

const InsertDescription = (
  {
    labelNames,
    labelId,
    setLabelNames,
    setLabelId,
    isUpdate,
    enablePerClassColoration,
    updateLabelNamesAction,
    updateActivePopupTypeAction,
    projectType,
    isUpdateItem
  }: IProps) => {
  const [value, setValue] = useState('');

  const labelItem = useMemo(() => labelNames.find(item => item.id === labelId), [labelId, labelNames]);

  useEffect(() => {
    if (labelItem) {
      setValue(labelItem.description);
    }
  }, [labelItem]);

  const onChangeName = useCallback((text, key) => {
    if (labelId) {
      const newLabelNames = labelNames.map((labelName: LabelName) => {
        return labelName.id === labelId ? {
          ...labelName, [key]: text
        } : labelName;
      });

      setLabelNames(newLabelNames);
    }
  }, [labelId]);

  const changeLabelNameColorCallback = () => {
    if (labelId) {
      const newLabelNames = labelNames.map((labelName: LabelName) => {
        return labelName.id === labelId ? { ...labelName, color: sample(Settings.LABEL_COLORS_PALETTE) } : labelName;
      });
      setLabelNames(newLabelNames);
    }
  };

  const renderContent = () => {
    return (
      <Box padding='20px' width='100%'>
        <Grid container rowSpacing={3}>
          {
            isUpdate && isUpdateItem && labelItem && (
              <Grid item xs={12}>
                <Stack direction='row' spacing={2} alignItems='center'>
                  <TextField
                    fullWidth
                    autoFocus
                    value={labelItem.name}
                    variant='standard'
                    label='Insert name'
                    onChange={(e) => onChangeName(e.target.value, 'name')}
                  />
                  {projectType === ProjectType.OBJECT_DETECTION && enablePerClassColoration &&
                    <ColorSelectorView
                      color={labelItem.color}
                      onClick={() => changeLabelNameColorCallback()}
                    />}
                </Stack>
              </Grid>
            )
          }

          <Grid item xs={12}>
            <TextField
              fullWidth
              autoFocus
              multiline
              rows='3'
              value={isUpdate && isUpdateItem ? labelItem?.description || '' : value || ''}
              variant='standard'
              label='Insert Description'
              onChange={(e) => isUpdate && isUpdateItem
                ? onChangeName(e.target.value, 'description')
                : setValue(e.target.value)}
            />
          </Grid>
        </Grid>
      </Box>
    );
  };

  const onUpdateAcceptCallback = () => {
    const nonEmptyLabelNames: LabelName[] = reject(labelNames,
      (labelName: LabelName) => labelName.name.length === 0);
    const missingIds: string[] = LabelUtil.labelNamesIdsDiff(LabelsSelector.getLabelNames(), nonEmptyLabelNames);
    LabelActions.removeLabelNames(missingIds);
    updateLabelNamesAction(nonEmptyLabelNames);
    updateActivePopupTypeAction(null);
  };

  const onAccept = useCallback(() => {
    if (labelId && value.length > 2) {
      if (isUpdate && isUpdateItem) {
        onUpdateAcceptCallback();
      } else {
        const newLabelNames = labelNames.map((labelName: LabelName) => {
          return labelName.id === labelId ? {
            ...labelName, description: value
          } : labelName;
        });

        setLabelNames(newLabelNames);
        setLabelId(null);
      }
    }
  }, [value, labelId, labelNames, setLabelNames, isUpdateItem, isUpdate]);

  const onReject = useCallback(() => {
    if(isUpdate && isUpdateItem) {
      PopupActions.close()
    }else {
      setLabelId(null);
    }
  }, [setLabelId, isUpdate, isUpdateItem]);

  return (
    <GenericYesNoPopup
      title='Label description'
      renderContent={renderContent}
      acceptLabel='Save'
      onAccept={onAccept}
      rejectLabel='Cancel'
      onReject={onReject}
    />
  );
};

const mapDispatchToProps = {
  updateActivePopupTypeAction: updateActivePopupType,
  updateLabelNamesAction: updateLabelNames
};

const mapStateToProps = (state: AppState) => ({
  projectType: state.general.projectData.type,
  enablePerClassColoration: state.general.enablePerClassColoration
});

export default connect(mapStateToProps, mapDispatchToProps)(InsertDescription);