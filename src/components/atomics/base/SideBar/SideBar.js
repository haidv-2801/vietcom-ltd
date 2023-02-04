import { RetweetOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { Sidebar as SidebarPrime } from 'primereact/sidebar';
import { Tooltip as TooltipPrime } from 'primereact/tooltip';
import PropTypes from 'prop-types';
import React from 'react';
import { buildClass } from '../../../../constants/commonFunction';
import './sideBar.scss';

SideBar.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  show: PropTypes.bool,
  position: PropTypes.string,
  title: PropTypes.string,
  onClose: PropTypes.func,
  onClickRefreshButton: PropTypes.func,
  bottomRightButtons: PropTypes.array,
};

SideBar.defaultProps = {
  id: '',
  className: '',
  style: {},
  show: true,
  position: 'right',
  onClose: () => {},
  onClickRefreshButton: () => {},
  bottomRightButtons: [],
  title: '',
};

function SideBar(props) {
  const {
    id,
    style,
    className,
    show,
    position,
    onClose,
    children,
    bottomRightButtons,
    title,
    onClickRefreshButton,
  } = props;

  return (
    <SidebarPrime
      id={id}
      style={style}
      className={buildClass(['toe-sidebar', 'toe-font-body', className])}
      visible={show}
      position={position}
      onHide={onClose}
      closeOnEscape
      dismissable
    >
      <div className="toe-sidebar__refresh toe-font-title">
        <TooltipPrime
          position="left"
          target={'.btn-refresh'}
          content="Làm mới"
        />
        <span onClick={onClickRefreshButton} className="btn-refresh">
          <RetweetOutlined />
        </span>
      </div>

      <div className="toe-sidebar__title toe-font-title">{title}</div>
      <div className="toe-sidebar__body toe-font-body">{children}</div>
      <div className="toe-sidebar__footer">
        {bottomRightButtons.map((item, _) => (
          <span key={_}>{item}</span>
        ))}
      </div>
    </SidebarPrime>
  );
}

export default SideBar;
