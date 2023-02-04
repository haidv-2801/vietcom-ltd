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
} from '../../../../constants/commonConstant';
import { buildClass, listToTree } from '../../../../constants/commonFunction';
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
import { Tooltip } from 'antd';
import { format } from 'react-string-format';
import './postPage.scss';
import Dropdown from '../../../molecules/Dropdown/Dropdown';
import TreeSelect from '../../../atomics/base/TreeSelect/TreeSelect';

PostPage.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
};

PostPage.defaultProps = {
  id: '',
  className: '',
  style: {},
};

function PostPage(props) {
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
      field: 'title',
      sortable: true,
      header: <SmartText>Tiêu đề</SmartText>,
      filterField: 'title',
      body: (row) => {
        return <SmartText maxWidth={300}>{row?.title}</SmartText>;
      },
      style: { width: 300, maxWidth: 300 },
    },
    {
      field: 'description',
      sortable: true,
      header: <SmartText>Mô tả</SmartText>,
      filterField: 'description',
      body: (row) => {
        return (
          <div className="toe-font-body">
            {<SmartText rows={4}>{row?.description}</SmartText>}
          </div>
        );
      },
      style: { width: 400, maxWidth: 400 },
    },
    {
      field: 'slug',
      sortable: true,
      header: 'Alias',
      filterField: 'slug',
      body: (row) => {
        return (
          <div className="toe-font-body">
            {<SmartText rows={4}>{row?.slug}</SmartText>}
          </div>
        );
      },
      style: { width: 200, maxWidth: 200 },
    },
    {
      field: 'viewCount',
      sortable: true,
      header: 'Lượt truy cập',
      filterField: 'viewCount',
      body: (row) => {
        return <div className="toe-font-body">{row?.viewCount}</div>;
      },
      style: { width: 200, maxWidth: 200 },
    },
    {
      field: 'status',
      sortable: true,
      header: 'Trạng thái',
      filterField: 'status',
      body: (row) => {
        return <div className="toe-font-body">{renderStatus(row?.status)}</div>;
      },
      style: { width: 300, maxWidth: 300 },
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
      style: { width: 180, maxWidth: 180 },
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
      label: 'Chuyển hướng Alias',
      value: MENU_TYPE.NORMAL,
      subLabel: 'VD: https://trangwebcuaban.com/{Alias}',
    },
    {
      label: 'Chuyển hướng Link',
      value: MENU_TYPE.REDIRECT,
      subLabel: 'Trang được chuyển hướng qua đường dẫn là {Link}',
    },
    {
      label: 'Chuyển hướng thành /html/{Alias}',
      value: MENU_TYPE.HTML_RENDER,
      subLabel: 'VD: https://trangwebcuaban.com/{Html}/{Alias}',
    },
    {
      label: 'Menu tĩnh',
      value: MENU_TYPE.NONE_EVENT,
      subLabel: 'Không có sự kiện và chứa menu',
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
    dataKey: 'postID',
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
    getPostsFilter();
    getMenus();
  }, []);

  useEffect(() => {
    if (isLoading) return;
    getPostsFilter();
  }, [paging]);

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
          <Button name="Thêm" onClick={() => {}} />,
        ],
      };
    } else if (popupMode === POPUP_MODE.EDIT) {
      return {
        title: 'Sửa tài khoản',
        footerRight: [
          <Button
            onClick={() => setIsShowPopupCreateUser(false)}
            name="Hủy"
            theme={BUTTON_THEME.THEME_6}
          />,
          <Button name="Cập nhập" onClick={() => {}} />,
        ],
      };
    }
  };

  const getPostsFilter = () => {
    let _filter = [['IsDeleted', OPERATOR.EQUAL, '0']];
    if (paging.filterValue?.trim() != '') {
      _filter.push(OPERATOR.AND);
      _filter.push([
        ['Title', OPERATOR.CONTAINS, encodeURI(paging.filterValue)],
        OPERATOR.OR,
        ['Slug', OPERATOR.CONTAINS, encodeURI(paging.filterValue)],
        OPERATOR.OR,
        ['Description', OPERATOR.CONTAINS, encodeURI(paging.filterValue)],
      ]);
    }

    if (paging.menuID != -1) {
      _filter.push(OPERATOR.AND);
      _filter.push(['MenuID', OPERATOR.EQUAL, paging.menuID]);
    }

    baseApi.post(
      (res) => {
        let _data = res.data.pageData
          .sort((a, b) => {
            const time = (date) => new Date(date).getTime();
            if (time(b?.createdDate) - time(a?.modifiedDate) > 0) {
              return time(b?.createdDate) - time(a?.createdDate);
            } else {
              return time(b?.modifiedDate) - time(a?.modifiedDate);
            }
          })
          .filter((menu) => menu.parentID !== GUID_NULL);

        setDataTable(_data.map((_) => ({ ..._, key: _.postId })));
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
      END_POINT.TOE_GET_POSTS_FILTER,
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

  const handleActive = (key) => {
    let _body = dataTable.filter((item) => item?.postID === key);
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
            getPostsFilter();
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
        format(END_POINT.TOE_UPDATE_POST, _body?.postID),
        _body,
        null
      );
    }
  };

  const getMenus = () => {
    baseApi.get(
      (res) => {
        let _data = res.data.data.map((item) => ({
          ...item,
          key: item?.MenuID,
          label: (
            <div className="treeselect-item">
              <div className="treeselect-item__title">{item.Title}</div>
              <Tooltip title={`Menu chứa ${item.Amount} bài viết`}>
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
            label: 'Tất cả',
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
        if (res.data > 0) {
          toast.current.show({
            severity: 'success',
            summary: 'Success',
            detail: 'Xóa thành công',
            life: 3000,
          });
          getPostsFilter();
        } else {
          toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Xóa thất bại',
            life: 3000,
          });
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
      format(END_POINT.TOE_DELETE_POST, key)
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
      title="Quản lý bài đăng"
      rightButtons={[
        <Button
          onClick={() => {
            navigate(PATH_NAME.ADMIN_CREATE_POST_PAGE);
          }}
          leftIcon={<PlusOutlined />}
          type={BUTTON_TYPE.LEFT_ICON}
          name="Thêm bài đăng"
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
              placeholder={'Tìm kiếm Tiêu đề, Alias, Mô tả...'}
              value={paging.filterValue}
              leftIcon={<i className="pi pi-search"></i>}
              delay={300}
            />

            <TreeSelect
              placeholder="Nhấp để chọn"
              value={paging.menuID}
              options={dataMenus}
              prefixValue={'Menu'}
              onChange={(data) => {
                setPaging((pre) => ({ ...pre, menuID: data.value }));
              }}
            />

            {/* <Dropdown
              className="dropdown-filter-by-menu"
              defaultValue={paging.type}
              options={DROPDOWN_TYPE_OPTIONS}
              hasSubLabel
              prefixValue={'Loại Menu'}
              scrollHeight={350}
              onChange={({ value }) => setPaging({ ...paging, type: value })}
            /> */}
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
        <PopupCreateUser
          show={isShowPopupCreateUser}
          onClose={() => setIsShowPopupCreateUser(false)}
          {...getPopupCreateUserPops()}
        />
      </div>
      <Toast ref={toast}></Toast>
    </Layout>
  );
}

export default PostPage;
