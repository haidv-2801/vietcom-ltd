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
import InputPassword from '../../../../atomics/base/InputPassword/InputPassword';
import './popupCreateRole.scss';

PopupCreateRole.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  show: PropTypes.bool,
  onClose: PropTypes.func,
  onChange: PropTypes.func,
  defaultValue: PropTypes.any,
};

PopupCreateRole.defaultProps = {
  id: '',
  className: '',
  style: {},
  show: false,
  onClose: () => {},
  onChange: () => {},
  defaultValue: null,
};

function PopupCreateRole(props) {
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
            label="T??n t??i kho???n"
            placeholder="Nh???p t??n t??i kho???n"
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
            placeholder="Nh???p email"
            defaultValue={dataCreate?.email}
            onChange={(d) => setDataCreate({ ...dataCreate, email: d?.trim() })}
          />
        </div>
        <div className="toe-popup-create-user__row">
          <Input
            hasRequiredLabel
            label="H??? v?? t??n"
            placeholder="Nh???p h??? v?? t??n"
            defaultValue={dataCreate?.fullName}
            onChange={(d) =>
              setDataCreate({ ...dataCreate, fullName: d?.trim() })
            }
          />
        </div>
        <div className="toe-popup-create-user__row">
          <Input
            hasRequiredLabel
            label="S??? ??i???n tho???i"
            placeholder="Nh???p s??? ??i???n tho???i"
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
                label="M???t kh???u"
                placeholder="Nh???p m???t kh???u (t???i thi???u 8 k?? t???)"
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
                label="Nh???p l???i m???t kh???u"
                placeholder="Nh???p l???i m???t kh???u"
              />
            </div>
          </>
        ) : null}
      </div>
    </Modal>
  );
}

export default PopupCreateRole;
