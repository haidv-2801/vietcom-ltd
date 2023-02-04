import { LeftOutlined } from '@ant-design/icons';
import { Layout as LayoutAntd, Menu } from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import baseApi from '../../../../api/baseApi';
import MainLogo from '../../../../assets/images/logo_utc.jpg';
import { OPERATOR, SORT_TYPE } from '../../../../constants/commonConstant';
import { buildClass } from '../../../../constants/commonFunction';
import END_POINT from '../../../../constants/endpoint';
import useOnClickOutside from '../../../../hooks/useClickOutSide';
import Loading from '../../../atomics/base/Loading/Loading';
import PopupSelectionV1 from '../../../atomics/base/PopupSelectionV1/PopupSelection';
import UserInfo from '../../UserInfo/UserInfo';
import { AuthContext } from '../../../../contexts/authContext';
const { Sider } = LayoutAntd;
import './layout.scss';

Layout.propTypes = {
  title: PropTypes.any,
  rightButtons: PropTypes.array,
  hasBackBtn: PropTypes.bool,
  back: PropTypes.func,
  className: PropTypes.string,
};

Layout.defaultProps = {
  title: null,
  rightButtons: [],
  hasBackBtn: false,
  className: '',
  back: () => {},
};

function Layout(props) {
  const { title, rightButtons, children, hasBackBtn, back, className } = props;

  const auth = useContext(AuthContext);

  //#region constant
  const DEFAULT_ITEM = '/admin/dashboard';
  const DEFAULT_TITLE = 'Tổng quan';

  const MENU = [
    {
      url: DEFAULT_ITEM,
      label: DEFAULT_TITLE,
      icon: 'pi pi-chart-bar',
      items: null,
      className: 'js-admin-menu-event-dashboard',
    },
    {
      label: null,
      className: 'separator-line',
    },
    {
      icon: 'pi pi-users',
      url: '/admin/systems/user',
      label: 'Tài khoản',
      className: buildClass([
        'js-admin-menu-event-account',
        !auth.isSysAdmin() ? 'disabled' : '',
      ]),
    },
    {
      icon: 'pi pi-sitemap',
      url: '/admin/systems/role',
      label: 'Chức năng',
      className: 'js-admin-menu-event-role',
      className: buildClass([
        'js-admin-menu-event-role',
        !auth.isSysAdmin() ? 'disabled' : '',
      ]),
    },
    {
      icon: 'pi pi-user-edit',
      url: '/admin/systems/permission',
      label: 'Phân quyền',
      className: buildClass([
        'js-admin-menu-event-permission',
        !auth.isSysAdmin() ? 'disabled' : '',
      ]),
    },
    {
      icon: 'pi pi-list',
      url: '/admin/systems/menu',
      label: 'Menu',
      className: 'js-admin-menu-event-menu',
      className: buildClass([
        'js-admin-menu-event-menu',
        !auth.isSysAdmin() ? 'disabled' : '',
      ]),
    },
    {
      label: null,
      className: 'separator-line',
    },
    {
      icon: 'pi pi-server',
      url: '/admin/systems/safe-address',
      label: 'Địa chỉ truy cập',
      className: buildClass(['js-admin-menu-event-safe-address']),
    },
    {
      url: '/admin/danh-muc/ban-doc',
      icon: 'pi pi-id-card',
      label: 'Thẻ thư viện',
      className: 'js-admin-menu-event-safe-member',
    },
    {
      url: '/admin/danh-muc/sach',
      label: 'Ấn phẩm',
      icon: 'pi pi-book',
      className: 'js-admin-menu-event-safe-book',
    },
    {
      icon: 'pi pi-arrows-h',
      url: '/admin/danh-muc/muon-tra',
      label: 'Mượn trả',
      className: 'js-admin-menu-event-safe-lending',
    },
    {
      label: null,
      className: 'separator-line',
    },
    {
      url: '/admin/tin-tuc/post',
      icon: 'pi pi-bell',
      label: 'Bài viết',
      className: 'js-admin-menu-event-safe-post',
    },
    {
      icon: 'pi pi-server',
      url: '/admin/tin-tuc/page',
      label: 'Trang',
      className: 'js-admin-menu-event-safe-page',
    },
    {
      icon: 'pi pi-sliders-v',
      url: '/admin/tin-tuc/slide',
      label: 'Slide',
      className: 'js-admin-menu-event-safe-slide',
    },
    {
      icon: 'pi pi-comments',
      url: '/admin/yeu-cau-gop-y',
      label: 'Yêu cầu góp ý',
      className: 'js-admin-menu-event-safe-feedback',
    },
  ];

  //#endregion
  const popupSelectionRef = useRef();
  //#region ref

  //#endregion

  //#region  state
  const history = useNavigate(DEFAULT_ITEM);
  const location = useLocation();
  const [collapsedMenu, setCollapsedMenu] = useState(false);
  const [menuItemSelected, setmenuItemSelected] = useState(DEFAULT_ITEM);
  const [notificationPaging, setNotificationPaging] = useState({
    pageSize: 20,
    pageIndex: 1,
  });
  const [dataNotifications, setDataNotifications] = useState({
    data: [],
    isLoading: false,
  });

  useOnClickOutside(popupSelectionRef, () => {
    setIsShowPopupSelection(false);
  });

  //#endregion

  //#region method
  useEffect(() => {
    document.title = 'Thư viện-365';

    //get notificaiton
    getNotification();
  }, []);

  const getNotification = () => {
    setDataNotifications({ ...dataNotifications, isLoading: true });
    let _filter = [
      ['IsDeleted', OPERATOR.EQUAL, '0'],
      OPERATOR.AND,
      ['Status', OPERATOR.EQUAL, '1'],
    ];
    baseApi.post(
      (res) => {
        let _data = res.data.pageData;

        setDataNotifications({ data: _data, isLoading: false });
      },
      (err) => {
        setDataNotifications({ ...dataNotifications, isLoading: false });
      },
      () => {},
      END_POINT.TOE_GET_NOTIFICATIONS_FILTER,
      {
        filter: btoa(JSON.stringify(_filter)),
        pageSize: notificationPaging.pageSize,
        pageIndex: notificationPaging.pageIndex,
        sort: JSON.stringify([['CreatedDate', SORT_TYPE.DESC]]),
      },
      null
    );
  };

  const handleCollapsed = (state) => {
    if (state) {
      setCollapsedMenu(state);
    } else {
      setTimeout(() => {
        setCollapsedMenu(state);
      }, 120);
    }
  };

  const renderPanelMenu1 = () => {
    return (
      <div className={buildClass(['admin-menu'])}>
        {MENU.map((item, _) => {
          return (
            <div
              key={_}
              className={buildClass([
                'admin-menu-item toe-font-body',
                item.className,
                location.pathname.indexOf(item.url) >= 0 && 'active',
              ])}
              onClick={() => {
                item?.url && history(item.url);
              }}
            >
              <div className="admin-menu-item__icon">
                <i className={item.icon}></i>
              </div>
              <div className="admin-menu-item__text">{item.label}</div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderRightButtons = () => {
    return rightButtons.map((btn, _) => <div key={_}>{btn}</div>);
  };

  //#endregion

  return (
    <LayoutAntd className={className}>
      <div className="toe-layout-admin-page-container">
        <div className="toe-layout-admin-page-container__header">
          <div
            onClick={() => {
              history('/');
            }}
            className="toe-layout-admin-page-container__header-left"
          >
            <img className="logo-app" src={MainLogo} alt="Thư viện GTVT" />
          </div>
          <div className="toe-layout-admin-page-container__header-right toe-font-body">
            <PopupSelectionV1
              overlayClassName="selection-notification"
              options={dataNotifications.data.map((item, _) => ({
                label: (
                  <div className="notification-item">
                    {' '}
                    <div className="notification-item__content">
                      {item.content}
                    </div>
                    <div className="notification-item__time toe-font-hint">
                      {moment(item.createdDate).fromNow()}
                    </div>
                  </div>
                ),
                value: _,
              }))}
            >
              <i className="pi pi-bell" onClick={() => getNotification()}>
                {dataNotifications.data.some((it) => it.isReaded === false) && (
                  <div className="dot"></div>
                )}
              </i>
            </PopupSelectionV1>
            <UserInfo />
          </div>
        </div>
        <div className="toe-layout-admin-page-container__body">
          <div className="toe-layout-admin-page-container__body-left">
            <Sider
              collapsible
              onCollapse={handleCollapsed}
              theme="light"
              breakpoint="lg"
              color="#fff"
              className={buildClass([collapsedMenu && 'sidermenu-collapsed'])}
            >
              <div className="logo" />
              {renderPanelMenu1()}
            </Sider>
          </div>
          <div className="toe-layout-admin-page-container__body-right">
            <div className="toe-layout-admin-page-container__body-right__head">
              <div className="toe-layout-admin-page-container__body-right__head-title">
                {hasBackBtn ? (
                  <div
                    onClick={back}
                    className="toe-layout-admin-page-container__body-right__head-title-back"
                  >
                    <LeftOutlined />
                  </div>
                ) : null}

                <div className="toe-font-large-title">
                  {title || menuItemSelected}
                </div>
              </div>
              <div className="toe-layout-admin-page-container__body-right__head-btns">
                {renderRightButtons()}
              </div>
            </div>
            <div className="toe-layout-admin-page-container__body-right__body">
              {children}
            </div>
          </div>
        </div>
      </div>
      <Loading />
    </LayoutAntd>
  );
}

export default Layout;
