import { LoadingOutlined } from '@ant-design/icons';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import baseApi from '../../../../api/baseApi';
import RegisterBg from '../../../../assets/images/register.svg';
// import MainLogo from '../../../../assets/images/toeiclogo.png';
import MainLogo from '../../../../assets/images/LogoUTC.jpg';
import { Toast } from 'primereact/toast';
import {
  BUTTON_TYPE,
  KEY_CODE,
  PATH_NAME,
  REGEX,
} from '../../../../constants/commonConstant';
import { buildClass } from '../../../../constants/commonFunction';
import END_POINT from '../../../../constants/endpoint';
import Button from '../../../atomics/base/Button/Button';
import Modal from '../../../atomics/base/Modal/Modal';
import './registerPage.scss';

RegisterPage.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
};

RegisterPage.defaultProps = {
  id: '',
  className: '',
  style: {},
};

function RegisterPage() {
  const toast = useRef(null);
  const [registerInfo, setRegisterInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const registerObjectRef = useRef({});

  const [validate, setValidate] = useState({
    email: true,
    password: true,
    rePassword: true,
    userName: true,
  });

  const regex = new RegExp(REGEX.EMAIL);
  const navigate = useNavigate();

  const handleRegister = () => {
    if (
      !validate.email ||
      !validate.password ||
      !validate.rePassword ||
      !validate.userName
    )
      return;

    if (
      !isEmail(registerInfo?.email) ||
      !isPassw(registerInfo?.password) ||
      registerInfo?.password !== registerInfo?.rePassword ||
      !registerInfo?.userName?.toString()?.trim()?.length
    )
      return;

    handleAdd();

    // setIsLoading(true);
    // setTimeout(() => {
    //   setIsLoading(false);
    //   navigate(PATH_NAME.LOGIN);
    // }, 1000);
  };

  const handleAdd = () => {
    let _body = {
      ...registerInfo,
      createdDate: new Date(Date.now() + 7 * 60 * 60 * 1000),
      createdBy: registerInfo.userName,
      modifiedDate: new Date(Date.now() + 7 * 60 * 60 * 1000),
      modifiedBy: registerInfo.userName,
    };

    baseApi.post(
      (res) => {
        if (res.data > 0) {
          toast.current.show({
            severity: 'success',
            summary: 'Success',
            detail: 'Đăng kí thành công',
            life: 3000,
          });
          setTimeout(() => {
            navigate(PATH_NAME.LOGIN);
          }, 1000);
        } else {
          toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Đăng kí thất bại',
            life: 3000,
          });
        }
        setIsLoading(false);
      },
      (err) => {
        let errMessage = err?.response?.data?.data || 'Có lỗi xảy ra';
        toast.current.show({
          severity: 'error',
          summary: 'Đăng kí thất bại',
          detail: errMessage,
          life: 3000,
        });
        setIsLoading(false);
      },
      () => {
        setIsLoading(true);
      },
      END_POINT.TOE_INSERT_USER,
      _body,
      null,
      null
    );
  };
  const isEmail = (email) => {
    return regex.test(email);
  };

  const isPassw = (passw) => {
    return passw?.trim()?.length >= 6;
  };

  const handleChangeControl = (e) => {
    let val = e.target.value;
    registerObjectRef.current[e.target.name] = val;
    switch (e.target.name) {
      case 'userName':
        setValidate({ ...validate, userName: val?.trim().length });
        break;
      case 'email':
        setValidate({ ...validate, email: isEmail(val) });
        break;
      case 'password':
        setValidate({ ...validate, password: isPassw(val) });
        // setValidate({
        //   ...validate,
        //   rePassword:
        //     isPassw(val) &&
        //     registerObjectRef.current?.rePassword ===
        //       registerObjectRef.current?.password,
        // });
        break;
      case 'rePassword':
        setValidate({
          ...validate,
          rePassword:
            registerObjectRef.current?.rePassword ===
            registerObjectRef.current?.password,
        });
        break;
    }

    setRegisterInfo({
      ...registerInfo,
      [e.target.name]: val,
    });
  };

  return (
    <div className={buildClass(['toe-register-page'])}>
      <Toast ref={toast}></Toast>
      <div
        className="toe-register-page__head"
        onClick={() => navigate(PATH_NAME.HOME)}
      >
        <img src={MainLogo} alt="logo" />
        <b className="name-app">
          Thư viện<span style={{ color: '#43c1c9' }}>GTVT</span>
        </b>
      </div>
      <div className="toe-register-page__body"></div>
      <img className="toe-register-page-bg" src={RegisterBg} alt="login" />
      <Modal
        title={'Chào mừng bạn đến với Thư viện GTVT'}
        children={
          <div className="toe-register-page__modal-body">
            <div className="toe-register-page__modal-body__des toe-font-body">
              Vui lòng đăng kí tài khoản để trải nghiệm website 🚀!{' '}
              <span
                className="text-high-light"
                onClick={() => navigate(PATH_NAME.LOGIN)}
              >
                Đăng nhập
              </span>
            </div>
            <div className="toe-register-page__modal-body__group-input">
              <span className="p-float-label">
                <InputText
                  id="username"
                  name="userName"
                  disabled={isLoading}
                  onChange={handleChangeControl}
                  placeholder="Tên người dùng"
                  autoFocus
                  className={buildClass([
                    !validate.userName && 'toe-control-validate',
                  ])}
                  onKeyPress={(e) => {
                    if (e.charCode === KEY_CODE.ENTER) {
                      handleRegister();
                    }
                  }}
                />
                {!validate.userName && (
                  <span className="toe-label-validate">
                    Nhập tên người dùng.
                  </span>
                )}
              </span>
              <span className="p-float-label">
                <InputText
                  id="email"
                  name="email"
                  disabled={isLoading}
                  onChange={handleChangeControl}
                  placeholder="Email"
                  className={buildClass([
                    !validate.email && 'toe-control-validate',
                  ])}
                  onKeyPress={(e) => {
                    if (e.charCode === KEY_CODE.ENTER) {
                      handleRegister();
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
                  id="password"
                  name="password"
                  disabled={isLoading}
                  onChange={handleChangeControl}
                  toggleMask
                  placeholder="Mật khẩu"
                  weakLabel="Yếu"
                  mediumLabel="Vừa"
                  strongLabel="Mạnh"
                  className={buildClass([
                    !validate.password && 'toe-control-validate',
                  ])}
                  onKeyPress={(e) => {
                    if (e.charCode === KEY_CODE.ENTER) {
                      handleRegister();
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

              <span className="p-float-label">
                <Password
                  id="repassword"
                  name="rePassword"
                  disabled={isLoading}
                  onChange={handleChangeControl}
                  toggleMask
                  placeholder="Nhập lại mật khẩu"
                  weakLabel="Yếu"
                  mediumLabel="Vừa"
                  strongLabel="Mạnh"
                  className={buildClass([
                    !validate.rePassword && 'toe-control-validate',
                  ])}
                  onKeyPress={(e) => {
                    if (e.charCode === KEY_CODE.ENTER) {
                      handleRegister();
                    }
                  }}
                  panelStyle={{ display: 'none' }}
                />
                {!validate.rePassword && (
                  <span className="toe-label-validate">
                    Mật khẩu mới phải giống mật khẩu cũ.
                  </span>
                )}
              </span>
            </div>
          </div>
        }
        className="toe-register-page__modal"
        noXIcon
        footerRight={[
          <Button
            disabled={
              !isEmail(registerInfo?.email) ||
              !isPassw(registerInfo?.password) ||
              registerInfo?.password !== registerInfo?.rePassword ||
              !registerInfo?.userName?.toString()?.trim()?.length
            }
            type={BUTTON_TYPE.RIGHT_ICON}
            rightIcon={isLoading ? <LoadingOutlined /> : null}
            onClick={handleRegister}
            name="Đăng ký"
          />,
        ]}
      />
    </div>
  );
}

export default RegisterPage;
