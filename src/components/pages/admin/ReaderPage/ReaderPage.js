import { PlusOutlined } from '@ant-design/icons';
import { Chip } from 'primereact/chip';
import PropTypes from 'prop-types';
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import baseApi from '../../../../api/baseApi';
import { Toast } from 'primereact/toast';
import {
  ACTIVE_RECORD_FILTER,
  BUTTON_THEME,
  BUTTON_TYPE,
  DATE_FORMAT,
  GUID_NULL,
  MENU_TYPE,
  OPERATOR,
  PATH_NAME,
  MEMBER_TYPE,
  CARD_STATUS,
} from '../../../../constants/commonConstant';
import {
  buildClass,
  getCardStatusText,
  getMemberTypeText,
  listToTree,
} from '../../../../constants/commonFunction';
import END_POINT from '../../../../constants/endpoint';
import Button from '../../../atomics/base/Button/Button';
import Input from '../../../atomics/base/Input/Input';
import SmartText from '../../../atomics/base/SmartText/SmartText';
import Paginator from '../../../molecules/Paginator/Paginator';
import Table from '../../../molecules/Table/Table';
import Layout from '../../../sections/Admin/Layout/Layout';
import PopupCreateUser from '../UserPage/PopupCreateUser/PopupCreateUser';
import { Skeleton } from 'primereact/skeleton';
import moment from 'moment';
import { Tooltip, Tag } from 'antd';
import { format } from 'react-string-format';
import './readerPage.scss';
import Dropdown from '../../../molecules/Dropdown/Dropdown';
import TreeSelect from '../../../atomics/base/TreeSelect/TreeSelect';
import ToastConfirmDelete from '../../../molecules/ToastConfirmDelete/ToastConfirmDelete';

ReaderPage.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
};

ReaderPage.defaultProps = {
  id: '',
  className: '',
  style: {},
};

function ReaderPage(props) {
  const { id, style, className } = props;

  const navigate = useNavigate();
  const toast = useRef(null);

  //#region
  const COLUMNS = [
    {
      field: 'checkbox',
      selectionMode: 'multiple',
      headerStyle: { width: '4em' },
    },
    {
      field: 'cardCode',
      sortable: true,
      header: <SmartText>M?? th???</SmartText>,
      filterField: 'cardCode',
      body: (row) => {
        return <SmartText maxWidth={150}>{row?.cardCode}</SmartText>;
      },
      style: { width: 150, maxWidth: 150 },
    },
    {
      field: 'joinDate',
      sortable: true,
      header: <SmartText>Ng??y tham gia</SmartText>,
      filterField: 'joinDate',
      body: (row) => {
        if (isLoading) return <Skeleton></Skeleton>;
        return (
          <div className="toe-font-body">
            {moment(row?.joinDate).format(DATE_FORMAT.TYPE_4)}
          </div>
        );
      },
      style: { width: 200, maxWidth: 200 },
    },
    {
      field: 'expiredDate',
      sortable: true,
      header: 'Ng??y h???t h???n',
      filterField: 'expiredDate',
      body: (row) => {
        if (isLoading) return <Skeleton></Skeleton>;

        return (
          <div className="toe-font-body">
            {moment(row?.expiredDate).format(DATE_FORMAT.TYPE_4)}
          </div>
        );
      },
      style: { width: 200, maxWidth: 200 },
    },
    {
      field: 'memberType',
      sortable: true,
      header: 'Lo???i th??nh vi??n',
      filterField: 'memberType',
      body: (row) => {
        if (isLoading) return <Skeleton></Skeleton>;
        let text = 'Kh??ng x??c ?????nh';
        switch (row?.memberType) {
          case MEMBER_TYPE.GUEST:
            text = 'Kh??ch';
            break;
          case MEMBER_TYPE.LECTURER:
            text = 'Gi???ng vi??n';
            break;
          case MEMBER_TYPE.GUEST:
            text = 'Sinh vi??n';
            break;
          default:
            break;
        }
        return <div className="toe-font-body">{text}</div>;
      },
      style: { width: 200, maxWidth: 200 },
    },
    {
      field: 'cardStatus',
      sortable: true,
      header: 'Tr???ng th??i th???',
      filterField: 'cardStatus',
      body: (row) => {
        if (isLoading) return <Skeleton></Skeleton>;
        let color = '#f50';
        if (row?.cardStatus === CARD_STATUS.CONFIRMED) color = '#87d068';
        return (
          <div className="toe-font-body">
            <Tag color={color}>{getCardStatusText(row?.cardStatus)}</Tag>
          </div>
        );
      },
      style: { width: 180, maxWidth: 180 },
    },
    {
      field: 'status',
      sortable: true,
      header: 'Tr???ng th??i',
      filterField: 'status',
      body: (row) => {
        return <div className="toe-font-body">{renderStatus(row?.status)}</div>;
      },
      style: { width: 150, maxWidth: 150 },
    },
  ];

  const POPUP_MODE = {
    EDIT: 0,
    ADD: 1,
  };

  const DROPDOWN_TYPE_OPTIONS = [
    {
      label: 'T???t c???',
      value: -1,
    },
    {
      label: 'Chuy???n h?????ng Alias',
      value: MENU_TYPE.NORMAL,
      subLabel: 'VD: https://trangwebcuaban.com/{Alias}',
    },
    {
      label: 'Chuy???n h?????ng Link',
      value: MENU_TYPE.REDIRECT,
      subLabel: 'Trang ???????c chuy???n h?????ng qua ???????ng d???n l?? {Link}',
    },
    {
      label: 'Chuy???n h?????ng th??nh /html/{Alias}',
      value: MENU_TYPE.HTML_RENDER,
      subLabel: 'VD: https://trangwebcuaban.com/{Html}/{Alias}',
    },
    {
      label: 'Menu t??nh',
      value: MENU_TYPE.NONE_EVENT,
      subLabel: 'Kh??ng c?? s??? ki???n v?? ch???a menu',
    },
  ];

  const MIN_PAGE_SIZE = 10;
  const requestDoneRef = useRef(true);

  const [selected, setSelected] = useState([]);
  const [popupMode, setpopupMode] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isShowPopupCreateUser, setIsShowPopupCreateUser] = useState(false);
  const [lazyParams, setLazyParams] = useState({ page: 1, rows: 10 });
  const [totalRecords, setTotalRecords] = useState(0);
  const [dataTable, setDataTable] = useState([]);
  const [paging, setPaging] = useState({
    filterValue: '',
    page: 1,
    pageSize: MIN_PAGE_SIZE,
    type: -1,
    menuID: -1,
  });
  const [dataMenus, setDataMenus] = useState([]);
  const isMountedRef = useRef(false);

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
      onClick: ({ key }) => {
        let _body = dataTable.filter((item) => item?.cardID === key);
        _body = _body[0];
        _body['status'] = !_body['status'];
        handleModifiy(_body);
      },
    },
    {
      label: (
        <div className="table-option__menu-item">
          <i className="pi pi-check"></i>X??c nh???n
        </div>
      ),
      value: 5,
      onClick: (item) => {
        debugger;
        let _body = dataTable.filter((it) => it?.cardID === item.key);
        _body = _body[0];
        _body['cardStatus'] = CARD_STATUS.CONFIRMED;

        if (_body.cardStatus !== CARD_STATUS.CONFIRMED) {
          _body['joinDate'] = new Date(Date.now() + 7 * 60 * 60 * 1000);
          _body['expiredDate'] = new Date(moment().add(4, 'years').valueOf());
        }

        handleModifiy(_body);
      },
    },
    {
      label: (
        <div className="table-option__menu-item">
          <i className="pi pi-exclamation-circle"></i>T??? ch???i
        </div>
      ),
      value: 5,
      onClick: ({ key }) => {
        let _body = dataTable.filter((item) => item?.cardID === key);
        _body = _body[0];
        _body['cardStatus'] = CARD_STATUS.REFUSE_COMFIRM;

        handleModifiy(_body);
      },
    },
    {
      label: (
        <div className="table-option__menu-item" style={{ color: 'red' }}>
          <i className="pi pi-trash"></i>X??a
        </div>
      ),
      value: 3,
      onClick: ({ key }) => {
        handleRemove(key);
      },
    },
  ];

  const CONFIGS = {
    /**
     * *Config
     */
    resizableColumns: false,
    dataKey: 'cardID',
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

  const [isShowPopupDelete, setIsShowPopupDelete] = useState(false);

  useEffect(() => {
    isMountedRef.current = true;
    getMenus();

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    getLibraryCardFilter();
  }, [paging]);

  const getPopupCreateUserPops = () => {
    if (popupMode === POPUP_MODE.ADD) {
      return {
        title: 'Th??m m???i t??i kho???n',
        footerRight: [
          <Button
            onClick={() => setIsShowPopupCreateUser(false)}
            theme={BUTTON_THEME.THEME_6}
            name="H???y"
          />,
          <Button name="Th??m" onClick={() => {}} />,
        ],
      };
    } else if (popupMode === POPUP_MODE.EDIT) {
      return {
        title: 'S???a t??i kho???n',
        footerRight: [
          <Button
            onClick={() => setIsShowPopupCreateUser(false)}
            name="H???y"
            theme={BUTTON_THEME.THEME_6}
          />,
          <Button name="C???p nh???p" onClick={() => {}} />,
        ],
      };
    }
  };

  const getLibraryCardFilter = () => {
    let _filter = [['IsDeleted', OPERATOR.EQUAL, '0']];
    if (paging.filterValue?.trim() != '') {
      _filter.push(OPERATOR.AND);
      _filter.push([
        ['CardCode', OPERATOR.CONTAINS, encodeURI(paging.filterValue)],
      ]);
    }

    baseApi.post(
      (res) => {
        if (!isMountedRef.current) return;

        let _data = res.data.pageData.sort((a, b) => {
          const time = (date) => new Date(date).getTime();
          if (time(b?.createdDate) - time(a?.modifiedDate) > 0) {
            return time(b?.createdDate) - time(a?.createdDate);
          } else {
            return time(b?.modifiedDate) - time(a?.modifiedDate);
          }
        });

        setDataTable(_data.map((_) => ({ ..._, key: _.cardID })));
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
      END_POINT.TOE_LIBRARY_CARD_FILTER,
      {
        filter: btoa(JSON.stringify(_filter)),
        pageSize: paging.pageSize,
        pageIndex: paging.page,
      },
      null
    );
  };

  const handleEdit = (key) => {
    navigate(key);
  };

  const handleModifiy = (body = {}) => {
    body['modifiedDate'] = new Date(Date.now() + 7 * 60 * 60 * 1000);
    baseApi.put(
      (res) => {
        if (res.data > 0) {
          toast.current.show({
            severity: 'success',
            summary: 'Success',
            detail: 'S???a th??nh c??ng',
            life: 3000,
          });
          getLibraryCardFilter();
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
      format(END_POINT.TOE_UPDATE_LIBRARY_CARD, body?.cardID),
      body,
      null
    );
  };

  const getMenus = () => {
    baseApi.get(
      (res) => {
        if (!isMountedRef.current) return;

        let _data = res.data.data.map((item) => ({
          ...item,
          key: item?.MenuID,
          label: (
            <div className="treeselect-item">
              <div className="treeselect-item__title">{item.Title}</div>
              <Tooltip title={`Menu ch???a ${item.Amount} b??i vi???t`}>
                <div className="treeselect-item__amount">{item.Amount}</div>
              </Tooltip>
            </div>
          ),
          parentID: item.ParentID,
        }));
        _data = listToTree(_data);
        _data = [
          {
            key: '-1',
            label: 'T???t c???',
          },
          ..._data,
        ];
        setDataMenus(_data);
      },
      (err) => {},
      () => {},
      END_POINT.TOE_GET_MENUS_POST_COUNT,
      null,
      null
    );
  };

  const handleRemove = (key) => {
    baseApi.delete(
      (res) => {
        if (!isMountedRef.current) return;
        if (res.data > 0) {
          toast.current.show({
            severity: 'success',
            summary: 'Success',
            detail: 'X??a th??nh c??ng',
            life: 3000,
          });
          getLibraryCardFilter();
        } else {
          toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: 'X??a th???t b???i',
            life: 3000,
          });
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
      format(END_POINT.TOE_DELETE_LIBRARY_CARD, key)
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

  const handleAcceptMany = (cardStatus = CARD_STATUS.CONFIRMED) => {
    const ids = selected.map((item) => item.cardID);
    baseApi.post(
      (res) => {
        toast.current.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Thao t??c th??nh c??ng',
          life: 3000,
        });
        getLibraryCardFilter();
        setSelected([]);
        setIsShowPopupDelete(false);
      },
      (err) => {
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Thao t??c th???t b???i',
          life: 3000,
        });
        setIsShowPopupDelete(false);
      },
      () => {},
      END_POINT.TOE_ACCEPT_MANY,
      {
        IdSelected: ids,
        CardStatus: cardStatus,
      },
      null,
      null
    );
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
  //#endregion

  return (
    <Layout
      title="Qu???n l?? th??? th?? vi???n"
      rightButtons={[
        <Button
          onClick={() => {
            navigate(PATH_NAME.ADMIN_CREATE_POST_PAGE);
          }}
          leftIcon={<PlusOutlined />}
          type={BUTTON_TYPE.LEFT_ICON}
          name="Th??m th??? th?? vi???n"
        />,
      ]}
    >
      <div
        id={id}
        style={style}
        className={buildClass(['toe-admin-post-page', className])}
      >
        <div className="toe-admin-post-page__toolbar">
          <div className="toe-admin-post-page__row">
            <Input
              onChange={(value) => {
                setPaging({
                  ...paging,
                  filterValue: value,
                });
              }}
              placeholder={'T??m ki???m...'}
              value={paging.filterValue}
              leftIcon={<i className="pi pi-search"></i>}
              delay={300}
            />

            {/* <TreeSelect
              placeholder="Nh???p ????? ch???n"
              value={paging.menuID}
              options={dataMenus}
              prefixValue={'Menu'}
              onChange={(data) => {
                setPaging((pre) => ({ ...pre, menuID: data.value }));
              }}
            /> */}
          </div>
          <div className="toe-admin-post-page__toolbar-right">
            <Tooltip placement="left" title="T??? ch???i">
              <i
                onClick={() => setIsShowPopupDelete(true)}
                style={{
                  color: 'red',
                  cursor: 'pointer',
                  marginLeft: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                }}
                className="pi pi-times"
              ></i>
            </Tooltip>
            <Tooltip placement="left" title="X??c nh???n">
              <i
                onClick={() => handleAcceptMany(CARD_STATUS.CONFIRMED)}
                style={{
                  color: 'green',
                  cursor: 'pointer',
                  marginLeft: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                }}
                className="pi pi-check"
              ></i>
            </Tooltip>
          </div>
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
        <PopupCreateUser
          show={isShowPopupCreateUser}
          onClose={() => setIsShowPopupCreateUser(false)}
          {...getPopupCreateUserPops()}
        />
      </div>
      <Toast ref={toast}></Toast>

      {isShowPopupDelete ? (
        <ToastConfirmDelete
          onClose={() => setIsShowPopupDelete(false)}
          onAccept={() => {
            handleAcceptMany(CARD_STATUS.REFUSE_COMFIRM);
          }}
          prefix={`B???n c?? ch???c mu???n t??? ch???i ${
            selected.length ? selected.length + ' b???n ghi ' : 't???t c???'
          }?`}
        />
      ) : null}
    </Layout>
  );
}

export default ReaderPage;
