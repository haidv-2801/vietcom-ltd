import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Dropdown as DropdownPrime } from 'primereact/dropdown';
import { buildClass } from '../../../constants/commonFunction';
import './dropdown.scss';
import { TEXT_FALL_BACK } from '../../../constants/commonConstant';

Dropdown.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  wrapperClass: PropTypes.string,
  style: PropTypes.object,
  options: PropTypes.array,
  configs: PropTypes.object,
  isLoading: PropTypes.bool,
  defaultValue: PropTypes.any,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  hasSubLabel: PropTypes.bool,
  showClear: PropTypes.bool,
  itemTemplate: PropTypes.any,
  filter: PropTypes.bool,
  onChange: PropTypes.func,
  onShow: PropTypes.func,
  prefixItem: PropTypes.any,
  prefixValue: PropTypes.any,
  scrollHeight: PropTypes.number,
  label: PropTypes.any,
  panelClassName: PropTypes.string,
};

Dropdown.defaultProps = {
  id: '',
  className: '',
  wrapperClass: '',
  style: {},
  options: [],
  configs: {},
  isLoading: false,
  showClear: false,
  defaultValue: null,
  placeholder: 'Nhấp để chọn',
  prefixItem: null,
  prefixValue: null,
  disabled: false,
  filter: false,
  itemTemplate: () => null,
  hasSubLabel: false,
  onChange: () => {},
  onShow: () => {},
  scrollHeight: 300,
  label: null,
  panelClassName: '',
};

function Dropdown(props) {
  const {
    id,
    style,
    className,
    options,
    defaultValue,
    placeholder,
    disabled,
    onChange,
    filter,
    itemTemplate,
    showClear,
    hasSubLabel,
    prefixItem,
    prefixValue,
    scrollHeight,
    wrapperClass,
    label,
    panelClassName,
    onShow,
  } = props;

  const customItemTemplate = ({ label, value, subLabel = null }) => {
    return (
      <div
        className={buildClass([
          'p-dropdown-item__label',
          prefixItem && 'p-dropdown-item__label--prefix',
        ])}
      >
        {prefixItem ? (
          <span className="p-dropdown-item__label-prefix">{prefixItem}:</span>
        ) : null}
        <span className="p-dropdown-item__label-display"> {label}</span>
        {hasSubLabel ? (
          <div className="p-dropdown-item__subLabel toe-font-hint">
            {subLabel}
          </div>
        ) : null}
      </div>
    );
  };

  const customValueTemplate = (data) => {
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
        <span className="p-dropdown-item__value-display">{data?.label}</span>
      </div>
    );
  };

  return (
    <div className={buildClass(['toe-dropdown__wrapper', wrapperClass])}>
      {label ? (
        <div
          className={buildClass(['toe-dropdown__wrapper-label toe-font-label'])}
        >
          {label}
        </div>
      ) : null}
      <DropdownPrime
        id={id}
        style={style}
        panelClassName={buildClass([panelClassName, 'toe-font-body'])}
        className={buildClass(['toe-dropdown', 'toe-font-body', className])}
        value={defaultValue}
        options={options}
        onChange={onChange}
        optionLabel="label"
        optionValue="value"
        placeholder={placeholder}
        disabled={disabled}
        emptyFilterMessage="Không tìm thấy dữ liệu"
        emptyMessage="Không có dữ liệu hiển thị"
        dataKey="value"
        filter={filter}
        filterInputAutoFocus
        resetFilterOnHide
        filterPlaceholder="Nhập từ cần tìm"
        showClear={showClear}
        itemTemplate={customItemTemplate}
        {...(defaultValue ? { valueTemplate: customValueTemplate } : {})}
        scrollHeight={scrollHeight}
        onShow={onShow}
      />
    </div>
  );
}

export default Dropdown;
