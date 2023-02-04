import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { InputNumber as InputNumberPrime } from 'primereact/inputnumber';
import { buildClass } from '../../../../constants/commonFunction';
import { format } from 'react-string-format';
import './inputNumber.scss';

InputNumber.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  valid: PropTypes.bool,
  bottomMessage: PropTypes.string,
  placeholder: PropTypes.any,
  rightIcon: PropTypes.any,
  label: PropTypes.any,
  autoFocus: PropTypes.bool,
  hasRequiredLabel: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  maxLength: PropTypes.any,
  defaultValue: PropTypes.any,
  value: PropTypes.any,
  tabIndex: PropTypes.number,
  showMaxLength: PropTypes.bool,
  controlled: PropTypes.bool,
  type: PropTypes.oneOf(['InputNumber', 'textarea']),
  leftIcon: PropTypes.any,
  delay: PropTypes.number,
  delayAction: PropTypes.func,
};

InputNumber.defaultProps = {
  id: '',
  className: '',
  style: {},
  valid: true,
  bottomMessage: null,
  placeholder: 'Nhập thông tin',
  rightIcon: null,
  label: null,
  autoFocus: false,
  disabled: false,
  controlled: false,
  hasRequiredLabel: false,
  onChange: () => {},
  delayAction: () => {},
  maxLength: undefined,
  defaultValue: '',
  value: '',
  tabIndex: 0,
  showMaxLength: false,
  type: 'InputNumber',
  leftIcon: '',
  delay: 0,
};

function InputNumber(props) {
  const {
    id,
    style,
    className,
    valid,
    bottomMessage,
    placeholder,
    rightIcon,
    label,
    onChange,
    autoFocus,
    hasRequiredLabel,
    maxLength,
    disabled,
    value,
    tabIndex,
    defaultValue,
    showMaxLength,
    type,
    leftIcon,
    delay,
    delayAction,
    controlled,
  } = props;

  const ref = useRef('');

  return (
    <>
      <div
        id={id}
        style={style}
        className={buildClass([
          'toe-input-number',
          !valid && 'toe-input-number-warning',
          rightIcon && 'p-input-number-icon-right',
          label && 'toe-input-number-has-label',
          className,
          'toe-font-body',
        ])}
      >
        {rightIcon}
        {label ? (
          <label
            className={buildClass([
              'toe-input-number-label toe-font-label',
              hasRequiredLabel && 'toe-input-number-label--required',
            ])}
          >
            {label}
            {hasRequiredLabel ? <span style={{ color: 'red' }}>*</span> : null}
          </label>
        ) : null}

        <div
          style={{ width: '100%' }}
          className={buildClass([leftIcon && 'p-input-number-icon-left'])}
        >
          {leftIcon ? leftIcon : null}
          <InputNumberPrime
            inputId="integeronly"
            className="toe-input-number--inner"
            autoFocus={autoFocus}
            onValueChange={(e) => {
              ref.current = e.value;
              onChange(e.value);
            }}
            placeholder={placeholder}
            tabIndex={tabIndex}
            disabled={disabled}
            // useGrouping={false}
            value={value}
          />
        </div>
        {showMaxLength ? (
          <span className="toe-font-hint toe-input-number-maxlength">
            {format('{0}/{1}', ref.current.length || 0, maxLength)}
          </span>
        ) : null}
      </div>
      {bottomMessage && !valid && (
        <div className="toe-input-number-message">{bottomMessage}</div>
      )}
    </>
  );
}

export default InputNumber;
