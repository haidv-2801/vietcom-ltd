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
} from '../../../../constants/commonConstant';
import { buildClass } from '../../../../constants/commonFunction';
import END_POINT from '../../../../constants/endpoint';
import Button from '../../../atomics/base/Button/Button';
import Input from '../../../atomics/base/Input/Input';
import SmartText from '../../../atomics/base/SmartText/SmartText';
import Paginator from '../../../molecules/Paginator/Paginator';
import Table from '../../../molecules/Table/Table';
import Layout from '../../../sections/Admin/Layout/Layout';
import PopupCreateMenu from './PopupCreateMenu/PopupCreateMenu';
import Dropdown from '../../../molecules/Dropdown/Dropdown';
import './menuPage.scss';
import { getUserName } from '../../../../constants/commonAuth';

MenuPage.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
};

MenuPage.defaultProps = {
  id: '',
  className: '',
  style: {},
};

function MenuPage(props) {
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
      field: 'title',
      sortable: true,
      header: 'Tên menu',
      filterField: 'title',
      body: (row) => {
        return <SmartText>{row?.title || TEXT_FALL_BACK.TYPE_1}</SmartText>;
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
            {
              <SmartText rows={4}>
                {row?.slug || TEXT_FALL_BACK.TYPE_1}
              </SmartText>
            }
          </div>
        );
      },
    },
    {
      field: 'parentID',
      sortable: true,
      header: 'Menu cha',
      filterField: 'parentID',
      body: (row) => {
        return (
          <div className="toe-font-body">
            {renderColumnParentMenu(row?.parentID)}
          </div>
        );
      },
    },
    {
      field: 'displayOrder',
      sortable: true,
      header: 'Mức độ hiển thị',
      filterField: 'displayOrder',
      body: (row) => {
        return <div className="toe-font-body">{row?.displayOrder}</div>;
      },
      style: { width: 170, maxWidth: 170 },
    },
    {
      field: 'isShowHome',
      sortable: true,
      header: 'Hiển thị ở trang chủ',
      filterField: 'isShowHome',
      body: (row) => {
        if (isLoading) return <Skeleton />;
        return (
          <div className="toe-font-body">
            {row?.isShowHome ? 'Có' : 'Không'}
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
      field: 'link',
      sortable: true,
      header: 'Chuyển hướng',
      filterField: 'link',
      body: (row) => {
        if (isLoading) return <Skeleton></Skeleton>;
        return (
          <div className="toe-font-body">
            {row?.link || TEXT_FALL_BACK.TYPE_1}
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

  // const DROPDOWN_TYPE_OPTIONS = [
  //   {
  //     label: 'Tất cả',
  //     value: -1,
  //   },
  //   {
  //     label: 'Chuyển hướng Alias',
  //     value: MENU_TYPE.NORMAL,
  //     subLabel: 'VD: https://trangwebcuaban.com/{Alias}',
  //   },
  //   {
  //     label: 'Chuyển hướng Link',
  //     value: MENU_TYPE.REDIRECT,
  //     subLabel: 'Trang được chuyển hướng qua đường dẫn là {Link}',
  //   },
  //   {
  //     label: 'Chuyển hướng thành /html/{Alias}',
  //     value: MENU_TYPE.HTML_RENDER,
  //     subLabel: 'VD: https://trangwebcuaban.com/{Html}/{Alias}',
  //   },
  //   {
  //     label: 'Menu tĩnh',
  //     value: MENU_TYPE.NONE_EVENT,
  //     subLabel: 'Không có sự kiện và chứa menu',
  //   },
  // ];

  const DROPDOWN_TYPE_OPTIONS = [
    {
      label: 'Tất cả',
      value: -1,
    },
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

  const MIN_PAGE_SIZE = 10;
  const requestDoneRef = useRef(true);

  const [isShowPopupCreateMenu, setIsShowPopupCreateMenu] = useState(false);
  const [selected, setSelected] = useState([]);
  const [popupMode, setPopupMode] = useState();
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
  });
  const [dataCreate, setDataCreate] = useState({});
  const [dataDetail, setDataDetail] = useState(null);
  const [dataMenus, setDataMenus] = useState([]);

  const OPTIONS = [
    {
      label: (
        <div className="table-option__menu-item">
          <i className="pi pi-eye"></i>Xem chi tiết
        </div>
      ),
      value: 1,
      onClick: (e) => console.log('first', e),
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
    dataKey: 'menuID',
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
    getMenusFilter();
    getMenus();
  }, []);

  useEffect(() => {
    if (isLoading) return;
    getMenusFilter();
  }, [paging]);

  const renderColumnParentMenu = (id) => {
    if (isLoading) return <Skeleton></Skeleton>;
    let item = dataMenus.filter((item) => item.menuID === id);
    if (item.length) {
      return item[0].title;
    }
    return TEXT_FALL_BACK.TYPE_1;
  };

  const getMenus = () => {
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
        title: 'Thêm mới menu',
        footerRight: [
          <Button
            onClick={() => setIsShowPopupCreateMenu(false)}
            theme={BUTTON_THEME.THEME_6}
            name="Hủy"
          />,
          <Button name="Thêm" onClick={handleAdd} />,
        ],
      };
    } else if (popupMode === POPUP_MODE.EDIT) {
      return {
        title: 'Sửa menu',
        footerRight: [
          <Button
            onClick={() => setIsShowPopupCreateMenu(false)}
            name="Hủy"
            theme={BUTTON_THEME.THEME_6}
          />,
          <Button name="Cập nhập" onClick={handleSave} />,
        ],
      };
    }
  };

  const getMenusFilter = () => {
    let _filter = [['IsDeleted', OPERATOR.EQUAL, '0']];
    if (paging.filterValue?.trim() != '') {
      _filter.push(OPERATOR.AND);
      _filter.push([
        ['Title', OPERATOR.CONTAINS, encodeURI(paging.filterValue)],
        OPERATOR.OR,
        ['Slug', OPERATOR.CONTAINS, encodeURI(paging.filterValue)],
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
      END_POINT.TOE_GET_MENUS_FILTER,
      {
        filter: btoa(JSON.stringify(_filter)),
        pageSize: paging.pageSize,
        pageIndex: paging.page,
      },
      null
    );
  };

  const handleEdit = (key) => {
    const item = dataTable.filter((_) => _.menuID === key);
    if (item.length) {
      setPopupMode(POPUP_MODE.EDIT);
      setIsShowPopupCreateMenu(true);
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
          getMenusFilter();
        } else {
          toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Cập nhật thất bại',
            life: 3000,
          });
        }
        setIsShowPopupCreateMenu(false);
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
      format(END_POINT.TOE_UPDATE_MENU, dataDetail.menuID),
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
      parentID: dataCreate?.parentID,
      displayOrder: dataCreate.displayOrder || 0,
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
          getMenusFilter();
        } else {
          toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Thêm mới thất bại',
            life: 3000,
          });
        }
        setIsShowPopupCreateMenu(false);
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
      END_POINT.TOE_INSERT_MENU,
      _body,
      null,
      null
    );
  };

  const handleActive = (key) => {
    let _body = dataTable.filter((item) => item?.menuID === key);
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
            getMenusFilter();
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
        format(END_POINT.TOE_UPDATE_MENU, _body?.menuID),
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
          getMenusFilter();
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
      format(END_POINT.TOE_DELETE_MENU, key)
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
      title="Quản lý menu"
      rightButtons={[
        <Button
          onClick={() => {
            setDataDetail(null);
            setIsShowPopupCreateMenu(true);
            setPopupMode(POPUP_MODE.ADD);
          }}
          leftIcon={<PlusOutlined />}
          type={BUTTON_TYPE.LEFT_ICON}
          name="Thêm menu"
        />,
      ]}
    >
      <div
        id={id}
        style={style}
        className={buildClass(['toe-admin-menu-page', className])}
      >
        <div className="toe-admin-menu-page__toolbar">
          <div className="toe-admin-menu-page__row">
            <Input
              onChange={(value) => {
                setPaging({
                  ...paging,
                  filterValue: value?.trim(),
                });
              }}
              placeholder={'Tìm kiếm menu theo Tiêu đề, Alias...'}
              value={paging.filterValue}
              // label={
              //   <div className="toe-admin-menu-page__row-label">Tìm kiếm</div>
              // }
              leftIcon={<i className="pi pi-search"></i>}
              delay={300}
            />

            <Dropdown
              className="dropdown-filter-by-menu"
              defaultValue={paging.type}
              options={DROPDOWN_TYPE_OPTIONS}
              hasSubLabel
              prefixValue={'Loại Menu'}
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
        {isShowPopupCreateMenu ? (
          <PopupCreateMenu
            show={isShowPopupCreateMenu}
            onClose={() => setIsShowPopupCreateMenu(false)}
            {...getPopupCreateMenuPops()}
            onChange={(data) => {
              setDataCreate(data);
            }}
            defaultValue={dataDetail}
          />
        ) : null}
      </div>
      <Toast ref={toast}></Toast>
    </Layout>
  );
}

export default MenuPage;
