import { PlusOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { Chip } from 'primereact/chip';
import { Skeleton } from 'primereact/skeleton';
import { Toast } from 'primereact/toast';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'react-string-format';
import baseApi from '../../../../api/baseApi';
import {
  BUTTON_THEME,
  BUTTON_TYPE,
  MENU_TYPE,
  TEXT_FALL_BACK,
  OPERATOR,
  GUID_NULL,
  ADDRESS_TYPE,
} from '../../../../constants/commonConstant';
import { buildClass } from '../../../../constants/commonFunction';
import END_POINT from '../../../../constants/endpoint';
import Button from '../../../atomics/base/Button/Button';
import Input from '../../../atomics/base/Input/Input';
import SmartText from '../../../atomics/base/SmartText/SmartText';
import Paginator from '../../../molecules/Paginator/Paginator';
import Table from '../../../molecules/Table/Table';
import Layout from '../../../sections/Admin/Layout/Layout';
import PopupCreateMenu from './PopupCreateSafeAddress/PopupCreateSafeAddress';
import Dropdown from '../../../molecules/Dropdown/Dropdown';
import './safeAddressPage.scss';
import { getUserName } from '../../../../constants/commonAuth';
import PopupCreateSafeAddress from './PopupCreateSafeAddress/PopupCreateSafeAddress';

SafeAddressPage.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
};

SafeAddressPage.defaultProps = {
  id: '',
  className: '',
  style: {},
};

function SafeAddressPage(props) {
  const { id, style, className } = props;

  const navigate = useNavigate();
  const toast = useRef(null);

  //#region
  const COLUMNS = [
    {
      field: 'checkbox',
      selectionMode: 'multiple',
      headerStyle: { width: '3em' },
    },
    {
      field: 'deviceCode',
      sortable: true,
      header: 'Mã thiết bị',
      filterField: 'deviceCode',
      body: (row) => {
        if (isLoading) return <Skeleton></Skeleton>;
        return <SmartText>{row.deviceCode ?? TEXT_FALL_BACK.TYPE_1}</SmartText>;
      },
    },
    {
      field: 'deviceName',
      sortable: true,
      header: 'Mã thiết bị',
      filterField: 'deviceName',
      body: (row) => {
        if (isLoading) return <Skeleton></Skeleton>;
        return <SmartText>{row.deviceName ?? TEXT_FALL_BACK.TYPE_1}</SmartText>;
      },
    },
    {
      field: 'addressName',
      sortable: true,
      header: 'Loại địa chỉ',
      filterField: 'addressName',
      body: (row) => {
        if (isLoading) return <Skeleton></Skeleton>;
        let name = TEXT_FALL_BACK.TYPE_1;
        switch (row.type) {
          case ADDRESS_TYPE.IP:
            name = 'IP';
            break;
          case ADDRESS_TYPE.MAC:
            name = 'MAC';
            break;
          default:
            break;
        }
        return <SmartText>{name}</SmartText>;
      },
    },
    {
      field: 'safeAddressValue',
      sortable: true,
      header: 'Giá trị',
      filterField: 'safeAddressValue',
      body: (row) => {
        return (
          <div className="toe-font-body">
            {
              <SmartText>
                {row.safeAddressValue || TEXT_FALL_BACK.TYPE_1}
              </SmartText>
            }
          </div>
        );
      },
    },
    {
      field: 'status',
      header: 'Trạng thái',
      filterField: 'status',
      body: (row) => {
        return <div className="toe-font-body">{renderStatus(row?.status)}</div>;
      },
    },
  ];

  const POPUP_MODE = {
    EDIT: 0,
    ADD: 1,
  };

  const DROPDOWN_TYPE_OPTIONS = [
    {
      label: 'Tất cả',
      value: -1,
    },
    {
      label: 'IP',
      value: ADDRESS_TYPE.IP,
    },
    {
      label: 'MAC',
      value: ADDRESS_TYPE.MAC,
    },
  ];

  const MIN_PAGE_SIZE = 10;
  const requestDoneRef = useRef(true);

  const [isShowPopupCreateSafeAddress, setIsShowPopupCreateSafeAddress] =
    useState(false);
  const [selected, setSelected] = useState([]);
  const [popupMode, setPopupMode] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [lazyParams, setLazyParams] = useState({ page: 1, rows: 10 });
  const [totalRecords, setTotalRecords] = useState(0);
  const [dataTable, setDataTable] = useState([]);
  const [paging, setPaging] = useState({
    filterValue: '',
    page: 1,
    pageSize: MIN_PAGE_SIZE,
    type: -1,
  });
  const [dataCreate, setDataCreate] = useState({});
  const [dataDetail, setDataDetail] = useState(null);
  const [dataMenus, setDataMenus] = useState([]);

  const OPTIONS = [
    // {
    //   label: (
    //     <div className="table-option__menu-item">
    //       <i className="pi pi-eye"></i>Xem chi tiết
    //     </div>
    //   ),
    //   value: 1,
    //   onClick: (e) => console.log('first', e),
    // },
    {
      label: (
        <div className="table-option__menu-item">
          <i className="pi pi-pencil"></i>Sửa
        </div>
      ),
      value: 2,
      onClick: ({ key }) => handleEdit(key),
    },
    {
      label: (
        <div className="table-option__menu-item">
          <i className="pi pi-arrows-h"></i>Đổi trạng thái
        </div>
      ),
      value: 4,
      onClick: ({ key }) => handleActive(key),
    },
    {
      label: (
        <div className="table-option__menu-item" style={{ color: 'red' }}>
          <i className="pi pi-trash"></i>Xóa
        </div>
      ),
      value: 3,
      onClick: ({ key }) => handleRemove(key),
    },
  ];

  const CONFIGS = {
    /**
     * *Config
     */
    resizableColumns: false,
    dataKey: 'safeAddressID',
    selectionMode: isLoading ? null : 'checkbox',
    sortField: lazyParams?.sortField,
    sortOrder: lazyParams?.sortOrder,
    selection: selected,
    reorderableColumns: false,
    scrollHeight: 'calc(100% - 500px)',

    /**
     * *Method
     */
    onSort: (event) => {
      console.log(event);
    },
    onSelectionChange: (event) => {
      setSelected(event.value);
    },
    onSort: (event) => {
      setLazyParams(event);
    },
    onPage: (event) => {
      setLazyParams(event);
    },
  };

  useEffect(() => {
    getSafeAddressesFilter();
    getSafeAddresses();
  }, []);

  useEffect(() => {
    if (isLoading) return;
    getSafeAddressesFilter();
  }, [paging]);

  const renderColumnParentMenu = (id) => {
    if (isLoading) return <Skeleton></Skeleton>;
    let item = dataMenus.filter((item) => item.safeAddressID === id);
    if (item.length) {
      return item[0].title;
    }
    return TEXT_FALL_BACK.TYPE_1;
  };

  const getSafeAddresses = () => {
    baseApi.get(
      (res) => {
        setDataMenus(res);
      },
      (err) => {},
      () => {},
      END_POINT.TOE_GET_MENUS,
      null,
      null
    );
  };

  const getPopupCreateMenuPops = () => {
    if (popupMode === POPUP_MODE.ADD) {
      return {
        title: 'Thêm mới địa chỉ',
        footerRight: [
          <Button
            onClick={() => setIsShowPopupCreateSafeAddress(false)}
            theme={BUTTON_THEME.THEME_6}
            name="Hủy"
          />,
          <Button name="Thêm" onClick={handleAdd} />,
        ],
      };
    } else if (popupMode === POPUP_MODE.EDIT) {
      return {
        title: 'Sửa địa chỉ',
        footerRight: [
          <Button
            onClick={() => setIsShowPopupCreateSafeAddress(false)}
            name="Hủy"
            theme={BUTTON_THEME.THEME_6}
          />,
          <Button name="Cập nhập" onClick={handleSave} />,
        ],
      };
    }
  };

  const getSafeAddressesFilter = () => {
    let _filter = [['IsDeleted', OPERATOR.EQUAL, '0']];
    if (paging.filterValue?.trim() != '') {
      _filter.push(OPERATOR.AND);
      _filter.push([
        ['SafeAddressValue', OPERATOR.CONTAINS, encodeURI(paging.filterValue)],
      ]);
    }
    if (+paging.type !== -1) {
      _filter.push(OPERATOR.AND);
      _filter.push(['Type', OPERATOR.EQUAL, +paging.type]);
    }

    baseApi.post(
      (res) => {
        let _data = res.data.pageData.sort((a, b) => {
          const time = (date) => new Date(date).getTime();
          if (time(b?.createdDate) - time(a?.modifiedDate) > 0) {
            return time(b?.createdDate) - time(a?.createdDate);
          } else {
            return time(b?.modifiedDate) - time(a?.modifiedDate);
          }
        });

        setDataTable([..._data]);
        setIsLoading(false);
        setTotalRecords(res.data.totalRecord);
        requestDoneRef.current = true;
      },
      (err) => {
        setIsLoading(false);
        requestDoneRef.current = true;
      },
      () => {
        setIsLoading(true);
        requestDoneRef.current = false;
      },
      END_POINT.TOE_SAFE_ADDRESS_FILTER,
      {
        filter: btoa(JSON.stringify(_filter)),
        pageSize: paging.pageSize,
        pageIndex: paging.page,
      },
      null
    );
  };

  const handleEdit = (key) => {
    const item = dataTable.filter((_) => _.safeAddressID === key);
    if (item.length) {
      setPopupMode(POPUP_MODE.EDIT);
      setIsShowPopupCreateSafeAddress(true);
      setDataDetail(item[0]);
    }
  };

  const handleSave = () => {
    let _body = {
      ...dataCreate,
      modifiedDate: new Date(Date.now() + 7 * 60 * 60 * 1000),
      modifiedBy: getUserName(),
    };

    baseApi.put(
      (res) => {
        if (res.data > 0) {
          toast.current.show({
            severity: 'success',
            summary: 'Success',
            detail: 'Cập nhật thành công',
            life: 3000,
          });
          getSafeAddressesFilter();
        } else {
          toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Cập nhật thất bại',
            life: 3000,
          });
        }
        setIsShowPopupCreateSafeAddress(false);
      },
      (err) => {
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Cập nhật thất bại',
          life: 3000,
        });
      },
      () => {},
      format(END_POINT.TOE_UPDATE_SAFE_ADDRESS, dataDetail.safeAddressID),
      _body,
      null,
      null
    );
  };

  const handleAdd = () => {
    let _body = {
      ...dataCreate,
      createdDate: new Date(Date.now() + 7 * 60 * 60 * 1000),
      createdBy: getUserName(),
      modifiedDate: new Date(Date.now() + 7 * 60 * 60 * 1000),
      modifiedBy: getUserName(),
    };

    baseApi.post(
      (res) => {
        if (res.data > 0) {
          toast.current.show({
            severity: 'success',
            summary: 'Success',
            detail: 'Thêm mới thành công',
            life: 3000,
          });
          getSafeAddressesFilter();
        } else {
          toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Thêm mới thất bại',
            life: 3000,
          });
        }
        setIsShowPopupCreateSafeAddress(false);
      },
      (err) => {
        let errMessage = err?.response?.data?.data || 'Có lỗi xảy ra';
        toast.current.show({
          severity: 'error',
          summary: 'Thêm mới thất bại',
          detail: errMessage,
          life: 3000,
        });
      },
      () => {},
      END_POINT.TOE_INSERT_SAFE_ADDRESS,
      _body,
      null,
      null
    );
  };

  const handleActive = (key) => {
    let _body = dataTable.filter((item) => item?.safeAddressID === key);
    if (_body.length) {
      _body = _body[0];
      _body['status'] = !_body['status'];
      _body['modifiedDate'] = new Date(Date.now() + 7 * 60 * 60 * 1000);

      baseApi.put(
        (res) => {
          if (res.data > 0) {
            toast.current.show({
              severity: 'success',
              summary: 'Success',
              detail: 'Sửa thành công',
              life: 3000,
            });
            getSafeAddressesFilter();
          }
        },
        (err) => {
          toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Sửa thất thất bại',
            life: 3000,
          });
        },
        () => {},
        format(END_POINT.TOE_UPDATE_SAFE_ADDRESS, _body?.safeAddressID),
        _body,
        null
      );
    }
  };

  const handleRemove = (key) => {
    baseApi.delete(
      (res) => {
        if (res.data > 0) {
          toast.current.show({
            severity: 'success',
            summary: 'Success',
            detail: 'Xóa thành công',
            life: 3000,
          });
          getSafeAddressesFilter();
        }
      },
      (err) => {
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Xóa thất bại',
          life: 3000,
        });
      },
      () => {},
      format(END_POINT.TOE_DELETE_SAFE_ADDRESS, key)
    );
  };

  const renderSkeleton = () => {
    let number = Math.min(MIN_PAGE_SIZE, totalRecords || MIN_PAGE_SIZE),
      arr = [],
      obj = {};

    for (const column of COLUMNS) {
      obj[column.field] = <Skeleton></Skeleton>;
    }

    for (let index = 0; index < number; index++) {
      arr.push(obj);
    }

    return arr;
  };

  function renderStatus(status) {
    if (isLoading) return <Skeleton></Skeleton>;
    switch (status) {
      case true:
        return (
          <Chip
            style={{ backgroundColor: '#00A17A', color: '#fff' }}
            className="toe-font-body"
            label="Hoạt động"
          />
        );
        break;
      case false:
        return <Chip className="toe-font-body" label="Ngừng hoạt động" />;
        break;
      default:
        return null;
        break;
    }
  }

  //#endregion

  return (
    <Layout
      title="Quản lý địa chỉ truy cập"
      rightButtons={[
        <Button
          onClick={() => {
            setDataDetail(null);
            setIsShowPopupCreateSafeAddress(true);
            setPopupMode(POPUP_MODE.ADD);
          }}
          leftIcon={<PlusOutlined />}
          type={BUTTON_TYPE.LEFT_ICON}
          name="Thêm địa chỉ"
        />,
      ]}
    >
      <div
        id={id}
        style={style}
        className={buildClass(['toe-admin-safe-address-page', className])}
      >
        <div className="toe-admin-safe-address-page__toolbar">
          <div className="toe-admin-safe-address-page__row">
            <Input
              onChange={(value) => {
                setPaging({
                  ...paging,
                  filterValue: value?.trim(),
                });
              }}
              placeholder={'Tìm kiếm địa chỉ'}
              value={paging.filterValue}
              leftIcon={<i className="pi pi-search"></i>}
              delay={300}
            />

            <Dropdown
              className="dropdown-filter-by-menu"
              defaultValue={paging.type}
              options={DROPDOWN_TYPE_OPTIONS}
              hasSubLabel
              prefixValue={'Loại địa chỉ'}
              scrollHeight={350}
              onChange={({ value }) => setPaging({ ...paging, type: value })}
            />
          </div>
          {selected?.length ? (
            <Tooltip placement="bottomLeft" title="Xóa bản ghi">
              <i
                style={{ color: 'red', marginLeft: 'auto' }}
                className="pi pi-trash"
              ></i>
            </Tooltip>
          ) : null}
        </div>
        <Table
          data={isLoading ? renderSkeleton() : dataTable}
          configs={CONFIGS}
          columns={COLUMNS}
          hasOption
          options={OPTIONS}
          rowClassName={(row) =>
            buildClass([row.parentID === GUID_NULL && 'menu-root'])
          }
        />
        <Paginator
          onChange={({ page, pageSize }) => {
            setPaging({ ...paging, page, pageSize });
          }}
          page={paging.page}
          pageSize={paging.pageSize}
          totalRecords={totalRecords}
        />
        {isShowPopupCreateSafeAddress ? (
          <PopupCreateSafeAddress
            show={isShowPopupCreateSafeAddress}
            onClose={() => setIsShowPopupCreateSafeAddress(false)}
            {...getPopupCreateMenuPops()}
            onChange={(data) => {
              setDataCreate(data);
              console.log(data);
            }}
            defaultValue={dataDetail}
          />
        ) : null}
      </div>
      <Toast ref={toast}></Toast>
    </Layout>
  );
}

export default SafeAddressPage;
