import { DownOutlined } from '@ant-design/icons';
import { PanelMenu } from 'primereact/panelmenu';
import PropTypes from 'prop-types';
import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import baseApi from '../../../../api/baseApi';
// import MainLogo from '../../../../assets/images/LogoUTC.jpg';
import MainLogo from '../../../../assets/images/logo_utc.jpg';
// import MainLogo from '../../../../assets/images/toeiclogo.png';
import {
  BUTTON_THEME,
  BUTTON_TYPE,
  MAXIMUM_PAGESIZE,
  MENU_TYPE,
  OPERATOR,
  PATH_NAME,
} from '../../../../constants/commonConstant';
import {
  buildClass,
  listToTree,
  slugify,
} from '../../../../constants/commonFunction';
import END_POINT from '../../../../constants/endpoint';
import { AuthContext } from '../../../../contexts/authContext';
import { appAction } from '../../../../redux/slices/appSlice';
import Button from '../../../atomics/base/Button/Button';
import MenuBar from '../../../atomics/base/MenuBar/MenuBar';
import PopupSelectionV1 from '../../../atomics/base/PopupSelectionV1/PopupSelection';
import UserInfo from '../../UserInfo/UserInfo';
import './header.scss';

Header.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  showNav: PropTypes.bool,
};

Header.defaultProps = {
  id: '',
  className: '',
  style: {},
  showNav: true,
};

function Header(props) {
  const { id, style, className, showNav } = props;

  const RESOURCES_SUB_MENU = [
    {
      label: 'Tài liệu in',
      value: slugify('Tài liệu in'),
    },
    {
      label: 'Tài liệu số',
      value: slugify('Tài liệu số'),
    },
    {
      label: <span className="toe-font-label">Học liệu mở</span>,
      value: slugify('Học liệu mở'),
    },
  ];

  const ABOUT_SUB_MENU = [
    {
      label: 'Tổng quan về thư viện',
      value: slugify('Tổng quan về thư viện'),
    },
    {
      label: 'Nội quy thư viện',
      value: slugify('Nội quy thư viện'),
    },
    {
      label: 'Hướng dẫn sử dụng',
      value: slugify('Hướng dẫn sử dụng'),
    },
    {
      label: 'Giới thiệu sách mới',
      value: slugify('Giới thiệu sách mới'),
    },
  ];

  const SERVICES_SUB_MENU = [
    {
      label: 'Mượn trả tài liệu',
      value: slugify('Mượn trả tài liệu'),
      isNotHtmlRender: true,
    },
    {
      label: 'Cung cấp không gian tiện ích',
      value: slugify('Cung cấp không gian tiện ích'),
    },
    {
      label: 'Hỗ trợ học tập, giảng dạy và nghiên cứu',
      value: slugify('Hỗ trợ học tập, giảng dạy và nghiên cứu'),
    },
    {
      label: 'Các dịch vụ khác',
      value: slugify('Các dịch vụ khác'),
    },
  ];

  const MENU = [
    {
      key: PATH_NAME.HOME,
      title: 'TRANG CHỦ',
    },
    {
      key: PATH_NAME.ABOUT,
      title: 'GIỚI THIỆU',
      subMenu: ABOUT_SUB_MENU,
    },
    {
      key: PATH_NAME.RESOURCES,
      title: 'TÀI NGUYÊN - BỘ SƯU TẬP',
      subMenu: RESOURCES_SUB_MENU,
    },
    {
      key: PATH_NAME.SERVICES,
      title: 'DỊCH VỤ - TIỆN ÍCH',
      subMenu: SERVICES_SUB_MENU,
    },
    {
      key: PATH_NAME.SEARCH,
      title: 'TRA CỨU',
      redirect: 'http://opac.utc.edu.vn/',
    },
  ];

  const MENU_SMALL_SCREEN = [
    {
      label: 'Trang chủ',
      icon: 'pi pi-fw pi-home',
      url: PATH_NAME.HOME,
    },
    {
      label: 'Giới thiệu',
      items: ABOUT_SUB_MENU,
      key: PATH_NAME.ABOUT,
    },
    {
      key: PATH_NAME.RESOURCES,
      label: 'TÀI NGUYÊN - BỘ SƯU TẬP',
      items: RESOURCES_SUB_MENU,
    },
    {
      key: PATH_NAME.SERVICES,
      label: 'DỊCH VỤ - TIỆN ÍCH',
      items: SERVICES_SUB_MENU,
    },
    {
      key: PATH_NAME.SEARCH,
      url: 'http://opac.utc.edu.vn/',
      label: 'TRA CỨU',
      icon: 'pi pi-fw pi-search',
    },
  ];

  const dispatch = useDispatch();
  const authCtx = useContext(AuthContext);
  const history = useNavigate();
  const [expandedMenu, setExpandedMenu] = useState(false);
  const [dataMenus, setDataMenus] = useState([]);
  const selector = useSelector((store) => store.app);

  useEffect(() => {
    setDataMenus(
      listToTree(
        selector.menus.map((item) => ({
          ...item,
          label: item.title,
          key: item.menuID,
          // url: handleControlByMenuType(item),
          command: (e) => {
            switch (item.type) {
              case MENU_TYPE.NORMAL:
              case MENU_TYPE.HTML_RENDER:
                history('/' + item.slug);
                break;
              case MENU_TYPE.REDIRECT:
                window.open(item?.link, '_blank');
                break;
              case MENU_TYPE.NONE_EVENT:
                break;
              default:
                break;
            }
          },
        })),
        'items'
      )
    );
  }, [selector.menus]);

  const renderMenu = (subPosition = 'bottomLeft') => {
    return MENU.map((item) => {
      const navLink = (
        <NavLink
          to={item.key}
          key={item.key}
          onClick={(e) => {
            if (item?.redirect) {
              e.preventDefault();
              window.open(item?.redirect, '_blank');
            } else if (item?.subMenu) {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
          className={buildClass(['menu-item toe-font-label'])}
          style={({ isActive }) => {
            return {
              color: isActive ? '#43c1c9' : '',
            };
          }}
        >
          {item?.subMenu ? <DownOutlined /> : null}
          {item.title}
        </NavLink>
      );

      return !item?.subMenu ? (
        navLink
      ) : (
        <PopupSelectionV1
          key={item.key}
          onChange={(data) => {
            if (data?.isNotHtmlRender) {
              history('/' + data.value);
            } else {
              history('/html/' + data.value);
            }
          }}
          options={item?.subMenu}
          trigger="hover"
          className="toe-layout-user-page-container__header__submenu"
          overlayClassName="toe-layout-user-page-container__header__submenu-dropdown"
          placement={subPosition}
        >
          {navLink}
        </PopupSelectionV1>
      );
    });
  };

  const getMenus = () => {
    let _filter = [
      ['IsDeleted', OPERATOR.EQUAL, '0'],
      OPERATOR.AND,
      ['Status', OPERATOR.EQUAL, '1'],
      OPERATOR.AND,
      ['IsShowHome', OPERATOR.EQUAL, '1'],
    ];

    baseApi.post(
      (res) => {
        res = res.data.pageData;
        dispatch(appAction.changeDataMenus([...res]));
        res = res.sort((a, b) => a.displayOrder - b.displayOrder);
        setDataMenus(
          listToTree(
            res.map((item) => ({
              ...item,
              label: item.title,
              key: item.menuID,
              // url: handleControlByMenuType(item),
              command: (e) => {
                switch (item.type) {
                  case MENU_TYPE.NORMAL:
                  case MENU_TYPE.HTML_RENDER:
                    history('/' + item.slug);
                    break;
                  case MENU_TYPE.REDIRECT:
                    window.open(item?.link, '_blank');
                    break;
                  case MENU_TYPE.NONE_EVENT:
                    break;
                  default:
                    break;
                }
              },
            })),
            'items'
          )
        );
      },
      (err) => {},
      () => {},
      END_POINT.TOE_GET_MENUS_FILTER,
      {
        filter: btoa(JSON.stringify(_filter)),
        pageIndex: 1,
        pageSize: MAXIMUM_PAGESIZE,
      },
      null
    );
  };

  const handleExpanedMenu = () => {
    setExpandedMenu(!expandedMenu);
  };

  return (
    <div
      id={id}
      style={style}
      className={buildClass([
        'toe-layout-user-page-container__header',
        className,
      ])}
    >
      <div
        onClick={() => {
          history(PATH_NAME.HOME);
        }}
        className="toe-layout-user-page-container__header-left"
      >
        <img className="logo-app" src={MainLogo} alt="toeic-365" />
        <b className="name-app toe-font-large-title"></b>
      </div>
      <div className="toe-layout-user-page-container__header-right">
        {showNav && (
          <>
            <MenuBar options={dataMenus} />
            {!authCtx.isLoggedIn ? null : <UserInfo />}
          </>
        )}

        {!showNav && (
          <Button
            type={BUTTON_TYPE.LEFT_ICON}
            theme={BUTTON_THEME.THEME_6}
            onClick={() => window.history.back()}
            leftIcon={<i className="pi pi-angle-double-left"></i>}
            name={'Danh sách bài test'}
          />
        )}
      </div>
    </div>
  );
}

export default Header;
