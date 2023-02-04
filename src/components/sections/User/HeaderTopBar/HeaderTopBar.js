import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { EXTERNAL_LINK, PATH_NAME } from '../../../../constants/commonConstant';
import { AuthContext } from '../../../../contexts/authContext';
import './headerTopBar.scss';

const HeaderTopBar = () => {
  const OPTIONS = [
    {
      value: 1,
      label: 'Trang UTC',
      link: EXTERNAL_LINK.UTC,
    },
    {
      value: 2,
      label: 'Phòng',
    },
    {
      value: 3,
      label: 'Khoa',
    },
    {
      value: 4,
      label: 'Trung tâm dịch vụ',
    },
    {
      value: 5,
      label: 'Viện nghiên cứu',
    },
    {
      value: 6,
      label: 'Liên hệ',
      link: 'https://www.utc.edu.vn/lich-cong-tac#footer',
    },
  ];

  const BUTTONS = [
    {
      value: 1,
      label: 'Đăng nhập',
      onClick: handleLogin,
    },
    {
      value: 2,
      label: 'Đăng kí',
      onClick: handleRegister,
    },
  ];

  const authCtx = useContext(AuthContext);
  const history = useNavigate();

  function handleLogin() {
    history(PATH_NAME.LOGIN);
  }

  function handleRegister() {
    history(PATH_NAME.REGISTER);
  }

  const renderOptions = () => {
    return OPTIONS.map((item) => (
      <div
        className="toe-header-top-bar__item"
        key={item.value}
        onClick={() => {
          window.open(item.link, '_blank');
        }}
      >
        {item.label}
      </div>
    ));
  };

  const renderRight = () => {
    if (authCtx.isLoggedIn) return null;
    return BUTTONS.map((item) => (
      <div
        className="toe-header-top-bar__item"
        onClick={item.onClick}
        key={item.value}
      >
        {item.label}
      </div>
    ));
  };

  return (
    <div className="toe-header-top-bar toe-font-body">
      <div className="toe-header-top-bar__container">
        <div className="toe-header-top-bar__section">{renderOptions()}</div>
        <div className="toe-header-top-bar__section">{renderRight()}</div>
      </div>
    </div>
  );
};

export default HeaderTopBar;
