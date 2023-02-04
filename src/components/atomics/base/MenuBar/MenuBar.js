import { RetweetOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { Menubar as MenuBarPrime } from 'primereact/menubar';
import { Tooltip as TooltipPrime } from 'primereact/tooltip';
import PropTypes from 'prop-types';
import React from 'react';
import { buildClass } from '../../../../constants/commonFunction';
import { FAKE_MENU_ITEM } from '../../../pages/test/Fake';
import './menuBar.scss';

MenuBar.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  options: PropTypes.array.isRequired,
  start: PropTypes.any,
  end: PropTypes.any,
};

MenuBar.defaultProps = {
  id: '',
  className: '',
  style: {},
  options: [],
  start: null,
  end: null,
};

function MenuBar(props) {
  const { id, style, className, options, start, end } = props;

  return (
    <MenuBarPrime
      id={id}
      style={style}
      className={buildClass(['toe-menubar', 'toe-font-body', className])}
      model={options}
      start={start}
      end={end}
    />
  );
}

export default MenuBar;
