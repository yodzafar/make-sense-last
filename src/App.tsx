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

interface IProps {
  projectType: ProjectType;
  windowSize: ISize;
  ObjectDetectorLoaded: boolean;
  PoseDetectionLoaded: boolean;
  isAuth: boolean;
  getImages: (data: TaskImageQuery) => void;
  getAnnotations: (dtlSeq: string) => void;
  getLabelOrder: (dtlSeq: string) => void;
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
  const dtlSeq = queryData[QueryParamEnum.DtlSeq] || '1';
  const userId = queryData[QueryParamEnum.UserID] || 'yanghee';
  const isAdmin = !!queryData[QueryParamEnum.IsAdmin];

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
      getImages({
        userId,
        qcCheck: isAdmin,
        dtlSeq
      });
      getAnnotations(dtlSeq);
      getLabelOrder(dtlSeq);
    }

    // const rectX: number = 0.5026041666666666;
    // const rectY: number = 0.47870370370370374;
    // const rectWidth: number = 0.15520833333333334;
    // const rectHeight: number = 0.37962962962962965;
    // const rect = {
    //   x: (rectX - rectWidth / 2) * 1980,
    //   y: (rectY - rectHeight / 2) * 1080,
    //   width: rectWidth * 1980,
    //   height: rectHeight * 1080
    // };

    // console.log(rect);
    // console.log(LabelUtil.createLabelRect('1', rect));
  }, [userId, dtlSeq, getAnnotations, getLabelOrder, isAdmin]);

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
  getLabelOrder: importLabels
};

const mapStateToProps = (state: AppState) => ({
  projectType: state.general.projectData.type,
  windowSize: state.general.windowSize,
  ObjectDetectorLoaded: state.ai.isObjectDetectorLoaded,
  PoseDetectionLoaded: state.ai.isPoseDetectorLoaded,
  isAuth: state.general.isAuth
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
