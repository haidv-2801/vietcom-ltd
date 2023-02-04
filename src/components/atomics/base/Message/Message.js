import { CloseOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import React from 'react';
import { buildClass } from '../../../../constants/commonFunction';
import Overlay from '../Overlay/Overlay';
import './message.scss';

Message.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  onClose: PropTypes.func,
  title: PropTypes.any,
  cloaseable: PropTypes.bool,
};

Message.defaultProps = {
  id: '',
  className: '',
  style: {},
  onClose: () => {},
  title: '',
  cloaseable: false,
};

function Message(props) {
  const { id, style, className, onClose, title, cloaseable } = props;

  return <div className="toe-message toe-font-body">{title}</div>;
}

export default Message;
