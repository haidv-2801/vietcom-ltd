import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { InputPasswordText } from 'primereact/inputtext';
import { buildClass } from '../../../../constants/commonFunction';
import { format } from 'react-string-format';
import { debounce } from 'debounce';
import { Password as PasswordPrime } from 'primereact/password';
import './inputPassword.scss';

InputPassword.propTypes = {
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
  type: PropTypes.oneOf(['input', 'textarea']),
  leftIcon: PropTypes.any,
  delay: PropTypes.number,
  delayAction: PropTypes.func,
};

InputPassword.defaultProps = {
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
  type: 'input',
  leftIcon: '',
  delay: 0,
};

function InputPassword(props) {
  const {
    id,
    style,
    className,
    valid,
    bottomMessage,
    placeholder,
    label,
    onChange,
    autoFocus,
    hasRequiredLabel,
    disabled,
    value,
    tabIndex,
    defaultValue,
    controlled,
  } = props;

  const valueProp = controlled
    ? { value: value }
    : { defaultValue: defaultValue };

  return (
    <div
      id={id}
      style={style}
      className={buildClass([
        'toe-input-password',
        label && 'toe-input-password-has-label',
        className,
        'toe-font-body',
      ])}
    >
      {label ? (
        <label
          className={buildClass([
            'toe-input-label toe-font-label',
            hasRequiredLabel && 'toe-input-label--required',
          ])}
        >
          {label}
          {hasRequiredLabel ? <span style={{ color: 'red' }}>*</span> : null}
        </label>
      ) : null}

      <PasswordPrime
        className={buildClass(['toe-input-password', 'toe-font-body'])}
        name="password"
        onChange={(e) => {
          onChange(e);
        }}
        disabled={disabled}
        autoFocus={autoFocus}
        toggleMask
        {...valueProp}
        placeholder={placeholder}
        weakLabel="Yếu"
        mediumLabel="Vừa"
        strongLabel="Mạnh"
        panelStyle={{ display: 'none' }}
        tabIndex={tabIndex}
      />
      {bottomMessage && !valid && (
        <div className="toe-input-message">{bottomMessage}</div>
      )}
    </div>
  );
}

export default InputPassword;
