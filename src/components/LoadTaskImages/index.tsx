import { connect } from 'react-redux';
import { AppState } from 'src/store';
import { getOriginalImage, updateSelectedImage } from '../../store/remote/actionCreators';
import { ITaskImage } from '../../entities/image';
import { useCallback } from 'react';
import { Box, CircularProgress, Grid } from '@mui/material';
import { truncateString } from '../../utils/StringUtil';
import cn from 'classnames';
import './style.scss';

interface IProps {
  selectedImage: { [key: string]: File };
  imageList: ITaskImage[];
  getOriginalImg: (img: ITaskImage) => void;
  updateSelectedFile: (files: { [key: string]: File }) => void;
  isLoading: boolean;
}

const LoadTaskImages = (
  {
    isLoading,
    imageList,
    selectedImage,
    updateSelectedFile,
    getOriginalImg
  }: IProps) => {

  const onClickImage = useCallback((item: ITaskImage) => {
    if (selectedImage[item.attSeq]) {
      const p = { ...selectedImage };
      delete p[item.attSeq];
      updateSelectedFile(p);
    } else {
      getOriginalImg(item);
    }
  }, [selectedImage]);


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
                    <img src={item.url} alt={item.name} />
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
  getOriginalImg: getOriginalImage,
  updateSelectedFile: updateSelectedImage
};

const mapStateToProps = (state: AppState) => ({
  imageList: state.remote.data,
  selectedImage: state.remote.images,
  isLoading: state.remote.loading
});

export default connect(mapStateToProps, mapDispatchToProps)(LoadTaskImages);
