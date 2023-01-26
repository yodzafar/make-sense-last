import classNames from 'classnames';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import './App.scss';
import { ProjectType } from './data/enums/ProjectType';
import { ISize } from './interfaces/ISize';
import { Settings } from './settings/Settings';
import { PlatformModel } from './staticModels/PlatformModel';
import { AppState } from './store';
import EditorView from './views/EditorView/EditorView';
import MainView from './views/MainView/MainView';
import MobileMainView from './views/MobileMainView/MobileMainView';
import NotificationsView from './views/NotificationsView/NotificationsView';
import PopupView from './views/PopupView/PopupView';
import { SizeItUpView } from './views/SizeItUpView/SizeItUpView';
import { getTaskImages, importAnnotation, importLabels } from './store/remote/actionCreators';
import { TaskImageQuery } from './service/api';
import { useUrlParams } from './hooks/useUrlParams';
import { QueryParamEnum } from './data/QueryParam';
import { updateActivePopupType } from './store/general/actionCreators';
import { PopupWindowType } from './data/enums/PopupWindowType';

interface IProps {
  projectType: ProjectType;
  windowSize: ISize;
  ObjectDetectorLoaded: boolean;
  PoseDetectionLoaded: boolean;
  isAuth: boolean;
  getImages: (data: TaskImageQuery) => void;
  getAnnotations: (dtlSeq: string) => void;
  getLabelOrder: (dtlSeq: string) => void;
  updatePopupType: (type: PopupWindowType) => void;
}

const App: React.FC<IProps> = (
  {
    projectType,
    windowSize,
    ObjectDetectorLoaded,
    PoseDetectionLoaded,
    getAnnotations,
    getImages,
    getLabelOrder
  }) => {
  const { queryData } = useUrlParams();
  // const dtlSeq = queryData[QueryParamEnum.DtlSeq] || '1';
  // const userId = queryData[QueryParamEnum.UserID] || 'yanghee';
  // const qcID = queryData[QueryParamEnum.qsID] || 'kdatalabcloud';
  const dtlSeq = queryData[QueryParamEnum.DtlSeq];
  const userId = queryData[QueryParamEnum.UserID];
  const qcID = queryData[QueryParamEnum.qsID];

  const selectRoute = () => {
    // if (isAuth) {
    if (
      !!PlatformModel.mobileDeviceData.manufacturer &&
      !!PlatformModel.mobileDeviceData.os
    )
      return <MobileMainView />;
    if (!projectType) return <MainView />;
    else {
      if (
        windowSize.height < Settings.EDITOR_MIN_HEIGHT ||
        windowSize.width < Settings.EDITOR_MIN_WIDTH
      ) {
        return <SizeItUpView />;
      } else {
        return <EditorView />;
      }
    }
    // } else {
    //   return <LoginView />;
    // }
  };

  useEffect(() => {
    if (userId && dtlSeq) {
      updateActivePopupType(PopupWindowType.DIRECTORY);
      getImages({
        userId,
        qcCheck: !!qcID,
        dtlSeq
      });
      getLabelOrder(dtlSeq);
    }

  }, [userId, dtlSeq, getAnnotations, getLabelOrder, qcID, updateActivePopupType]);

  return (
    <div
      className={classNames('App', {
        AI: ObjectDetectorLoaded || PoseDetectionLoaded
      })}
      draggable={false}
    >
      {selectRoute()}
      <PopupView />
      <NotificationsView />
    </div>
  );
};

const mapDispatchToProps = {
  getImages: getTaskImages,
  getAnnotations: importAnnotation,
  getLabelOrder: importLabels,
  updatePopupType: updateActivePopupType
};

const mapStateToProps = (state: AppState) => ({
  projectType: state.general.projectData.type,
  windowSize: state.general.windowSize,
  ObjectDetectorLoaded: state.ai.isObjectDetectorLoaded,
  PoseDetectionLoaded: state.ai.isPoseDetectorLoaded,
  isAuth: state.general.isAuth
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
