import classNames from 'classnames';
import React from 'react';
import { connect } from 'react-redux';
import { ClipLoader } from 'react-spinners';
import { ImageLoadManager } from '../../../../logic/imageRepository/ImageLoadManager';
import { IRect } from '../../../../interfaces/IRect';
import { ISize } from '../../../../interfaces/ISize';
import { ImageRepository } from '../../../../logic/imageRepository/ImageRepository';
import { AppState } from '../../../../store';
import { updateImageDataById, updateImageStatus } from '../../../../store/labels/actionCreators';
import { ImageData } from '../../../../store/labels/types';
import { FileUtil } from '../../../../utils/FileUtil';
import { RectUtil } from '../../../../utils/RectUtil';
import './ImagePreview.scss';
import { CSSHelper } from '../../../../logic/helpers/CSSHelper';
import { getUrlParam } from '../../../../hooks/useUrlParams';
import { TaskImageStatus } from '../../../../entities/image';
import { QueryParamEnum } from '../../../../data/QueryParam';
import { CircularProgress } from '@mui/material';

interface IProps {
  imageData: ImageData;
  style: React.CSSProperties;
  size: ISize;
  isScrolling?: boolean;
  isChecked?: boolean;
  onClick?: () => any;
  isSelected?: boolean;
  updateImageDataById: (id: string, newImageData: ImageData) => void;
  updateImageStatus: (dtlSeq: string, loginId: string, qcId: string, image: ImageData, status: TaskImageStatus) => void;
  updatingImages: { [key: string]: 1 | 2 | 0 };
}

interface IState {
  image: HTMLImageElement;
}

class ImagePreview extends React.Component<IProps, IState> {
  private isLoading: boolean = false;

  constructor(props) {
    super(props);

    this.state = {
      image: null
    };
  }

  public componentDidMount(): void {
    ImageLoadManager.addAndRun(this.loadImage(this.props.imageData, this.props.isScrolling));
  }

  public componentWillUpdate(nextProps: Readonly<IProps>, nextState: Readonly<IState>, nextContext: any): void {
    if (this.props.imageData.id !== nextProps.imageData.id) {
      if (nextProps.imageData.loadStatus) {
        ImageLoadManager.addAndRun(this.loadImage(nextProps.imageData, nextProps.isScrolling));
      } else {
        this.setState({ image: null });
      }
    }

    if (this.props.isScrolling && !nextProps.isScrolling) {
      ImageLoadManager.addAndRun(this.loadImage(nextProps.imageData, false));
    }
  }

  // shouldComponentUpdate(nextProps: Readonly<IProps>, nextState: Readonly<IState>, nextContext: any): boolean {
  //   return (
  //     // this.props.imageData.id !== nextProps.imageData.id ||
  //     this.state.image !== nextState.image ||
  //     this.props.isSelected !== nextProps.isSelected ||
  //     this.props.isChecked !== nextProps.isChecked
  //   );
  // }

  private loadImage = async (imageData: ImageData, isScrolling: boolean) => {
    if (imageData.loadStatus) {
      const image = ImageRepository.getById(imageData.id);
      if (this.state.image !== image) {
        this.setState({ image });
      }
    } else if (!isScrolling || !this.isLoading) {
      this.isLoading = true;
      const saveLoadedImagePartial = (image: HTMLImageElement) => this.saveLoadedImage(image, imageData);
      FileUtil.loadImage(imageData.fileData)
        .then((image: HTMLImageElement) => saveLoadedImagePartial(image))
        .catch((error) => this.handleLoadImageError());
    }
  };

  private saveLoadedImage = (image: HTMLImageElement, imageData: ImageData) => {
    imageData.loadStatus = true;
    this.props.updateImageDataById(imageData.id, imageData);
    ImageRepository.storeImage(imageData.id, image);
    if (imageData.id === this.props.imageData.id) {
      this.setState({ image });
      this.isLoading = false;
    }
  };

  private getStyle = () => {
    const { size } = this.props;

    const containerRect: IRect = {
      x: 0.15 * size.width,
      y: 0.15 * size.height,
      width: 0.75 * size.width,
      height: 0.75 * size.height
    };

    const imageRect: IRect = {
      x: 0,
      y: 0,
      width: this.state.image.width,
      height: this.state.image.height
    };

    const imageRatio = RectUtil.getRatio(imageRect);
    const imagePosition: IRect = RectUtil.fitInsideRectWithRatio(containerRect, imageRatio);

    return {
      width: imagePosition.width,
      height: imagePosition.height,
      left: imagePosition.x,
      top: imagePosition.y
    };
  };

  private handleLoadImageError = () => {
    // 111
  };
  handleEditStatus = (status: TaskImageStatus) => {
    const image = this.props.imageData;
    const queryData = getUrlParam();
    // const dtlSeq = queryData[QueryParamEnum.DtlSeq] || '1';
    // const userId = queryData[QueryParamEnum.UserID] || 'yanghee';
    // const qcID = queryData[QueryParamEnum.qsID] || 'kdatalabcloud';
    const dtlSeq = queryData[QueryParamEnum.DtlSeq];
    const userId = queryData[QueryParamEnum.UserID];
    const qcID = queryData[QueryParamEnum.qsID];
    this.props.updateImageStatus(dtlSeq, userId, qcID, image, status);

    // this.props.updateImageDataById(this.props.imageData.id, { ...this.props.imageData, status });
  };

  private getClassName = () => {
    return classNames(
      'ImagePreview',
      {
        'selected': this.props.isSelected
      }
    );
  };

  public render() {
    const {
      isChecked,
      style,
      onClick,
      updatingImages
    } = this.props;

    const urlData = getUrlParam();
    const qcID = urlData[QueryParamEnum.qsID];
    const imageData = this.props.imageData;
    const approvedUpdating = updatingImages[imageData.id] === 1
    const rejectedUpdating = updatingImages[imageData.id] === 2

    return (
      <div
        className={this.getClassName()}
        style={style}
        onClick={onClick ? onClick : undefined}
      >
        {(this.state.image) ?
          [
            <div
              className='Foreground'
              key={'Foreground'}
              // style={this.getStyle()}
            >
              <div className='ImageWrapper'>
                <img
                  className='Image'
                  draggable={false}
                  src={this.state.image.src}
                  alt={this.state.image.alt}
                  // style={{ ...this.getStyle(), left: 0, top: 0 }}
                />
                {
                  imageData.status === 'REJECTED' ? <div className='rejected-text'>Rejected</div> : null
                }
                {
                  imageData.status === 'APPROVED' ? <div className='rejected-text'>Approved</div> : null
                }
                <div
                  className='Background'
                  key={'Background'}
                  // style={this.getStyle()}
                />
                {isChecked && <img
                  className='CheckBox'
                  draggable={false}
                  src={'ico/ok.png'}
                  alt={'checkbox'}
                />}
              </div>
              {
                qcID && qcID === imageData.adminID && imageData.status !== 'APPROVED' && (
                  <div className='Image-buttons'>
                    <button onClick={() => this.handleEditStatus('APPROVED')} className='primary'>
                      {
                        approvedUpdating? <CircularProgress sx={{color: '#222'}} size={12} />: 'approve'
                      }
                    </button>
                    <button onClick={() => this.handleEditStatus('REJECTED')} className='danger'>
                      {
                        rejectedUpdating? <CircularProgress sx={{color: '#222'}} size={12} />: 'reject'
                      }
                    </button>
                  </div>
                )
              }

            </div>
            // <div
            //   className='Background'
            //   key={'Background'}
            //   // style={this.getStyle()}
            // />
          ] :
          <ClipLoader
            size={30}
            color={CSSHelper.getLeadingColor()}
            loading={true}
          />}
      </div>);
  }
}

const mapDispatchToProps = {
  updateImageDataById,
  updateImageStatus
};

const mapStateToProps = (state: AppState) => ({
  updatingImages: state.labels.updatingImageIds
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ImagePreview);