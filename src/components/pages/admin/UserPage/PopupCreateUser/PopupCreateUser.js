import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { buildClass } from '../../../../../constants/commonFunction';
import Button from '../../../../atomics/base/Button/Button';
import baseApi from '../../../../../api/baseApi';
import { ADMIN_ENDPOINT } from '../../../../../constants/endpoint';
import {
  BUTTON_TYPE,
  REGEX,
  KEY_CODE,
  BUTTON_THEME,
} from '../../../../../constants/commonConstant';
import SmartText from '../../../../atomics/base/SmartText/SmartText';
import Input from '../../../../atomics/base/Input/Input';
import Modal from '../../../../atomics/base/ModalV2/Modal';
import UpLoadImage from '../../../../molecules/UpLoadImage/UpLoadImage';
import { Password } from 'primereact/password';
import InputPassword from '../../../../atomics/base/InputPassword/InputPassword';
import './popupCreateUser.scss';

PopupCreateUser.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  show: PropTypes.bool,
  onClose: PropTypes.func,
  onChange: PropTypes.func,
  defaultValue: PropTypes.any,
};

PopupCreateUser.defaultProps = {
  id: '',
  className: '',
  style: {},
  show: false,
  onClose: () => {},
  onChange: () => {},
  defaultValue: null,
};

function PopupCreateUser(props) {
  const { show, id, className, style, onClose, defaultValue, onChange } = props;
  const [dataCreate, setDataCreate] = useState(defaultValue ?? {});

  useEffect(() => {
    onChange(dataCreate);
  }, [dataCreate]);

  return (
    <Modal
      {...props}
      onClose={onClose}
      show={show}
      id={id}
      maximizable={false}
      style={style}
      className={buildClass(['toe-popup-create-user', className])}
    >
      <div className="toe-popup-create-user__left">
        <UpLoadImage
          onChange={(img) => setDataCreate({ ...dataCreate, avatar: img })}
        />
      </div>
      <div className="toe-popup-create-user__right">
        <div className="toe-popup-create-user__row">
          <Input
            autoFocus
            hasRequiredLabel
            label="Tên tài khoản"
            placeholder="Nhập tên tài khoản"
            defaultValue={dataCreate?.userName}
            onChange={(d) =>
              setDataCreate({ ...dataCreate, userName: d?.trim() })
            }
          />
        </div>
        <div className="toe-popup-create-user__row">
          <Input
            hasRequiredLabel
            label="Email"
            placeholder="Nhập email"
            defaultValue={dataCreate?.email}
            onChange={(d) => setDataCreate({ ...dataCreate, email: d?.trim() })}
          />
        </div>
        <div className="toe-popup-create-user__row">
          <Input
            hasRequiredLabel
            label="Họ và tên"
            placeholder="Nhập họ và tên"
            defaultValue={dataCreate?.fullName}
            onChange={(d) =>
              setDataCreate({ ...dataCreate, fullName: d?.trim() })
            }
          />
        </div>
        <div className="toe-popup-create-user__row">
          <Input
            hasRequiredLabel
            label="Số điện thoại"
            placeholder="Nhập số điện thoại"
            defaultValue={dataCreate?.phoneNumber}
            onChange={(d) =>
              setDataCreate({ ...dataCreate, phoneNumber: d?.trim() })
            }
          />
        </div>
        {!defaultValue ? (
          <>
            {' '}
            <div className="toe-popup-create-user__row">
              <InputPassword
                hasRequiredLabel
                label="Mật khẩu"
                placeholder="Nhập mật khẩu (tối thiểu 8 kí tự)"
                onChange={(d) =>
                  setDataCreate({
                    ...dataCreate,
                    password: d.target.value?.trim(),
                  })
                }
              />
            </div>
            <div className="toe-popup-create-user__row">
              <InputPassword
                onChange={(d) =>
                  setDataCreate({
                    ...dataCreate,
                    rePassword: d.target.value?.trim(),
                  })
                }
                hasRequiredLabel
                label="Nhập lại mật khẩu"
                placeholder="Nhập lại mật khẩu"
              />
            </div>
          </>
        ) : null}
      </div>
    </Modal>
  );
}

export default PopupCreateUser;
