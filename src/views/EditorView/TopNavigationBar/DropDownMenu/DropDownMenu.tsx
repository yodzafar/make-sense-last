import React, { useState } from 'react';
import classNames from 'classnames';
import './DropDownMenu.scss';
import { DropDownMenuData, DropDownMenuNode } from '../../../../data/info/DropDownMenuData';
import { EventType } from '../../../../data/enums/EventType';
import { updatePreventCustomCursorStatus } from '../../../../store/general/actionCreators';
import { AppState } from '../../../../store';
import { connect } from 'react-redux';
import { ImageActionType } from '../../../../store/general/types';
import { QueryParamEnum } from '../../../../data/QueryParam';
import { useUrlParams } from '../../../../hooks/useUrlParams';

interface IProps {
  updatePreventCustomCursorStatusAction: (preventCustomCursor: boolean) => never;
  isHasImages: boolean,
  imageActionType: ImageActionType
}

const DropDownMenu: React.FC<IProps> = ({ updatePreventCustomCursorStatusAction, imageActionType, isHasImages }) => {
  const topAnchor = 35;
  const { queryData } = useUrlParams();
  const qcID = queryData[QueryParamEnum.qsID] ;

  const [activeTabIdx, setActiveTabIdx] = useState(null);
  const [activeDropDownAnchor, setDropDownAnchor] = useState(null);

  const onMouseDownBeyondDropDown = (event) => {
    if (event.target.classList.contains('DropDownMenuTab') || event.target.classList.contains('DropDownMenuContentOption')) {
      return;
    }
    setActiveTabIdx(null);
    document.removeEventListener(EventType.MOUSE_DOWN, onMouseDownBeyondDropDown);
  };

  const onTabClick = (tabIdx: number, event) => {
    if (activeTabIdx === null) {
      document.addEventListener(EventType.MOUSE_DOWN, onMouseDownBeyondDropDown);
    }

    if (activeTabIdx === tabIdx) {
      setActiveTabIdx(null);
      setDropDownAnchor(null);
    } else {
      setActiveTabIdx(tabIdx);
      setDropDownAnchor({ x: event.target.offsetLeft, y: topAnchor });
    }
  };

  const onMouseEnterWindow = () => {
    updatePreventCustomCursorStatusAction(true);
  };

  const onMouseLeaveWindow = () => {
    updatePreventCustomCursorStatusAction(false);
  };

  const onMouseEnterTab = (tabIdx: number, event) => {
    if (activeTabIdx !== null && activeTabIdx !== tabIdx) {
      setActiveTabIdx(tabIdx);
      setDropDownAnchor({ x: event.target.offsetLeft, y: topAnchor });
    }
  };

  const getDropDownMenuTabClassName = (tabIdx: number) => {
    return classNames(
      'DropDownMenuTab',
      { 'active': tabIdx === activeTabIdx }
    );
  };

  const getDropDownMenuContentOption = (disabled: boolean) => {
    return classNames(
      'DropDownMenuContentOption',
      { 'active': !disabled, disabled }
    );
  };

  const getDropDownTab = (data: DropDownMenuNode, index: number) => {
    return <div
      className={getDropDownMenuTabClassName(index)}
      key={index}
      onClick={(event) => onTabClick(index, event)}
      onMouseEnter={(event) => onMouseEnterTab(index, event)}
    >
      <img
        draggable={false}
        src={data.imageSrc}
        alt={data.imageAlt}
      />
      {data.name}
    </div>;
  };

  const getDropDownContent = () => {
    return DropDownMenuData.map((data: DropDownMenuNode, index: number) => getDropDownTab(data, index));
  };

  const wrapOnClick = (onClick?: () => void, disabled?: boolean): () => void => {
    return () => {
      if (disabled) return;
      if (onClick) onClick();
      setActiveTabIdx(null);
      updatePreventCustomCursorStatusAction(false);
      document.removeEventListener(EventType.MOUSE_DOWN, onMouseDownBeyondDropDown);
    };
  };

  const getDisabled = (item: DropDownMenuNode): boolean => {
    if (!!item.actionType && item.disabled) {
      if (!isHasImages) {
        return true;
      }
      return item.actionType !== imageActionType || !!qcID;
    }
    return false;
  };

  const getDropDownWindow = (data: DropDownMenuNode) => {
    if (activeTabIdx !== null) {
      const style: React.CSSProperties = {
        top: 35,
        left: activeDropDownAnchor.x,
        height: 40 * data.children.length + 10
      };
      return <div
        className={'DropDownMenuContent'}
        style={style}
        onMouseEnter={onMouseEnterWindow}
        onMouseLeave={onMouseLeaveWindow}
      >
        {data.children.map((element: DropDownMenuNode, index: number) => {
          return (
            <div className={getDropDownMenuContentOption(element.getDisabled(getDisabled(element)))}
                 onClick={wrapOnClick(element.onClick, element.getDisabled(getDisabled(element)))}
                 key={index}
            >
              <div className='Marker' />
              <img src={element.imageSrc} alt={element.imageAlt} />
              {element.name}
            </div>
          );
        })}
      </div>;
    } else {
      return null;
    }
  };

  return (<div className='DropDownMenuWrapper'>
    <>
      {getDropDownContent()}
      {getDropDownWindow(DropDownMenuData[activeTabIdx])}
    </>
  </div>);
};

const mapDispatchToProps = {
  updatePreventCustomCursorStatusAction: updatePreventCustomCursorStatus
};

const mapStateToProps = (state: AppState) => ({
  isHasImages: state.labels.imagesData.length > 0,
  imageActionType: state.general.imageActionType
});

// @ts-ignore
export default connect(mapStateToProps, mapDispatchToProps)(DropDownMenu);
