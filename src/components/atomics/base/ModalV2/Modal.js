import { Dialog } from 'primereact/dialog';
import PropTypes from 'prop-types';
import React from 'react';
import { buildClass } from '../../../../constants/commonFunction';
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
  show: PropTypes.bool,
  maximizable: PropTypes.bool,
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
  show: false,
  maximizable: false,
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
    show,
    maximizable,
  } = props;

  const renderFooter = () => {
    return (
      <div className="toe-modal-v2__foot">
        <div className="toe-modal-v2__foot-left">
          {footerLeft.map((item, _) => (
            <div key={_} style={{ marginRight: 16 }}>
              {item}
            </div>
          ))}
        </div>
        <div className="toe-modal-v2__foot-right">
          {' '}
          {footerRight.map((item, _) => (
            <div key={_} style={{ marginLeft: 16 }}>
              {item}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTitle = () => {
    return <div className="toe-font-title">{title}</div>;
  };

  return (
    <Dialog
      id={id}
      className={buildClass(['toe-modal-v2', className])}
      contentClassName={className}
      style={style}
      header={renderTitle()}
      visible={show}
      maximizable={maximizable}
      modal
      resizable={true}
      footer={renderFooter()}
      onHide={onClose}
      closeOnEscape
    >
      {children}
    </Dialog>
  );
}

export default Modal;
