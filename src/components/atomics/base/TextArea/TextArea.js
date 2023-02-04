import { InputTextarea } from 'primereact/inputtextarea';
import PropTypes from 'prop-types';
import React, { useRef } from 'react';
import { buildClass } from '../../../../constants/commonFunction';
import './textArea.scss';

TextAreaBase.propTypes = {
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
};

TextAreaBase.defaultProps = {
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
  hasRequiredLabel: false,
  onChange: () => {},
  maxLength: undefined,
  defaultValue: null,
  value: null,
  tabIndex: 0,
  showMaxLength: false,
};

function TextAreaBase(props) {
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
  } = props;

  const ref = useRef('');

  return (
    <div>
      {label ? (
        <label
          className={buildClass([
            'toe-textarea-label toe-font-label',
            hasRequiredLabel && 'toe-textarea-label--required',
          ])}
        >
          {label}
          {hasRequiredLabel ? <span style={{ color: 'red' }}>*</span> : null}
        </label>
      ) : null}
      <InputTextarea
        autoFocus={autoFocus}
        className={buildClass([
          'toe-textarea',
          !valid && 'toe-textarea-warning',
          rightIcon && 'p-input-icon-right',
          label && 'toe-textarea-has-label',
          className,
          'toe-font-body',
        ])}
        onChange={(e) => {
          ref.current = e.target.value;
          onChange(e.target.value);
          if (ref.current.length === parseInt(maxLength, 10) || 0) return;
        }}
        placeholder={placeholder}
        maxLength={maxLength}
        // defaultValue={defaultValue}
        value={value}
        tabIndex={tabIndex}
        disabled={disabled}
        autoResize
      />
    </div>
  );
}

export default TextAreaBase;
