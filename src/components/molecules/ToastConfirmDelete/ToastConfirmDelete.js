import React from 'react';
import PropTypes from 'prop-types';
import { BUTTON_THEME } from '../../../constants/commonConstant';
import Button from '../../atomics/base/Button/Button';
import Modal from '../../atomics/base/ModalV2/Modal';
import './toastConfirmDelete.scss';
import { format } from 'react-string-format';

ToastConfirmDelete.propTypes = {
  onClose: PropTypes.func,
  onAccept: PropTypes.func,
  title: PropTypes.any,
  prefix: PropTypes.any,
};

ToastConfirmDelete.defaultProps = {
  title: '',
  prefix: 'Bạn có chắc muốn xóa {0}?',
};

function ToastConfirmDelete(props) {
  const { onClose, onAccept, title, prefix } = props;

  return (
    <Modal
      title={''}
      show
      maximizable={false}
      footerRight={[
        <Button theme={BUTTON_THEME.THEME_6} onClick={onClose} name="Hủy" />,
        <Button name="Xác nhận" onClick={onAccept} />,
      ]}
      onClose={onClose}
      className="toe-toast-delete toe-font-label"
    >
      {format(prefix, <b>{title}</b>)}
    </Modal>
  );
}

export default ToastConfirmDelete;
