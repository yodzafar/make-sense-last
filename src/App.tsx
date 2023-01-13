import React from 'react';
import './App.scss';
import EditorView from './views/EditorView/EditorView';
import MainView from './views/MainView/MainView';
import { ProjectType } from './data/enums/ProjectType';
import { AppState } from './store';
import { connect } from 'react-redux';
import PopupView from './views/PopupView/PopupView';
import MobileMainView from './views/MobileMainView/MobileMainView';
import { ISize } from './interfaces/ISize';
import { Settings } from './settings/Settings';
import { SizeItUpView } from './views/SizeItUpView/SizeItUpView';
import { PlatformModel } from './staticModels/PlatformModel';
import classNames from 'classnames';
import NotificationsView from './views/NotificationsView/NotificationsView';
import LoginView from './views/LoginView/LoginView';

interface IProps {
  projectType: ProjectType;
  windowSize: ISize;
  ObjectDetectorLoaded: boolean;
  PoseDetectionLoaded: boolean;
  isAuth: boolean;
}

const App: React.FC<IProps> = ({
  projectType,
  windowSize,
  ObjectDetectorLoaded,
  PoseDetectionLoaded,
  isAuth,
}) => {
  const selectRoute = () => {
    if (isAuth) {
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
    } else {
      return <LoginView />;
    }
  };

  return (
    <div
      className={classNames('App', {
        AI: ObjectDetectorLoaded || PoseDetectionLoaded,
      })}
      draggable={false}
    >
      {selectRoute()}
      <PopupView />
      <NotificationsView />
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  projectType: state.general.projectData.type,
  windowSize: state.general.windowSize,
  ObjectDetectorLoaded: state.ai.isObjectDetectorLoaded,
  PoseDetectionLoaded: state.ai.isPoseDetectorLoaded,
  isAuth: state.general.isAuth,
});

export default connect(mapStateToProps)(App);
