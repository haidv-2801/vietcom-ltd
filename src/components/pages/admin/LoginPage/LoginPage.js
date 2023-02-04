import { LoadingOutlined, LoginOutlined } from '@ant-design/icons';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import { Toast } from 'primereact/toast';
import PropTypes from 'prop-types';
import React, { useContext, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import baseApi from '../../../../api/baseApi';
import LoginBg from '../../../../assets/images/login.svg';
// import MainLogo from '../../../../assets/images/toeiclogo.png';
import MainLogo from '../../../../assets/images/LogoUTC.jpg';
import {
  BUTTON_TYPE,
  CHECKBOX_TYPE,
  KEY_CODE,
  LOCAL_STORATE_KEY,
  PATH_NAME,
  REGEX,
  STATUS_CODE,
} from '../../../../constants/commonConstant';
import { buildClass, ParseJson } from '../../../../constants/commonFunction';
import END_POINT from '../../../../constants/endpoint';
import {
  AuthContext,
  getLocalStorage,
  removeLocalStorage,
  setLocalStorage,
} from '../../../../contexts/authContext';
import { appAction } from '../../../../redux/slices/appSlice';
import Button from '../../../atomics/base/Button/Button';
import Modal from '../../../atomics/base/Modal/Modal';
import RadioButton from '../../../atomics/base/RadioButton/RadioButton';
import './loginPage.scss';

LoginPage.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
};

LoginPage.defaultProps = {
  id: '',
  className: '',
  style: {},
};

function LoginPage(props) {
  const { id, className, style } = props;

  const authCtx = useContext(AuthContext);
  const toast = useRef(null);
  const dispatch = useDispatch();
  const selector = useSelector((store) => store.app);
  const [loginInfo, setloginInfo] = useState(
    ParseJson(getLocalStorage(LOCAL_STORATE_KEY.REMEMBER_ME)) ?? {}
  );
  const [validate, setvalidate] = useState({ email: true, password: true });
  const [isLoading, setIsLoading] = useState(false);
  const [remember, setRemember] = useState(
    ParseJson(getLocalStorage(LOCAL_STORATE_KEY.REMEMBER_ME))?.remember
  );
  const regex = new RegExp(REGEX.EMAIL);
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!validate.email || !validate.password) return;

    //login
    callApiLogin();
  };

  const callApiLogin = () => {
    baseApi.post(
      (res) => {
        authCtx.login(res.token, res);

        const path = selector.history;
        if (path?.length) {
          navigate(path[0]);
          dispatch(appAction.changeHistory([]));
          return;
        }
        navigate('/admin');
        //xử lý nhớ mật khẩu
        if (remember)
          setLocalStorage(
            LOCAL_STORATE_KEY.REMEMBER_ME,
            JSON.stringify({
              password: loginInfo.password,
              email: loginInfo.email,
              remember: remember,
            })
          );
        else removeLocalStorage(LOCAL_STORATE_KEY.REMEMBER_ME);
      },
      (err) => {
        switch (err?.response?.status) {
          case STATUS_CODE.UNAUTHORIZE:
            toast.current.show({
              severity: 'error',
              summary: 'Lỗi',
              detail: 'Tài khoản hoặc mật khẩu không đúng',
              life: 3000,
            });
            break;
          case STATUS_CODE.BAD_REQUEST:
          default:
            toast.current.show({
              severity: 'error',
              summary: 'Lỗi',
              detail: 'Có lỗi xảy ra',
              life: 3000,
            });
            break;
        }
        setIsLoading(false);
      },
      () => {
        setIsLoading(true);
      },
      END_POINT.TOE_USER_LOGIN,
      loginInfo
    );
  };

  const isEmail = (email) => {
    return regex.test(email);
  };

  const isPassw = (passw) => {
    return passw?.trim()?.length >= 6;
  };

  const handleChangeControl = (e) => {
    switch (e.target.name) {
      case 'email':
        // setvalidate({ ...validate, email: isEmail(e.target.value) });
        break;
      case 'password':
        // setvalidate({ ...validate, password: isPassw(e.target.value) });
        break;
    }
    setloginInfo({
      ...loginInfo,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className={buildClass(['toe-login-page'])}>
      <Toast ref={toast}></Toast>
      <div
        className="toe-login-page__head"
        onClick={() => {
          navigate(PATH_NAME.HOME);
        }}
      >
        <img src={MainLogo} alt="logo" />
        <b className="name-app">
          Thư viện<span style={{ color: '#43c1c9' }}>GTVT</span>
        </b>
      </div>
      <div className="toe-login-page__body"></div>
      <img className="toe-login-page-bg" src={LoginBg} alt="login" />
      <Modal
        title={' Chào mừng bạn đến với Thư viện GTVT'}
        children={
          <div className="toe-login-page__modal-body">
            <div className="toe-login-page__modal-body__des toe-font-body">
              Vui lòng đăng nhập để trải nghiệm website 🚀!{' '}
              <span
                className="text-high-light"
                onClick={() => navigate(PATH_NAME.REGISTER)}
              >
                Tôi chưa có tài khoản
              </span>
            </div>
            <div className="toe-login-page__modal-body__group-input">
              <span className="p-float-label">
                <InputText
                  disabled={isLoading}
                  id="email"
                  name="email"
                  autoFocus
                  className={buildClass([
                    !validate.email && 'toe-control-validate',
                  ])}
                  value={loginInfo?.email ?? ''}
                  onChange={handleChangeControl}
                  placeholder="Email"
                  onKeyPress={(e) => {
                    if (e.charCode === KEY_CODE.ENTER) {
                      handleLogin();
                    }
                  }}
                />
                {!validate.email && (
                  <span className="toe-label-validate">
                    Vui lòng nhập email hợp lệ.
                  </span>
                )}
              </span>
              <span className="p-float-label">
                <Password
                  disabled={isLoading}
                  id="password"
                  name="password"
                  className={buildClass([
                    !validate.password && 'toe-control-validate',
                  ])}
                  value={loginInfo?.password ?? ''}
                  onChange={handleChangeControl}
                  toggleMask
                  placeholder="Mật khẩu"
                  weakLabel="Yếu"
                  mediumLabel="Vừa"
                  strongLabel="Mạnh"
                  onKeyPress={(e) => {
                    if (e.charCode === KEY_CODE.ENTER) {
                      handleLogin();
                    }
                  }}
                  panelStyle={{ display: 'none' }}
                />
                {!validate.password && (
                  <span className="toe-label-validate">
                    Mật khẩu ít nhất 6 kí tự.
                  </span>
                )}
              </span>
              <div className="remember-password toe-font-body">
                <RadioButton
                  checked={remember}
                  onChange={() => setRemember(!remember)}
                  className="radio-button"
                />{' '}
                Nhớ mật khẩu
              </div>
            </div>
          </div>
        }
        className="toe-login-page__modal"
        noXIcon
        footerRight={[
          <Button
            onClick={handleLogin}
            rightIcon={isLoading ? <LoadingOutlined /> : <LoginOutlined />}
            type={BUTTON_TYPE.RIGHT_ICON}
            name="Đăng nhập"
            disabled={
              !loginInfo?.email?.trim().length > 0 ||
              !loginInfo?.password?.trim().length > 0
              // !isEmail(loginInfo?.email) || !isPassw(loginInfo?.password)
            }
          />,
        ]}
      />
    </div>
  );
}

export default LoginPage;
