import { Breadcrumbs, Link, Typography } from '@mui/material';
import { connect } from 'react-redux';
import { AppState } from '../../../store';
import { BreadcrumbType } from '../../../store/remote/types';
import { useMemo } from 'react';

type IProps = {
  breadcrumb: BreadcrumbType[],
  onClick: (id: number) => void
}

const BreadcrumbUI = ({ breadcrumb, onClick }: IProps) => {
  const links = useMemo(() => breadcrumb.length > 0 && breadcrumb.slice(0, breadcrumb.length - 1), [breadcrumb]);
  const title = useMemo(() => breadcrumb.length > 0 && breadcrumb.at(-1), [breadcrumb]);

  return (
    <div className='Breadcrumb'>
      <Breadcrumbs aria-label='breadcrumb'>
        <Link onClick={() => onClick(0)} underline='hover' color='inherit'>Root</Link>
        {
          links.length > 0
            ? links.map((item) => (
              <Link key={item.id} onClick={() => onClick(0)} underline='hover' color='inherit'>{item.name}</Link>
            ))
            : null
        }
        {
          title ? <Typography color='text.primary'>{title.name}</Typography> : null
        }
      </Breadcrumbs>
    </div>
  );
};
const mapStateToProps = (state: AppState) => ({
  breadcrumb: state.remote.breadcrumb
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(BreadcrumbUI);