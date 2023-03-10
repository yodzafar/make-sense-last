import { GenericYesNoPopup } from '../GenericYesNoPopup/GenericYesNoPopup';
import React, { useCallback, useState } from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../../store';
import { Grid, Stack, Typography } from '@mui/material';
import { LabelToolkitData } from '../../../data/info/LabelToolkitData';
import { ImageButton } from '../../Common/ImageButton/ImageButton';
import { LabelType } from '../../../data/enums/LabelType';
import './ExportLabelsDbPopup.scss';
import { PopupActions } from '../../../logic/actions/PopupActions';
import { RectLabelDbExporter } from '../../../logic/export-db/RectLabelDbExporter';
import { submitNewNotification } from '../../../store/notifications/actionCreators';
import { INotification } from '../../../store/notifications/types';
import httpClient from '../../../service';
import { NotificationUtil } from '../../../utils/NotificationUtil';
import { NotificationsDataMap } from '../../../data/info/NotificationsData';
import { Notification } from '../../../data/enums/Notification';
import { getUrlParam } from '../../../hooks/useUrlParams';
import { QueryParamEnum } from '../../../data/QueryParam';

interface IProps {
  submitNewNotificationAction: (notification: INotification) => void;
}

const ExportLabelsDbPopup = ({ submitNewNotificationAction }: IProps) => {
  const [labelType, setLabelType] = useState<LabelType>(LabelType.RECT);
  const [loading, setLoading] = useState<boolean>(false);
  const queryData = getUrlParam();
  const dtlSeq = queryData[QueryParamEnum.DtlSeq];

  const renderContent = () => {
    return (
      <div className='ExportDbWrapper'>
        <Grid container justifyContent='center' spacing={3}>
          <Grid item xs={12}>
            <div className='Message'>
              Select label type to export labels.
            </div>
          </Grid>
          {
            LabelToolkitData.slice(1).map(label => (
              <Grid xs={5} item key={label.labelType}>
                <Stack
                  spacing={1}
                  direction='row'
                  alignItems='center'
                  onClick={() => setLabelType(label.labelType)}
                >
                  <ImageButton
                    key={label.labelType}
                    image={label.imageSrc}
                    imageAlt={label.imageAlt}
                    buttonSize={{ width: 40, height: 40 }}
                    padding={20}
                    isActive={labelType === label.labelType}
                    onClick={() => setLabelType(label.labelType)}
                  />
                  <Typography sx={{ color: '#fff' }}>{label.headerText}</Typography>
                </Stack>
              </Grid>
            ))
          }
        </Grid>
      </div>
    );
  };
  //
  // const getExportData = useCallback((): { data: ExportDbObject, param: string } => {
  //   switch (labelType) {
  //     case LabelType.POINT:
  //       return { data: PointLabelDbExporter.export(), param: 'POINT' };
  //     case LabelType.RECT:
  //       return { data: RectLabelDbExporter.export(), param: 'RECTANGLE' };
  //     case LabelType.POLYGON:
  //       return { data: PolygonLabelDbExporter.export(), param: 'POLYGON' };
  //     case LabelType.LINE:
  //       return { data: LineLabelDbExport.export(), param: 'LINE' };
  //     default:
  //       return { data: RectLabelDbExporter.export(), param: 'RECTANGLE' };
  //   }
  // }, [labelType]);

  // const onAccept = useCallback(async () => {
  //   const { data, param } = getExportData();
  //   setLoading(true);
  //   httpClient.post('/api/main', data, { params: { type: param } })
  //     .then(() => {
  //       submitNewNotificationAction(NotificationUtil
  //         .createMessageNotification(NotificationsDataMap[Notification.SUCCESSFUL_EXPORTED_ANNOTATION]));
  //       PopupActions.close();
  //     })
  //     .catch(e => {
  //       submitNewNotificationAction(NotificationUtil
  //         .createErrorNotification(NotificationsDataMap[Notification.UNSUCCESSFUL_EXPORTED_ANNOTATION]));
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // }, [getExportData]);

  const onAccept = useCallback(async () => {
    const data = RectLabelDbExporter.getRectData();
    if (data.length > 0 && dtlSeq) {
      try {
        setLoading(true);
        await httpClient.post('/api/save', data, { params: { dtlSeq} });
        submitNewNotificationAction(NotificationUtil
          .createMessageNotification(NotificationsDataMap[Notification.SUCCESSFUL_EXPORTED_ANNOTATION]));
        PopupActions.close();
      } catch (e) {
        // tslint:disable-next-line:no-console
        console.log(e);
        submitNewNotificationAction(NotificationUtil
          .createErrorNotification(NotificationsDataMap[Notification.UNSUCCESSFUL_EXPORTED_ANNOTATION]));
      } finally {
        setLoading(false);
      }
    }
  }, [dtlSeq]);

  const onReject = useCallback(() => {
    PopupActions.close();
  }, []);

  return (
    <GenericYesNoPopup
      title={'Export annotation to database'}
      renderContent={renderContent}
      acceptLabel={'Export'}
      disableAcceptButton={loading}
      onAccept={onAccept}
      rejectLabel={'Cancel'}
      onReject={onReject}
    />
  );
};

const mapDispatchToProps = {
  submitNewNotificationAction: submitNewNotification
};

const mapStateToProps = (state: AppState) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ExportLabelsDbPopup);