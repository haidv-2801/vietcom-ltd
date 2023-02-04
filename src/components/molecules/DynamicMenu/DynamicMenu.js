import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { BUTTON_TYPE, DATE_FORMAT } from '../../../constants/commonConstant';
import { buildClass } from '../../../constants/commonFunction';
import { Card } from 'primereact/card';
import { format } from 'react-string-format';
import { Image } from 'primereact/image';
import SmartText from '../../atomics/base/SmartText/SmartText';
import { Skeleton } from 'primereact/skeleton';
import moment from 'moment';
import { RightOutlined, SearchOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import Input from '../../atomics/base/Input/Input';
import Button from '../../atomics/base/Button/Button';
import Dropdown from '../Dropdown/Dropdown';
import './dynamicMenu.scss';

DynamicMenu.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  onClick: PropTypes.func,
};

DynamicMenu.defaultProps = {
  id: '',
  className: '',
  style: {},
  onClick: () => {},
};

function DynamicMenu(props) {
  const { id, style, className, onClick } = props;
  const navigate = useNavigate();

  const MENU = [
    {
      key: '/account',
      title: 'Tài khoản thư viện',
    },
    {
      key: '/online-database',
      title: 'Cơ sở dữ liệu trực tuyến',
    },
    {
      key: '/internal-document',
      title: 'Tại liệu nội sinh',
    },
    {
      key: '/services',
      title: 'Dịch vụ thư viện',
    },
  ];

  const SEARCH_TOOLS = [
    {
      value: 'http://opac.utc.edu.vn/',
      label: 'OPAC UTC',
      subLabel: 'http://opac.utc.edu.vn/',
    },
    {
      value: '/online-database',
      label: 'Cơ sở dữ liệu trực tuyến',
      subLabel: 'sublabel',
    },
    {
      value: '/internal-document',
      label: 'Tại liệu nội sinh',
      subLabel: 'sublabel',
    },
    {
      value: '/services',
      label: 'Dịch vụ thư viện',
      subLabel: 'sublabel',
    },
  ];

  const [dataSearchTool, setDataSearchTool] = useState(
    'http://opac.utc.edu.vn/'
  );

  const handleOnClick = (item) => {
    navigate(item.key);
  };

  return (
    <div
      id={id}
      style={style}
      className={buildClass(['toe-dynamic-menu toe-font-body', className])}
    >
      <div className="toe-dynamic-menu__title">Thư viện của tôi</div>
      <div className="toe-dynamic-menu__item-wrap">
        {MENU.map((item) => {
          return (
            <div
              onClick={() => handleOnClick(item)}
              key={item.key}
              className="toe-dynamic-menu__item"
            >
              {<RightOutlined />} {item.title}
            </div>
          );
        })}
      </div>
      <div className="toe-dynamic-menu__btn-redirect-search">
        <Button
          type={BUTTON_TYPE.LEFT_ICON}
          leftIcon={<SearchOutlined />}
          name={'Tra cứu'}
          disabled={!dataSearchTool}
          onClick={() => {
            // window.location.replace(dataSearchTool);
            window.open(dataSearchTool, '_blank');
          }}
        />
        <Dropdown
          defaultValue={dataSearchTool}
          onChange={(data) => setDataSearchTool(data.value)}
          options={SEARCH_TOOLS}
          placeholder="Chọn công cụ tìm kiếm"
          hasSubLabel
          panelClassName="toe-dropdown-panel"
        />
      </div>
    </div>
  );
}

export default DynamicMenu;
