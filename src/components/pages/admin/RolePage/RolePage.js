import { PlusOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { Chip } from 'primereact/chip';
import { Skeleton } from 'primereact/skeleton';
import { Toast } from 'primereact/toast';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'react-string-format';
import baseApi from '../../../../api/baseApi';
import { uploadFiles } from '../../../../api/firebase';
import { getUserName, ROLES } from '../../../../constants/commonAuth';
import {
  BUTTON_THEME,
  BUTTON_TYPE,
  DATE_FORMAT,
  TEXT_FALL_BACK,
  OPERATOR,
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
import PopupCreateRole from './PopupCreateRole/PopupCreateRole';
import './rolePage.scss';

RolePage.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
};

RolePage.defaultProps = {
  id: '',
  className: '',
  style: {},
};

function RolePage(props) {
  const { id, style, className } = props;

  const navigate = useNavigate();
  const toast = useRef(null);
  const [idDeleted, setIdDeleted] = useState(null);

  //#region
  const COLUMNS = [
    {
      field: 'checkbox',
      selectionMode: 'multiple',
      headerStyle: { width: '2em' },
    },
    {
      field: 'roleName',
      header: 'T??n ch???c danh',
      filterField: 'roleName',
      body: (row) => {
        return <SmartText>{row?.roleName || TEXT_FALL_BACK.TYPE_1}</SmartText>;
      },
      style: { width: 300, maxWidth: 300 },
    },
    {
      field: 'roleType',
      header: 'M?? t???',
      filterField: 'roleType',
      body: (row) => {
        let roleText = row?.roleType;
        switch (row?.roleType) {
          case ROLES.ADMIN:
            roleText = 'Qu???n tr??? h??? th???ng';
            break;
          case ROLES.STAFF:
            roleText = 'Nh??n vi??n';
            break;
          case ROLES.MEMBER:
            roleText = 'Th??nh vi??n';
            break;
          case ROLES.GUEST:
            roleText = 'Kh??ch';
            break;
          default:
            break;
        }
        return (
          <div className="toe-font-body">
            {<SmartText>{roleText ?? TEXT_FALL_BACK.TYPE_1}</SmartText>}
          </div>
        );
      },
      style: { width: 350, maxWidth: 350 },
    },
  ];

  const POPUP_MODE = {
    EDIT: 0,
    ADD: 1,
  };

  const MIN_PAGE_SIZE = 10;
  const requestDoneRef = useRef(true);

  const [isShowPopupCreateRole, setIsShowPopupCreateRole] = useState(false);
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
  const [dataRoles, setDataRoles] = useState([]);
  const [dataChangePw, setDataChangePw] = useState({});

  const OPTIONS = [
    {
      label: (
        <div className="table-option__menu-item">
          <i className="pi pi-pencil"></i>S???a
        </div>
      ),
      value: 2,
      onClick: ({ key }) => handleEdit(key),
    },
    {
      label: (
        <div className="table-option__menu-item">
          <i className="pi pi-arrows-h"></i>?????i tr???ng th??i
        </div>
      ),
      value: 4,
      onClick: ({ key }) => handleActive(key),
    },
    {
      label: (
        <div className="table-option__menu-item" style={{ color: 'red' }}>
          <i className="pi pi-trash"></i>X??a
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
    dataKey: 'roleID',
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
    getRolesFilter();
  }, []);

  useEffect(() => {
    if (isLoading) return;
    getRolesFilter();
  }, [paging]);

  const getPopupCreateRolePops = () => {
    if (popupMode === POPUP_MODE.ADD) {
      return {
        title: 'Th??m m???i ph??n quy???n',
        footerRight: [
          <Button
            onClick={() => setIsShowPopupCreateRole(false)}
            theme={BUTTON_THEME.THEME_6}
            name="H???y"
          />,
          <Button name="Th??m" onClick={handleAdd} />,
        ],
      };
    } else if (popupMode === POPUP_MODE.EDIT) {
      return {
        title: 'S???a th??ng tin ph??n quy???n',
        footerRight: [
          <Button
            onClick={() => setIsShowPopupCreateRole(false)}
            name="H???y"
            theme={BUTTON_THEME.THEME_6}
          />,
          <Button name="C???p nh???p" onClick={handleSave} />,
        ],
      };
    }
  };

  const getRolesFilter = () => {
    let _filter = [['IsDeleted', OPERATOR.EQUAL, '0']];

    if (paging.filterValue?.trim() != '') {
      _filter.push(OPERATOR.AND);
      _filter.push([
        ['RoleName', OPERATOR.CONTAINS, encodeURI(paging.filterValue)],
      ]);
    }
    baseApi.post(
      (res) => {
        let _data = res.data.pageData;
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
      END_POINT.TOE_ROLES_FILTER,
      {
        filter: btoa(JSON.stringify(_filter)),
        pageSize: paging.pageSize,
        pageIndex: paging.page,
      },
      null
    );
  };

  const handleEdit = (key) => {
    const item = dataTable.filter((_) => _.roleID === key);
    if (item.length) {
      setPopupMode(POPUP_MODE.EDIT);
      setIsShowPopupCreateRole(true);
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
            detail: 'C???p nh???t th??nh c??ng',
            life: 3000,
          });
          getRolesFilter();
        } else {
          toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: 'C???p nh???t th???t b???i',
            life: 3000,
          });
        }
        setIsShowPopupCreateRole(false);
      },
      (err) => {
        let errMessage = err?.response?.data?.data || 'C?? l???i x???y ra';
        toast.current.show({
          severity: 'error',
          summary: 'C???p nh???t th???t b???i',
          detail: errMessage,
          life: 3000,
        });
      },
      () => {},
      format(END_POINT.TOE_UPDATE_USER, dataDetail.roleID),
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
            detail: 'S???a th???t b???i',
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
            detail: 'Th??m m???i th??nh c??ng',
            life: 3000,
          });
          getRolesFilter();
        } else {
          toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Th??m m???i th???t b???i',
            life: 3000,
          });
        }
        setIsShowPopupCreateRole(false);
      },
      (err) => {
        let errMessage = err?.response?.data?.data || 'C?? l???i x???y ra';
        toast.current.show({
          severity: 'error',
          summary: 'Th??m m???i th???t b???i',
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
    let _body = dataTable.filter((item) => item?.roleID === key);
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
              detail: 'S???a th??nh c??ng',
              life: 3000,
            });
            getRolesFilter();
          }
        },
        (err) => {
          toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: 'S???a th???t th???t b???i',
            life: 3000,
          });
        },
        () => {},
        format(END_POINT.TOE_UPDATE_USER, _body?.roleID),
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
            label="Ho???t ?????ng"
          />
        );
        break;
      case false:
        return <Chip className="toe-font-body" label="Ng???ng ho???t ?????ng" />;
        break;
      default:
        return null;
        break;
    }
  }

  const handleOpenChangePw = (key) => {
    const item = dataTable.filter((_) => _.roleID === key);
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
            detail: 'C???p nh???t th??nh c??ng',
            life: 3000,
          });
          setIsShowPopupChangePassword(false);
        } else {
          let errMessage = res?.messasge || 'C?? l???i x???y ra';
          toast.current.show({
            severity: 'error',
            summary: 'C???p nh???t th???t b???i',
            detail: errMessage,
            life: 3000,
          });
        }
      },
      (err) => {
        let errMessage = err?.response?.data?.messasge || 'C?? l???i x???y ra';
        toast.current.show({
          severity: 'error',
          summary: 'C???p nh???t th???t b???i',
          detail: errMessage,
          life: 3000,
        });
      },
      () => {},
      format(END_POINT.TOE_UPDATE_USER_PASSWORD, dataDetail.roleID),
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
              detail: 'X??a th??nh c??ng',
              life: 3000,
            });
            getRolesFilter();
            setIdDeleted(null);
          }
        },
        (err) => {
          toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: 'X??a th???t b???i',
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
      title="Qu???n l?? ph??n quy???n"
      rightButtons={[
        <Button
          onClick={() => {
            setDataDetail(null);
            setIsShowPopupCreateRole(true);
            setPopupMode(POPUP_MODE.ADD);
          }}
          leftIcon={<PlusOutlined />}
          type={BUTTON_TYPE.LEFT_ICON}
          name="Th??m ph??n quy???n"
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
              placeholder={'T??m ki???m user theo Ti??u ?????, Alias...'}
              value={paging.filterValue}
              // label={
              //   <div className="toe-admin-user-page__row-label">T??m ki???m</div>
              // }
              leftIcon={<i className="pi pi-search"></i>}
              delay={300}
            />
          </div>
          {selected?.length ? (
            <Tooltip placement="bottomLeft" title="X??a b???n ghi">
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
        {isShowPopupCreateRole ? (
          <PopupCreateRole
            show={isShowPopupCreateRole}
            onClose={() => setIsShowPopupCreateRole(false)}
            {...getPopupCreateRolePops()}
            onChange={(data) => {
              setDataCreate(data);
            }}
            defaultValue={dataDetail}
          />
        ) : null}
        {isShowPopupChangePassword ? (
          <Modal
            show={isShowPopupChangePassword}
            title={'?????i m???t kh???u'}
            onClose={() => setIsShowPopupChangePassword(false)}
            footerRight={[
              <Button
                onClick={() => setIsShowPopupChangePassword(false)}
                theme={BUTTON_THEME.THEME_6}
                name="H???y"
              />,
              <Button name="??p d???ng" onClick={handleChangePw} />,
            ]}
          >
            <InputPassword
              autoFocus
              className="mb-3"
              hasRequiredLabel
              label="M???t kh???u c??"
              placeholder="Nh???p m???t kh???u c??"
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
              label="M???t kh???u m???i"
              placeholder="Nh???p m???t kh???u m???i"
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
              label="Nh???p l???i m???t kh???u m???i"
              placeholder="Nh???p l???i m???t kh???u m???i"
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

export default RolePage;
