import { Popover } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import { buildClass } from '../../../../constants/commonFunction';
import './popupSelection.scss';

PopupSelection.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  wrapperClassName: PropTypes.string,
  overlayClassName: PropTypes.string,
  style: PropTypes.object,
  options: PropTypes.array,
  onChange: PropTypes.func,
  defaultValue: PropTypes.any,
  clickTargetElementRef: PropTypes.any,
  trigger: PropTypes.string,
  placement: PropTypes.string,
  footer: PropTypes.any,
  header: PropTypes.any,
};

PopupSelection.defaultProps = {
  id: '',
  className: '',
  wrapperClassName: '',
  overlayClassName: '',
  style: {},
  options: [],
  onChange: () => {},
  trigger: 'click',
  placement: 'bottomRight',
  footer: null,
  header: null,
};

function PopupSelection(props) {
  const {
    id,
    style,
    className,
    options,
    defaultValue,
    onChange,
    wrapperClassName,
    trigger,
    placement,
    overlayClassName,
    footer,
    header,
  } = props;

  const renderOption = () => {
    return (
      <div
        id={id}
        style={style}
        className={buildClass(['toe-popup-selection'], className)}
      >
        <div className="toe-popup-selection__header">{header}</div>
        {options.map((item) => {
          if (item?.isHide) return null;
          return (
            <div
              key={item?.value}
              className={buildClass([
                'toe-popup-selection__item',
                'toe-font-body',
                defaultValue === item?.value &&
                  'toe-popup-selection__item--selected',
              ])}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onChange(item);
                if (typeof item?.onClick === 'function') item?.onClick(item);
              }}
            >
              {item?.icon}
              {item?.label}
            </div>
          );
        })}
        <div className="toe-popup-selection__footer">{footer}</div>
      </div>
    );
  };

  return (
    <Popover
      overlayClassName={buildClass([
        'toe-popup-selection__wrapper',
        overlayClassName,
      ])}
      className={buildClass(['toe-popup-selection__wrapper', wrapperClassName])}
      placement={placement}
      content={renderOption()}
      trigger={trigger}
    >
      {props.children}
    </Popover>
  );
}

export default PopupSelection;
