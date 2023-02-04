import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { PAGEGING } from '../../../constants/commonConstant';
import { Paginator as PaginatorPrime } from 'primereact/paginator';
import { buildClass } from '../../../constants/commonFunction';
import './paginator.scss';
import Dropdown from '../Dropdown/Dropdown';

Paginator.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  pageSize: PropTypes.oneOf(PAGEGING),
  page: PropTypes.number,
  totalRecords: PropTypes.number,
  onChange: PropTypes.func,
  hasChangePageSize: PropTypes.bool,
  hasShowLeftInfo: PropTypes.bool,
};

Paginator.defaultProps = {
  id: '',
  className: '',
  style: {},
  pageSize: 10,
  page: 1,
  hasChangePageSize: true,
  hasShowLeftInfo: true,
  totalRecords: 0,
  onChange: () => {},
};

function Paginator(props) {
  const {
    id,
    style,
    className,
    pageSize,
    page,
    totalRecords,
    onChange,
    hasChangePageSize,
    hasShowLeftInfo,
  } = props;

  let from = pageSize * (page - 1) + 1,
    to = Math.min(totalRecords, pageSize * page);

  from = Math.min(from, to);

  return (
    <PaginatorPrime
      style={style}
      className={buildClass(['toe-paginator', 'toe-font-body', className])}
      first={(page - 1) * pageSize}
      rows={pageSize}
      leftContent={
        hasShowLeftInfo
          ? !totalRecords
            ? null
            : `Hiển thị ${from}-${to}/${totalRecords} bản ghi`
          : null
      }
      rightContent={
        hasChangePageSize ? (
          !totalRecords ? null : (
            <Dropdown
              className="dropdown-paginator"
              defaultValue={pageSize}
              options={PAGEGING.map((_) => ({
                label: 'Hiển thị ' + _ + ' trang',
                value: _,
              }))}
              onChange={(data) => onChange({ page, pageSize: data.value })}
            />
          )
        ) : null
      }
      totalRecords={Math.max(0, totalRecords)}
      rowsPerPageOptions={PAGEGING}
      onPageChange={(data) => {
        onChange({ page: data.page + 1, pageSize: data.rows });
      }}
    />
  );
}

export default Paginator;
