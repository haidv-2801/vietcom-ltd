import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { TreeSelect as TreeSelectPrime } from 'primereact/treeselect';
import { buildClass } from '../../../../constants/commonFunction';
import { format } from 'react-string-format';
import './treeSelect.scss';
import { TEXT_FALL_BACK } from '../../../../constants/commonConstant';

TreeSelect.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  options: PropTypes.array,
  value: PropTypes.any,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  hasRequiredLabel: PropTypes.bool,
  filterPlaceholder: PropTypes.string,
  hasFilter: PropTypes.bool,
  prefixValue: PropTypes.any,
};

TreeSelect.defaultProps = {
  id: '',
  className: '',
  style: {},
  options: [],
  value: null,
  onChange: () => {},
  placeholder: 'Nhấp để chọn',
  filterPlaceholder: 'Không có dữ liệu hiển thị',
  hasFilter: false,
  label: '',
  hasRequiredLabel: false,
  prefixValue: null,
};

function TreeSelect(props) {
  const {
    id,
    style,
    className,
    options,
    value,
    onChange,
    placeholder,
    filterPlaceholder,
    hasFilter,
    label,
    hasRequiredLabel,
    prefixValue,
  } = props;

  const nodes = [
    {
      key: '0',
      label: 'Documents',
      data: 'Documents Folder',
      icon: 'pi pi-fw pi-inbox',
      children: [
        {
          key: '0-0',
          label: 'Work',
          data: 'Work Folder',
          icon: 'pi pi-fw pi-cog',
          children: [
            {
              key: '0-0-0',
              label: 'Expenses.doc',
              icon: 'pi pi-fw pi-file',
              data: 'Expenses Document',
            },
            {
              key: '0-0-1',
              label: 'Resume.doc',
              icon: 'pi pi-fw pi-file',
              data: 'Resume Document',
            },
          ],
        },
        {
          key: '0-1',
          label: 'Home',
          data: 'Home Folder',
          icon: 'pi pi-fw pi-home',
          children: [
            {
              key: '0-1-0',
              label: 'Invoices.txt',
              icon: 'pi pi-fw pi-file',
              data: 'Invoices for this month',
            },
          ],
        },
      ],
    },
    {
      key: '1',
      label: 'Events',
      data: 'Events Folder',
      icon: 'pi pi-fw pi-calendar',
      children: [
        {
          key: '1-0',
          label: 'Meeting',
          icon: 'pi pi-fw pi-calendar-plus',
          data: 'Meeting',
        },
        {
          key: '1-1',
          label: 'Product Launch',
          icon: 'pi pi-fw pi-calendar-plus',
          data: 'Product Launch',
        },
        {
          key: '1-2',
          label: 'Report Review',
          icon: 'pi pi-fw pi-calendar-plus',
          data: 'Report Review',
        },
      ],
    },
    {
      key: '2',
      label: 'Movies',
      data: 'Movies Folder',
      icon: 'pi pi-fw pi-star-fill',
      children: [
        {
          key: '2-0',
          icon: 'pi pi-fw pi-star-fill',
          label: 'Al Pacino',
          data: 'Pacino Movies',
          children: [
            {
              key: '2-0-0',
              label: 'Scarface',
              icon: 'pi pi-fw pi-video',
              data: 'Scarface Movie',
            },
            {
              key: '2-0-1',
              label: 'Serpico',
              icon: 'pi pi-fw pi-video',
              data: 'Serpico Movie',
            },
          ],
        },
        {
          key: '2-1',
          label: 'Robert De Niro',
          icon: 'pi pi-fw pi-star-fill',
          data: 'De Niro Movies',
          children: [
            {
              key: '2-1-0',
              label: 'Goodfellas',
              icon: 'pi pi-fw pi-video',
              data: 'Goodfellas Movie',
            },
            {
              key: '2-1-1',
              label: 'Untouchables',
              icon: 'pi pi-fw pi-video',
              data: 'Untouchables Movie',
            },
          ],
        },
      ],
    },
  ];

  const [selectedNodeKey1, setSelectedNodeKey1] = useState(null);

  const customValueTemplate = (data) => {
    let _data = data.length ? data[0] : {};
    return (
      <div
        className={buildClass([
          'p-dropdown-item__value',
          prefixValue && 'p-dropdown-item__value--prefix',
        ])}
      >
        {prefixValue ? (
          <span className="p-dropdown-item__value-prefix">{prefixValue}: </span>
        ) : null}
        <span className="p-dropdown-item__value-display">
          {_data?.label ?? TEXT_FALL_BACK.TYPE_1}
        </span>
      </div>
    );
  };

  return (
    <div className="toe-treeSelect__wrapper">
      {label && (
        <label className="toe-treeSelect__label toe-font-label">
          {label}
          {hasRequiredLabel && <span style={{ color: 'red' }}>*</span>}
        </label>
      )}
      <TreeSelectPrime
        id={id}
        style={style}
        className={buildClass(['toe-treeSelect', 'toe-font-body', className])}
        panelClassName={buildClass([
          'toe-treeSelect-panel',
          'toe-font-body',
          !options.length && 'toe-treeSelect--empty',
        ])}
        valueTemplate={customValueTemplate}
        value={value}
        options={options}
        onChange={onChange}
        filter={hasFilter}
        placeholder={placeholder}
        emptyMessage={filterPlaceholder}
        filterPlaceholder="Nhập giá trị tìm kiếm"
        resetFilterOnHide={true}
        scrollHeight={300}
        filterBy="label"
      />
    </div>
  );
}

export default TreeSelect;
