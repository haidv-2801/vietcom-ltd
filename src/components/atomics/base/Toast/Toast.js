import React from 'react';
import PropTypes from 'prop-types';
import {} from '../../../../constants/commonConstant';
import { buildClass } from '../../../../constants/commonFunction';
import './Toast.scss';

Toast.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,

  name: PropTypes.string,
  leftIcon: PropTypes.any,
  rightIcon: PropTypes.any,
  type: PropTypes.oneOf([
    Toast_TYPE.NORMAL,
    Toast_TYPE.LEFT_ICON,
    Toast_TYPE.RIGHT_ICON,
  ]),
  theme: PropTypes.oneOf([
    Toast_THEME.THEME_1,
    Toast_THEME.THEME_2,
    Toast_THEME.THEME_3,
  ]),
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

Toast.defaultProps = {
  id: '',
  className: '',
  style: {},
  name: '',
  leftIcon: null,
  rightIcon: null,
  type: Toast_TYPE.NORMAL,
  theme: Toast_THEME.THEME_1,
  onClick: () => {},
  disabled: false,
};

function Toast(props) {
  const {
    id,
    style,
    className,
    type,
    theme,
    leftIcon,
    rightIcon,
    name,
    onClick,
    disabled,
  } = props;
  return (
    <div
      id={id}
      style={style}
      className={buildClass([
        'toe-toast',
        type == Toast_TYPE.NORMAL && 'toe-btn-normal',
        type == Toast_TYPE.LEFT_ICON && 'toe-btn-left-icon',
        type == Toast_TYPE.RIGHT_ICON && 'toe-btn-right-icon',
        theme == Toast_THEME.THEME_1 && 'toe-btn-theme-1',
        theme == Toast_THEME.THEME_2 && 'toe-btn-theme-2',
        theme == Toast_THEME.THEME_3 && 'toe-btn-theme-3',
        disabled && 'toe-btn--disabled',
        className,
      ])}
      onClick={onClick}
    >
      {type == Toast_TYPE.LEFT_ICON ? (
        <div className="toe-btn-left-icon">{leftIcon}</div>
      ) : null}

      <div className="toe-btn-content">{name}</div>

      {type == Toast_TYPE.RIGHT_ICON ? (
        <div className="toe-btn-right-icon">{rightIcon}</div>
      ) : null}
    </div>
  );
}

export default Toast;
