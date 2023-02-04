import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { buildClass } from '../../../constants/commonFunction';
import { Pagination } from 'antd';
import { PAGEGING } from '../../../constants/commonConstant';
import './paginatorAntd.scss';

PaginatorAntd.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  pageSize: PropTypes.oneOf(PAGEGING),
  page: PropTypes.number,
  totalRecords: PropTypes.number,
  onChange: PropTypes.func,
};

PaginatorAntd.defaultProps = {
  id: '',
  className: '',
  style: {},
  options: [],
  pageSize: 10,
  page: 1,
  pageSize: 20,
  totalRecords: 0,
  onChange: () => {},
};

function PaginatorAntd(props) {
  const { id, style, className, pageSize, page, totalRecords, onChange } =
    props;

  return (
    <Pagination
      id={id}
      style={style}
      className={buildClass(['toe-paging-antd', className])}
      defaultCurrent={page}
      onChange={onChange}
      total={totalRecords}
      pageSize={pageSize}
    />
  );
}

export default PaginatorAntd;
