import { connect } from 'react-redux';
import { AppState } from '../../store';
import {
  getImageFromDb,
  getOriginalImage,
  updateRemoteBreadcrumb,
  updateSelectedImage
} from '../../store/remote/actionCreators';
import { useCallback, useEffect, useState } from 'react';
import { ICatalog, IImage } from '../../entities/image';
import { Box, CircularProgress, Grid } from '@mui/material';
import './style.scss';
import { truncateString } from '../../utils/StringUtil';
import Breadcrumb from './Breadcrumb';
import { BreadcrumbType } from '../../store/remote/types';
import cn from 'classnames';

interface IProps {
  selectedImage: { [key: string]: File };
  breadcrumb: BreadcrumbType[];
  getImages: (id?: number) => void;
  imageList: IImage[];
  catalogList: ICatalog[];
  updateBreadcrumb: (b: BreadcrumbType[]) => void;
  getOriginalImg: (img: IImage) => void;
  updateSelectedFile: (files: { [key: string]: File }) => void;
  isLoading: boolean;
}

const LoadImagesFromDb = (
  {
    getImages,
    imageList,
    catalogList,
    breadcrumb,
    updateBreadcrumb,
    selectedImage,
    getOriginalImg,
    updateSelectedFile,
    isLoading
  }: IProps) => {
  const [categoryId, setCategoryId] = useState(undefined);

  const onClickBreadcrumb = useCallback((id: number) => {
    const b = [...breadcrumb].filter(item => item.id !== id);
    setCategoryId(id || undefined);
    if (id) {
      updateBreadcrumb(b);
    } else {
      updateBreadcrumb([]);
    }
  }, [updateBreadcrumb, breadcrumb]);

  const onClickCatalog = useCallback((catalog: ICatalog) => {
    const b = [...breadcrumb];
    b.push({ name: catalog.name, id: catalog.id });
    updateBreadcrumb(b);
    setCategoryId(catalog.id);
  }, [updateBreadcrumb]);

  const onClickImage = useCallback((item: IImage) => {
    if (selectedImage[item.id]) {
      const p = { ...selectedImage };
      delete p[item.id];
      updateSelectedFile(p);
    } else {
      getOriginalImg(item);
    }
  }, [selectedImage]);

  useEffect(() => {
    getImages(categoryId);
  }, [categoryId]);

  return (
    <div className='ImageFromDbWrapper'>
      <Breadcrumb onClick={onClickBreadcrumb} />
      {
        !isLoading && (
          <Grid marginTop={2} container rowSpacing={2}>
            {
              catalogList.map((item) => (
                <Grid item xs={2} key={item.id}>
                  <div className='data-item' onClick={() => onClickCatalog(item)}>
                    <div className='data-item-image'>
                      <div className='icon-folder' />
                    </div>
                    <h6>{truncateString(item.name, 35)}</h6>
                  </div>
                </Grid>
              ))
            }
            {
              imageList.map((item) => (
                <Grid item xs={2} key={item.id}>
                  <div
                    className={cn('data-item', { selected: !!selectedImage[item.id] })}
                    onClick={() => onClickImage(item)}
                  >
                    <div className='data-item-image'>
                      <img src={item.thumbnailFileUrl} alt={item.fileName} />
                    </div>
                    <div>
                      <h6>{truncateString(item.fileName, 35)}</h6>
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
            <CircularProgress sx={{color: '#fff'}} size={48} color='inherit' />
          </Box>
        )
      }
    </div>
  );
};

const mapDispatchToProps = {
  getImages: getImageFromDb,
  updateBreadcrumb: updateRemoteBreadcrumb,
  getOriginalImg: getOriginalImage,
  updateSelectedFile: updateSelectedImage
};

const mapStateToProps = (state: AppState) => ({
  imageList: state.remote.data.images,
  catalogList: state.remote.data.catalogs,
  breadcrumb: state.remote.breadcrumb,
  selectedImage: state.remote.images,
  isLoading: state.remote.loading
});


export default connect(mapStateToProps, mapDispatchToProps)(LoadImagesFromDb);