import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import baseApi from '../../../../../api/baseApi';
import {
  ADDRESS_TYPE,
  GUID_NULL,
} from '../../../../../constants/commonConstant';
import { listToTree } from '../../../../../constants/commonFunction';
import END_POINT from '../../../../../constants/endpoint';
import Input from '../../../../atomics/base/Input/Input';
import Modal from '../../../../atomics/base/ModalV2/Modal';
import Dropdown from '../../../../molecules/Dropdown/Dropdown';
import './popupCreateSafeAddress.scss';

PopupCreateSafeAddress.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  show: PropTypes.bool,
  onClose: PropTypes.func,
  onChange: PropTypes.func,
  defaultValue: PropTypes.object,
};

PopupCreateSafeAddress.defaultProps = {
  id: '',
  className: '',
  style: {},
  show: false,
  onClose: () => {},
  onChange: () => {},
  defaultValue: null,
};

function PopupCreateSafeAddress(props) {
  const { show, id, className, style, onClose, onChange, defaultValue } = props;

  const DROPDOWN_TYPE_OPTIONS = [
    {
      label: 'IP',
      value: ADDRESS_TYPE.IP,
    },
    {
      label: 'MAC',
      value: ADDRESS_TYPE.MAC,
    },
  ];

  const DEFAULT_VALUE = {
    status: true,
    type: ADDRESS_TYPE.IP,
  };

  //#region state
  const [isActive, setIsActive] = useState(true);

  const [data, setData] = useState(defaultValue ?? DEFAULT_VALUE);
  const [dataTable, setDataTable] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  //#endregion

  //#endregion
  useEffect(() => {
    getMenus();
  }, []);

  useEffect(() => {
    onChange(data);
  }, [data]);
  //#region

  //#region  methods
  const getMenus = () => {
    baseApi.get(
      (res) => {
        let _data = res.map((item) => ({
          ...item,
          key: item?.menuID,
          label: item?.title,
        }));
        _data = listToTree(_data);
        _data = [{ key: GUID_NULL, label: '--ROOT--' }, ..._data];
        setDataTable(_data);
      },
      (err) => {},
      () => {},
      END_POINT.TOE_GET_MENUS,
      null,
      null
    );
  };
  //#endregion

  return (
    <Modal
      {...props}
      onClose={onClose}
      show={show}
      className="toe-popup-create-safe-address"
      maximizable={false}
    >
      <div className="toe-popup-create-safe-address__right">
        <div className="toe-popup-create-safe-address__row">
          <Input
            autoFocus
            hasRequiredLabel
            label="Mã thiết bị"
            placeholder="Nhập mã thiết bị"
            defaultValue={data.deviceCode}
            onChange={(e) => {
              setData({
                ...data,
                deviceCode: e?.trim(),
              });
            }}
          />
        </div>
        <div className="toe-popup-create-safe-address__row">
          <Input
            autoFocus
            hasRequiredLabel
            label="Tên thiết bị"
            placeholder="Nhập tên thiết bị"
            defaultValue={data.deviceName}
            onChange={(e) => {
              setData({
                ...data,
                deviceName: e?.trim(),
              });
            }}
          />
        </div>
        <div className="toe-popup-create-safe-address__row">
          <Input
            autoFocus
            hasRequiredLabel
            label="Địa chỉ"
            placeholder="Nhập địa chỉ"
            defaultValue={data.safeAddressValue}
            onChange={(e) => {
              setData({
                ...data,
                safeAddressValue: e?.trim(),
              });
            }}
          />
        </div>
        <div className="toe-popup-create-safe-address__row">
          <span className="toe-font-label">Loại địa chỉ</span>
          <Dropdown
            defaultValue={data.type}
            onChange={(e) => {
              let _data = { ...data, type: e.value };
              setData(_data);
            }}
            options={DROPDOWN_TYPE_OPTIONS}
          />
        </div>
      </div>
    </Modal>
  );
}

export default PopupCreateSafeAddress;
