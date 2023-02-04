import { CloseOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import React from 'react';
import { buildClass } from '../../../../constants/commonFunction';
import Overlay from '../Overlay/Overlay';
import './modal.scss';

Modal.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  onClose: PropTypes.func,
  onClickOutSide: PropTypes.func,
  title: PropTypes.any,
  footerLeft: PropTypes.array,
  footerRight: PropTypes.array,
  noXIcon: PropTypes.bool,
};

Modal.defaultProps = {
  id: '',
  className: '',
  style: {},
  onClose: () => {},
  onClickOutSide: () => {},
  title: '',
  footerLeft: [],
  footerRight: [],
  noXIcon: false,
};

function Modal(props) {
  const {
    id,
    style,
    className,
    onClose,
    onClickOutSide,
    title,
    footerLeft,
    footerRight,
    noXIcon,
    children,
  } = props;

  return (
    <Overlay onClick={onClickOutSide}>
      <div
        id={id}
        style={style}
        className={buildClass(['toe-modal', className])}
      >
        <div className="toe-modal__head">
          <div className="toe-modal__head-left toe-font-title">{title}</div>
          <div onClick={onClose} className="toe-modal__head-right">
            {!noXIcon && <CloseOutlined />}
          </div>
        </div>
        <div className="toe-modal__body toe-font-body">{children}</div>
        <div className="toe-modal__foot">
          <div className="toe-modal__foot-left">
            {footerLeft.map((item, _) => (
              <div key={_} style={{ marginRight: 16 }}>
                {item}
              </div>
            ))}
          </div>
          <div className="toe-modal__foot-right">
            {' '}
            {footerRight.map((item, _) => (
              <div key={_} style={{ marginLeft: 16 }}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Overlay>
  );
}

export default Modal;
