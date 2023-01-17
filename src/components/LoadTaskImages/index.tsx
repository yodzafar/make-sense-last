import { connect } from 'react-redux';
import { AppState } from 'src/store';
import { getOriginalImage, getTaskImages, updateSelectedImage } from '../../store/remote/actionCreators';
import { ITaskImage } from '../../entities/image';
import { useCallback, useEffect } from 'react';
import { Box, CircularProgress, Grid } from '@mui/material';
import { truncateString } from '../../utils/StringUtil';
import cn from 'classnames';
import './style.scss';

interface IProps {
  selectedImage: { [key: string]: File };
  getImages: (TaskImageQuery) => void;
  imageList: ITaskImage[];
  getOriginalImg: (img: ITaskImage) => void;
  updateSelectedFile: (files: { [key: string]: File }) => void;
  isLoading: boolean;
}

const LoadTaskImages = (
  {
    getImages,
    isLoading,
    imageList,
    selectedImage,
    updateSelectedFile,
    getOriginalImg
  }: IProps) => {

  const onClickImage = useCallback((item: ITaskImage) => {
    if (selectedImage[item.dtlSeq]) {
      const p = { ...selectedImage };
      delete p[item.attSeq];
      updateSelectedFile(p);
    } else {
      getOriginalImg(item);
    }
  }, [selectedImage]);

  useEffect(() => {
    getImages({
      userId: 'yanghee',
      qcCheck: true,
      dtlSeq: 1
    });
  }, []);

  return <div className='ImageFromDbWrapper'>
    {
      !isLoading && (
        <Grid marginTop={2} container rowSpacing={2}>
          {
            imageList.map((item, idx) => (
              <Grid item xs={2} key={idx}>
                <div
                  className={cn('data-item', { selected: !!selectedImage[item.attSeq] })}
                  onClick={() => onClickImage(item)}
                >
                  <div className='data-item-image'>
                    <img src={item.path} alt={item.name} />
                  </div>
                  <div>
                    <h6>{truncateString(item.name, 35)}</h6>
                  </div>
                </div>
              </Grid>
            ))
          }
        </Grid>
      )
    }
    {
      isLoading && (
        <Box
          height={200}
          sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
        >
          <CircularProgress sx={{ color: '#fff' }} size={48} color='inherit' />
        </Box>
      )
    }
  </div>;
};

const mapDispatchToProps = {
  getImages: getTaskImages,
  getOriginalImg: getOriginalImage,
  updateSelectedFile: updateSelectedImage
};

const mapStateToProps = (state: AppState) => ({
  imageList: state.remote.data,
  selectedImage: state.remote.images,
  isLoading: state.remote.loading
});

export default connect(mapStateToProps, mapDispatchToProps)(LoadTaskImages);
