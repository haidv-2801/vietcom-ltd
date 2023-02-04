import React from 'react';
import PropTypes from 'prop-types';
import {
  BUTTON_SHAPE,
  BUTTON_THEME,
  BUTTON_TYPE,
} from '../../../../constants/commonConstant';
import { buildClass } from '../../../../constants/commonFunction';
import './button.scss';
Button.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  name: PropTypes.any,
  leftIcon: PropTypes.any,
  rightIcon: PropTypes.any,
  type: PropTypes.oneOf([
    BUTTON_TYPE.NORMAL,
    BUTTON_TYPE.LEFT_ICON,
    BUTTON_TYPE.RIGHT_ICON,
  ]),
  theme: PropTypes.oneOf([
    BUTTON_THEME.THEME_1,
    BUTTON_THEME.THEME_2,
    BUTTON_THEME.THEME_3,
    BUTTON_THEME.THEME_4,
    BUTTON_THEME.THEME_5,
    BUTTON_THEME.THEME_6,
  ]),
  shape: PropTypes.oneOf([BUTTON_SHAPE.ROUND, BUTTON_SHAPE.NORMAL]),
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  width: PropTypes.number,
};

Button.defaultProps = {
  id: '',
  className: '',
  style: {},
  name: '',
  leftIcon: null,
  rightIcon: null,
  type: BUTTON_TYPE.NORMAL,
  theme: BUTTON_THEME.THEME_1,
  onClick: () => {},
  disabled: false,
  shape: BUTTON_SHAPE.ROUND,
  width: null,
};

function Button(props) {
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
    shape,
    width,
  } = props;

  return (
    <div
      id={id}
      style={{ maxWidth: width, ...style }}
      className={buildClass([
        'toe-font-body',
        'toe-btn',
        type == BUTTON_TYPE.NORMAL && 'toe-btn-normal',
        type == BUTTON_TYPE.LEFT_ICON && 'toe-btn-left-icon',
        type == BUTTON_TYPE.RIGHT_ICON && 'toe-btn-right-icon',
        theme == BUTTON_THEME.THEME_1 && 'toe-btn-theme-1',
        theme == BUTTON_THEME.THEME_2 && 'toe-btn-theme-2',
        theme == BUTTON_THEME.THEME_3 && 'toe-btn-theme-3',
        theme == BUTTON_THEME.THEME_4 && 'toe-btn-theme-4',
        theme == BUTTON_THEME.THEME_5 && 'toe-btn-theme-5',
        theme == BUTTON_THEME.THEME_6 && 'toe-btn-theme-6',
        disabled && 'toe-btn--disabled',
        shape === BUTTON_SHAPE.NORMAL && 'toe-btn-shape-normal',
        className,
      ])}
      onClick={onClick}
    >
      {type == BUTTON_TYPE.LEFT_ICON ? (
        <div className="toe-btn-left-icon">{leftIcon}</div>
      ) : null}

      <div className="toe-btn-content ">{name}</div>

      {type == BUTTON_TYPE.RIGHT_ICON ? (
        <div className="toe-btn-right-icon">{rightIcon}</div>
      ) : null}
    </div>
  );
}

export default Button;
