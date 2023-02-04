import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { buildClass, slugify } from '../../../../../constants/commonFunction';
import Button from '../../../../atomics/base/Button/Button';
import baseApi from '../../../../../api/baseApi';
import END_POINT from '../../../../../constants/endpoint';
import {
  BUTTON_TYPE,
  REGEX,
  KEY_CODE,
  BUTTON_THEME,
  MENU_TYPE,
} from '../../../../../constants/commonConstant';
import SmartText from '../../../../atomics/base/SmartText/SmartText';
import Input from '../../../../atomics/base/Input/Input';
import Modal from '../../../../atomics/base/ModalV2/Modal';
import UpLoadImage from '../../../../molecules/UpLoadImage/UpLoadImage';
import TreeSelect from '../../../../atomics/base/TreeSelect/TreeSelect';
import Dropdown from '../../../../molecules/Dropdown/Dropdown';
import GroupCheck from '../../../../molecules/GroupCheck/GroupCheck';
import { GUID_NULL } from '../../../../../constants/commonConstant';
import { listToTree } from '../../../../../constants/commonFunction';
import InputNumber from '../../../../atomics/base/InputNumber/InputNumber';
import './popupCreateMenu.scss';
import RadioButton from '../../../../atomics/base/RadioButton/RadioButton';

PopupCreateMenu.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  show: PropTypes.bool,
  onClose: PropTypes.func,
  onChange: PropTypes.func,
  defaultValue: PropTypes.object,
};

PopupCreateMenu.defaultProps = {
  id: '',
  className: '',
  style: {},
  show: false,
  onClose: () => {},
  onChange: () => {},
  defaultValue: null,
};

function PopupCreateMenu(props) {
  const { show, id, className, style, onClose, onChange, defaultValue } = props;
  const DROPDOWN_OPTIONS = [
    { label: 'Có hiển thị trang chủ', value: true },
    { label: 'Không hiển thị trang chủ', value: false },
  ];

  const DROPDOWN_TYPE_OPTIONS = [
    {
      label: 'Menu đơn',
      value: MENU_TYPE.HTML_RENDER,
      subLabel: 'Menu chỉ chứa một bài đăng duy nhất',
    },
    {
      label: 'Menu nhiều',
      value: MENU_TYPE.NORMAL,
      subLabel: 'Chứa danh sách các bài đăng',
    },
    {
      label: 'Menu chuyển hướng',
      value: MENU_TYPE.REDIRECT,
      subLabel: 'Trang được chuyển hướng qua đường dẫn hiện tại',
    },
    {
      label: 'Menu tĩnh',
      value: MENU_TYPE.NONE_EVENT,
      subLabel: 'Không có sự kiện và chứa menu',
    },
  ];

  const DEFAULT_VALUE = {
    status: true,
    isShowHome: true,
    title: 'Menu không có tiêu đề',
    slug: slugify('Menu không có tiêu đề'),
    parentID: GUID_NULL,
    displayOrder: 0,
    link: '',
    type: MENU_TYPE.NORMAL,
    isPrivate: false,
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
    let _data = { ...data };

    if (data.type === MENU_TYPE.NONE_EVENT) {
      _data.slug = '';
    } else if (data.type === MENU_TYPE.HTML_RENDER) {
      _data.slug = 'html/' + _data.slug;
    }

    onChange(_data);
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
      className="toe-popup-create-menu"
    >
      <div className="toe-popup-create-menu__right">
        <div className="toe-popup-create-menu__row">
          <Input
            autoFocus
            hasRequiredLabel
            label="Tên menu"
            placeholder="Nhập tên menu"
            defaultValue={data.title}
            onChange={(e) => {
              setData({ ...data, title: e?.trim(), slug: slugify(e) });
            }}
          />
        </div>
        <div className="toe-popup-create-menu__row">
          <span className="toe-font-label">Loại menu</span>
          <Dropdown
            defaultValue={data.type}
            onChange={(e) => {
              let _data = { ...data, type: e.value };
              if (e.value === MENU_TYPE.NONE_EVENT) {
                _data = { ..._data, slug: 'html' };
              }
              setData(_data);
            }}
            hasSubLabel
            options={DROPDOWN_TYPE_OPTIONS}
          />
        </div>
        {data.type === MENU_TYPE.REDIRECT ? (
          <div className="toe-popup-create-menu__row">
            <Input
              hasRequiredLabel
              label="Đường dẫn mới"
              placeholder="VD: https://google.com"
              defaultValue={data.link}
              onChange={(e) => {
                setData({ ...data, link: e });
              }}
            />
          </div>
        ) : data.type !== MENU_TYPE.NONE_EVENT ? (
          <div className="toe-popup-create-menu__row">
            <Input
              hasRequiredLabel
              label="Alias"
              placeholder="Nhập alias"
              controlled
              value={data.slug}
              defaultValue={(function () {
                return data.slug;
              })()}
              onChange={(e) => {
                setData({ ...data, slug: e });
              }}
            />
          </div>
        ) : null}

        <div className="toe-popup-create-menu__row">
          <TreeSelect
            hasRequiredLabel
            label="Menu cha"
            placeholder="Nhấp để chọn"
            value={data.parentID}
            options={dataTable}
            onChange={(data) => {
              setData((pre) => ({ ...pre, parentID: data.value }));
            }}
          />
        </div>
        <div className="toe-popup-create-menu__row">
          <InputNumber
            hasRequiredLabel
            label="Mức độ hiển thị"
            placeholder="Nhập mức độ hiển thị"
            value={data.displayOrder}
            onChange={(e) => {
              setData({ ...data, displayOrder: e });
            }}
          />
        </div>
        <div className="toe-popup-create-menu__row --flex-center">
          <div className="__col">
            {' '}
            <div className="__col-label toe-font-label">Trạng thái</div>
            <RadioButton
              checked={data.isPrivate}
              onChange={(checked) => {
                setData({ ...data, isPrivate: checked });
              }}
              label={'Private menu'}
            />
          </div>
          <div className="__col">
            <div
              className="__col-label toe-font-label"
              style={{ height: 20 }}
            ></div>
            <RadioButton
              checked={data.status}
              onChange={(checked) => {
                setData({ ...data, status: checked });
              }}
              label={'Hoạt động'}
            />
          </div>
        </div>
        <div className="toe-popup-create-menu__row">
          <span className="toe-font-label">Loại hiển thị</span>
          <Dropdown
            defaultValue={data.isShowHome}
            onChange={(e) => {
              setData({ ...data, isShowHome: e.value });
            }}
            options={DROPDOWN_OPTIONS}
          />
        </div>
      </div>
    </Modal>
  );
}

export default PopupCreateMenu;
