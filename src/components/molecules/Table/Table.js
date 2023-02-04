import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { PAGEGING } from '../../../constants/commonConstant';
import { buildClass } from '../../../constants/commonFunction';
import PopupSelection from '../../atomics/base/PopupSelectionV1/PopupSelection';
import './table.scss';

Table.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  columns: PropTypes.array,
  data: PropTypes.array,
  configs: PropTypes.object,
  isLoading: PropTypes.bool,
  hasOption: PropTypes.bool,
  options: PropTypes.array,
  rowClassName: PropTypes.func,
  onRowClick: PropTypes.func,
  onRowDoubleClick: PropTypes.func,
};

Table.defaultProps = {
  id: '',
  className: '',
  style: {},
  columns: [],
  data: [],
  configs: {},
  isLoading: false,
  hasOption: false,
  options: [],
  rowClassName: () => {},
  onRowClick: () => {},
  onRowDoubleClick: () => {},
};

function Table(props) {
  const {
    id,
    style,
    className,
    columns,
    data,
    configs,
    isLoading,
    hasOption,
    options,
    rowClassName,
    onRowClick,
    onRowDoubleClick,
  } = props;

  const [showOption, setShowOption] = useState(null);

  const handleShowOption = (e, key) => {
    e.stopPropagation();
    e.preventDefault();
    setShowOption(key);
  };

  const renderColums = () => {
    let _columns = columns;
    if (hasOption && !_columns?.some((_) => _.field === 'option')) {
      _columns.push({
        field: 'option',
        body: (data) => {
          return (
            <PopupSelection
              wrapperClassName="table-option__menu"
              placement="bottomRight"
              options={[...options].map((item) => ({
                ...item,
                key: data[configs?.dataKey],
              }))}
              onChange={() => {}}
            >
              <div
                className="toe-font-body table-option"
                onClick={(e) => {
                  handleShowOption(e, data[configs?.dataKey]);
                }}
              >
                <i className="pi pi-ellipsis-v"></i>
              </div>
            </PopupSelection>
          );
        },
        style: { width: 60, maxWidth: 60 },
      });
    }
    return columns?.map((col, _) => {
      return (
        <Column
          {...col}
          key={col.field}
          maxConstraints={300}
          className="toe-font-label toe-table__th"
        />
      );
    });
  };

  const paginatorLeft = (
    <Button
      type="button"
      icon="pi pi-refresh"
      className="p-button-text toe-refresh-button"
      style={{ width: 30, height: 30 }}
    />
  );
  const paginatorRight = (
    <Button type="button" icon="pi pi-cloud" className="p-button-text" />
  );

  return (
    <div
      id={id}
      style={style}
      className={buildClass(['toe-table', 'toe-font-body', className])}
    >
      <div className="card">
        <DataTable
          {...configs}
          value={data}
          rowHover
          responsiveLayout="scroll"
          paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
          paginatorClassName="toe-font-label toe-pagination"
          paginator={false}
          rowsPerPageOptions={PAGEGING}
          emptyMessage="Không có dữ liệu hiển thị"
          rowClassName={rowClassName}
          onRowClick={onRowClick}
          onRowDoubleClick={onRowDoubleClick}
        >
          {renderColums()}
        </DataTable>
      </div>
    </div>
  );
}

export default Table;
