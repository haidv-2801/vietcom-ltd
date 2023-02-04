import { PlusOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import moment from 'moment';
import { Chip } from 'primereact/chip';
import { Skeleton } from 'primereact/skeleton';
import { Toast } from 'primereact/toast';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'react-string-format';
import baseApi from '../../../../api/baseApi';
import { uploadFiles } from '../../../../api/firebase';
import { getUserName } from '../../../../constants/commonAuth';
import {
  BUTTON_THEME,
  BUTTON_TYPE,
  DATE_FORMAT,
  TEXT_FALL_BACK,
} from '../../../../constants/commonConstant';
import { buildClass } from '../../../../constants/commonFunction';
import END_POINT from '../../../../constants/endpoint';
import Button from '../../../atomics/base/Button/Button';
import Input from '../../../atomics/base/Input/Input';
import InputPassword from '../../../atomics/base/InputPassword/InputPassword';
import Modal from '../../../atomics/base/ModalV2/Modal';
import SmartText from '../../../atomics/base/SmartText/SmartText';
import Paginator from '../../../molecules/Paginator/Paginator';
import Table from '../../../molecules/Table/Table';
import ToastConfirmDelete from '../../../molecules/ToastConfirmDelete/ToastConfirmDelete';
import Layout from '../../../sections/Admin/Layout/Layout';
import PopupCreateUser from './PopupCreateUser/PopupCreateUser';
import './userPage.scss';

UserPage.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
};

UserPage.defaultProps = {
  id: '',
  className: '',
  style: {},
};

function UserPage(props) {
  const { id, style, className } = props;

  const navigate = useNavigate();
  const toast = useRef(null);
  const [idDeleted, setIdDeleted] = useState(null);

  //#region
  const COLUMNS = [
    {
      field: 'checkbox',
      selectionMode: 'multiple',
      headerStyle: { width: '3em' },
    },
    {
      field: 'userName',
      sortable: true,
      header: 'Tên tài khoản',
      filterField: 'userName',
      body: (row) => {
        return <SmartText>{row?.userName || TEXT_FALL_BACK.TYPE_1}</SmartText>;
      },
      style: { width: 300, maxWidth: 300 },
    },
    {
      field: 'email',
      sortable: true,
      header: 'Email',
      filterField: 'email',
      body: (row) => {
        return (
          <div className="toe-font-body">
            {<SmartText>{row?.email || TEXT_FALL_BACK.TYPE_1}</SmartText>}
          </div>
        );
      },
      style: { width: 350, maxWidth: 350 },
    },
    {
      field: 'fullName',
      sortable: true,
      header: 'Tên người dùng',
      filterField: 'fullName',
      body: (row) => {
        return (
          <div className="toe-font-body">
            {row?.fullName || TEXT_FALL_BACK.TYPE_1}
          </div>
        );
      },
      style: { width: 250, maxWidth: 250 },
    },
    {
      field: 'phoneNumber',
      sortable: true,
      header: 'Số điện thoại',
      filterField: 'phoneNumber',
      body: (row) => {
        return (
          <div className="toe-font-body">
            {row?.phoneNumber || TEXT_FALL_BACK.TYPE_1}
          </div>
        );
      },
      style: { width: 170, maxWidth: 170 },
    },
    {
      field: 'status',
      sortable: true,
      header: 'Trạng thái',
      filterField: 'status',
      body: (row) => {
        return <div className="toe-font-body">{renderStatus(row?.status)}</div>;
      },
      style: { width: 180, maxWidth: 180 },
    },
    {
      field: 'createdDate',
      sortable: true,
      header: 'Ngày tạo',
      filterField: 'createdDate',
      body: (row) => {
        if (isLoading) return <Skeleton></Skeleton>;
        return (
          <div className="toe-font-body">
            {moment(row?.createdDate).format(DATE_FORMAT.TYPE_1)}
          </div>
        );
      },
      // style: { width: 180, maxWidth: 180 },
    },
  ];

  const POPUP_MODE = {
    EDIT: 0,
    ADD: 1,
  };

  const MIN_PAGE_SIZE = 10;
  const requestDoneRef = useRef(true);

  const [isShowPopupCreateUser, setIsShowPopupCreateUser] = useState(false);
  const [isShowPopupChangePassword, setIsShowPopupChangePassword] =
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
  });
  const [dataCreate, setDataCreate] = useState({});
  const [dataDetail, setDataDetail] = useState(null);
  const [dataUsers, setDataUsers] = useState([]);
  const [dataChangePw, setDataChangePw] = useState({});

  const OPTIONS = [
    {
      label: (
        <div className="table-option__menu-item">
          <i className="pi pi-lock"></i>Đổi mật khẩu
        </div>
      ),
      value: 1,
      onClick: ({ key }) => handleOpenChangePw(key),
    },
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
    dataKey: 'accountID',
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
    getUsersFilter();
    getUsers();
  }, []);

  useEffect(() => {
    if (isLoading) return;
    getUsersFilter();
  }, [paging]);

  const getUsers = () => {
    baseApi.get(
      (res) => {
        setDataUsers(res);
      },
      (err) => {},
      () => {},
      END_POINT.TOE_GET_USERS,
      null,
      null
    );
  };

  const getPopupCreateUserPops = () => {
    if (popupMode === POPUP_MODE.ADD) {
      return {
        title: 'Thêm mới tài khoản',
        footerRight: [
          <Button
            onClick={() => setIsShowPopupCreateUser(false)}
            theme={BUTTON_THEME.THEME_6}
            name="Hủy"
          />,
          <Button name="Thêm" onClick={handleAdd} />,
        ],
      };
    } else if (popupMode === POPUP_MODE.EDIT) {
      return {
        title: 'Sửa thông tin tài khoản',
        footerRight: [
          <Button
            onClick={() => setIsShowPopupCreateUser(false)}
            name="Hủy"
            theme={BUTTON_THEME.THEME_6}
          />,
          <Button name="Cập nhập" onClick={handleSave} />,
        ],
      };
    }
  };

  const getUsersFilter = () => {
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
        setDataTable(_data);
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
      END_POINT.TOE_GET_USERS_FILTER_PAGING,
      null,
      {
        filterValue: paging.filterValue || '',
        pageSize: paging.pageSize,
        pageNumber: paging.page,
      }
    );
  };

  const handleEdit = (key) => {
    const item = dataTable.filter((_) => _.accountID === key);
    if (item.length) {
      setPopupMode(POPUP_MODE.EDIT);
      setIsShowPopupCreateUser(true);
      setDataDetail(item[0]);
    }
  };

  const handleSave = () => {
    let _body = {
      ...dataCreate,
      modifiedDate: new Date(Date.now() + 7 * 60 * 60 * 1000),
      modifiedBy: getUserName(),
      parentID: dataCreate?.parentID,
      displayOrder: dataCreate.displayOrder || 0,
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
          getUsersFilter();
        } else {
          toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Cập nhật thất bại',
            life: 3000,
          });
        }
        setIsShowPopupCreateUser(false);
      },
      (err) => {
        // toast.current.show({
        //   severity: 'error',
        //   summary: 'Error',
        //   detail: 'Cập nhật thất bại',
        //   life: 3000,
        // });

        let errMessage = err?.response?.data?.data || 'Có lỗi xảy ra';
        toast.current.show({
          severity: 'error',
          summary: 'Cập nhật thất bại',
          detail: errMessage,
          life: 3000,
        });
      },
      () => {},
      format(END_POINT.TOE_UPDATE_USER, dataDetail.accountID),
      _body,
      null,
      null
    );
  };

  const handleAdd = () => {
    if (dataCreate?.avatar) {
      uploadFiles(dataCreate?.avatar, 'images')
        .then((res) => {
          callApiAdd(res);
        })
        .catch((err) => {
          toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Sửa thất bại',
            life: 3000,
          });
        });
    } else {
      callApiAdd();
    }
  };

  const callApiAdd = (avatar = null) => {
    let _body = {
      ...dataCreate,
      createdDate: new Date(Date.now() + 7 * 60 * 60 * 1000),
      createdBy: getUserName(),
      modifiedDate: new Date(Date.now() + 7 * 60 * 60 * 1000),
      modifiedBy: getUserName(),
      avatar: avatar,
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
          getUsersFilter();
        } else {
          toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Thêm mới thất bại',
            life: 3000,
          });
        }
        setIsShowPopupCreateUser(false);
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
      END_POINT.TOE_INSERT_USER,
      _body,
      null,
      null
    );
  };

  const handleActive = (key) => {
    let _body = dataTable.filter((item) => item?.accountID === key);
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
            getUsersFilter();
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
        format(END_POINT.TOE_UPDATE_USER, _body?.accountID),
        _body,
        null
      );
    }
  };

  const handleRemove = (key) => {
    setIdDeleted(key);
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

  const handleOpenChangePw = (key) => {
    const item = dataTable.filter((_) => _.accountID === key);
    if (item.length) {
      setIsShowPopupChangePassword(true);
      setDataDetail(item[0]);
    }
  };

  const handleChangePw = (params) => {
    let _body = {
      ...dataChangePw,
      modifiedDate: new Date(Date.now() + 7 * 60 * 60 * 1000),
      modifiedBy: getUserName(),
    };

    baseApi.put(
      (res) => {
        if (+res.data > 0) {
          toast.current.show({
            severity: 'success',
            summary: 'Success',
            detail: 'Cập nhật thành công',
            life: 3000,
          });
          setIsShowPopupChangePassword(false);
        } else {
          let errMessage = res?.messasge || 'Có lỗi xảy ra';
          toast.current.show({
            severity: 'error',
            summary: 'Cập nhật thất bại',
            detail: errMessage,
            life: 3000,
          });
        }
      },
      (err) => {
        let errMessage = err?.response?.data?.messasge || 'Có lỗi xảy ra';
        toast.current.show({
          severity: 'error',
          summary: 'Cập nhật thất bại',
          detail: errMessage,
          life: 3000,
        });
      },
      () => {},
      format(END_POINT.TOE_UPDATE_USER_PASSWORD, dataDetail.accountID),
      _body,
      null,
      null
    );
  };

  const handleDelete = () => {
    if (idDeleted) {
      baseApi.delete(
        (res) => {
          if (res.data > 0) {
            toast.current.show({
              severity: 'success',
              summary: 'Success',
              detail: 'Xóa thành công',
              life: 3000,
            });
            getUsersFilter();
            setIdDeleted(null);
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
        format(END_POINT.TOE_DELETE_USER, idDeleted)
      );
    }
  };

  //#endregion

  return (
    <Layout
      title="Quản lý tài khoản"
      rightButtons={[
        <Button
          onClick={() => {
            setDataDetail(null);
            setIsShowPopupCreateUser(true);
            setPopupMode(POPUP_MODE.ADD);
          }}
          leftIcon={<PlusOutlined />}
          type={BUTTON_TYPE.LEFT_ICON}
          name="Thêm tài khoản"
        />,
      ]}
    >
      <div
        id={id}
        style={style}
        className={buildClass(['toe-admin-user-page', className])}
      >
        <div className="toe-admin-user-page__toolbar">
          <div className="toe-admin-user-page__row">
            <Input
              onChange={(value) => {
                setPaging({
                  ...paging,
                  filterValue: value?.trim(),
                });
              }}
              placeholder={'Tìm kiếm...'}
              value={paging.filterValue}
              leftIcon={<i className="pi pi-search"></i>}
              delay={300}
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
        />
        <Paginator
          onChange={({ page, pageSize }) => {
            setPaging({ ...paging, page, pageSize });
          }}
          page={paging.page}
          pageSize={paging.pageSize}
          totalRecords={totalRecords}
        />
        {isShowPopupCreateUser ? (
          <PopupCreateUser
            show={isShowPopupCreateUser}
            onClose={() => setIsShowPopupCreateUser(false)}
            {...getPopupCreateUserPops()}
            onChange={(data) => {
              setDataCreate(data);
            }}
            defaultValue={dataDetail}
          />
        ) : null}
        {isShowPopupChangePassword ? (
          <Modal
            show={isShowPopupChangePassword}
            title={'Đổi mật khẩu'}
            onClose={() => setIsShowPopupChangePassword(false)}
            footerRight={[
              <Button
                onClick={() => setIsShowPopupChangePassword(false)}
                theme={BUTTON_THEME.THEME_6}
                name="Hủy"
              />,
              <Button name="Áp dụng" onClick={handleChangePw} />,
            ]}
          >
            <InputPassword
              autoFocus
              className="mb-3"
              hasRequiredLabel
              label="Mật khẩu cũ"
              placeholder="Nhập mật khẩu cũ"
              onChange={(d) =>
                setDataChangePw({
                  ...dataChangePw,
                  oldPassword: d.target.value,
                })
              }
            />

            <InputPassword
              className="mb-3"
              hasRequiredLabel
              label="Mật khẩu mới"
              placeholder="Nhập mật khẩu mới"
              onChange={(d) =>
                setDataChangePw({
                  ...dataChangePw,
                  password: d.target.value?.trim(),
                })
              }
            />

            <InputPassword
              className="mb-3"
              hasRequiredLabel
              label="Nhập lại mật khẩu mới"
              placeholder="Nhập lại mật khẩu mới"
              onChange={(d) =>
                setDataChangePw({
                  ...dataChangePw,
                  rePassword: d.target.value?.trim(),
                })
              }
            />
          </Modal>
        ) : null}
      </div>
      <Toast ref={toast}></Toast>
      {idDeleted ? (
        <ToastConfirmDelete
          onClose={() => setIdDeleted(null)}
          onAccept={handleDelete}
        />
      ) : null}
    </Layout>
  );
}

export default UserPage;
