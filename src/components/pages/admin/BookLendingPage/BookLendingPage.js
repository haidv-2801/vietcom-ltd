import {
  ExportOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Tag, Tooltip } from 'antd';
import FileSaver from 'file-saver';
import { isArray, isEmpty } from 'lodash';
import moment from 'moment';
import { Chip } from 'primereact/chip';
import { Skeleton } from 'primereact/skeleton';
import { Toast } from 'primereact/toast';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { CSVLink } from 'react-csv';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { format } from 'react-string-format';
import baseApi from '../../../../api/baseApi';
import { uploadFiles } from '../../../../api/firebase';
import Modal from '../../../atomics/base/ModalV2/Modal';
import TextAreaBase from '../../../atomics/base/TextArea/TextArea';
import { getUserName } from '../../../../constants/commonAuth';
import {
  BOOK_FORMAT,
  BUTTON_THEME,
  BUTTON_TYPE,
  COLUMN_NOT_EXPORT,
  DATE_FORMAT,
  FILTER_TIME_VALUE,
  LOCAL_STORATE_KEY,
  MAXIMUM_PAGESIZE,
  OPERATOR,
  RESERVATION_STATUS,
  SORT_TYPE,
} from '../../../../constants/commonConstant';
import {
  buildClass,
  commonFilterTime,
  DROPDOWN_STATUS,
  genFileNameWithTime,
  getOrderStatus,
  listToTree,
  ParseJson,
} from '../../../../constants/commonFunction';
import END_POINT from '../../../../constants/endpoint';
import { setLocalStorage } from '../../../../contexts/authContext';
import Button from '../../../atomics/base/Button/Button';
import DatePicker from '../../../atomics/base/DatePicker/DatePicker';
import Input from '../../../atomics/base/Input/Input';
import PopupSelection from '../../../atomics/base/PopupSelectionV1/PopupSelection';
import SideBar from '../../../atomics/base/SideBar/SideBar';
import SmartText from '../../../atomics/base/SmartText/SmartText';
import Dropdown from '../../../molecules/Dropdown/Dropdown';
import Paginator from '../../../molecules/Paginator/Paginator';
import Table from '../../../molecules/Table/Table';
import Layout from '../../../sections/Admin/Layout/Layout';
import './bookLendingPage.scss';
import ToastConfirmDelete from '../../../molecules/ToastConfirmDelete/ToastConfirmDelete';

BookLendingPage.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
};

BookLendingPage.defaultProps = {
  id: '',
  className: '',
  style: {},
};

function BookLendingPage(props) {
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
      field: 'bookOrderCode',
      header: 'M?? phi???u',
      filterField: 'bookOrderCode',
      body: (row) => {
        return <SmartText maxWidth={100}>{row?.bookOrderCode}</SmartText>;
      },
      style: { width: 100, maxWidth: 100 },
    },
    {
      field: 'createdDate',
      sortable: true,
      header: 'Ng??y l???p',
      filterField: 'createdDate',
      body: (row) => {
        if (isLoading) return <Skeleton></Skeleton>;
        return (
          <div className="toe-font-body">
            {moment(row?.createdDate).format(DATE_FORMAT.TYPE_1) ??
              TEXT_FALL_BACK.TYPE_1}
          </div>
        );
      },
      style: { width: 130, maxWidth: 130 },
    },
    {
      field: 'fullName',
      header: 'T??n b???n ?????c',
      filterField: 'fullName',
      body: (row) => {
        if (isLoading) return <Skeleton></Skeleton>;
        return (
          <div className="toe-font-body">
            {<SmartText maxWidth={150}>{row?.fullName}</SmartText>}
          </div>
        );
      },
      style: { width: 150, maxWidth: 150 },
    },
    {
      field: 'phoneNumber',
      header: 'S??? ??i???n tho???i',
      filterField: 'phoneNumber',
      body: (row) => {
        if (isLoading) return <Skeleton></Skeleton>;
        return (
          <div className="toe-font-body">
            {<SmartText maxWidth={140}>{row?.phoneNumber}</SmartText>}
          </div>
        );
      },
      style: { width: 140, maxWidth: 140 },
    },
    {
      field: 'fromDate',
      sortable: true,
      header: 'T??? ng??y',
      filterField: 'fromDate',
      body: (row) => {
        if (isLoading) return <Skeleton></Skeleton>;
        return (
          <div className="toe-font-body">
            {moment(row?.fromDate).format(DATE_FORMAT.TYPE_3) ??
              TEXT_FALL_BACK.TYPE_1}
          </div>
        );
      },
      style: { width: 140, maxWidth: 140 },
    },
    {
      field: 'dueDate',
      sortable: true,
      header: '?????n ng??y',
      filterField: 'dueDate',
      body: (row) => {
        if (isLoading) return <Skeleton></Skeleton>;
        return (
          <div className="toe-font-body">
            {moment(row?.dueDate).format(DATE_FORMAT.TYPE_3) ??
              TEXT_FALL_BACK.TYPE_1}
          </div>
        );
      },
      style: { width: 140, maxWidth: 140 },
    },
    {
      field: 'bookOrderInformation',
      sortable: true,
      header: 'M?? s??ch',
      filterField: 'bookOrderInformation',
      body: (row) => {
        return renderBookOrderInfomation(row.bookOrderInformation);
      },
      style: { width: 140, maxWidth: 140 },
    },
    {
      field: 'orderStatus',
      header: 'Tr???ng th??i',
      filterField: 'orderStatus',
      body: (row) => {
        return (
          <div className="toe-font-body">
            {renderOrderStatus(row?.orderStatus)}
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

  const DEFAULT_DATA_CATE = { data: [], isLoading: false, totalRecord: 0 };

  const MIN_PAGE_SIZE = 10;
  const selector = useSelector(
    (rootState) => rootState.filter.booksPageAdminFilterEnige
  );
  const requestDoneRef = useRef(true);
  const isSearchingFilterEngine = useRef(false);
  const [selected, setSelected] = useState([]);
  const [popupMode, setpopupMode] = useState(POPUP_MODE.ADD);
  const [isLoading, setIsLoading] = useState(true);
  const [isShowPopupCreateBookOrder, setIsShowPopupCreateBookOrder] =
    useState(false);
  const [lazyParams, setLazyParams] = useState({ page: 1, rows: 10 });
  const [totalRecords, setTotalRecords] = useState(0);
  const [dataTable, setDataTable] = useState([]);
  const [paging, setPaging] = useState({
    filterValue: '',
    page: 1,
    pageSize: MIN_PAGE_SIZE,
    type: -1,
    bookOrderID: -1,
    orderStatus: -1,
    from: commonFilterTime.find(
      (item) => item.value === FILTER_TIME_VALUE.THIS_MONTH
    ).from,
    to: commonFilterTime.find(
      (item) => item.value === FILTER_TIME_VALUE.THIS_MONTH
    ).to,
  });
  const [rowIdSelected, setRowIdSelected] = useState(null);

  const DEFAULT_FILTER_ENGINE = {
    value: FILTER_TIME_VALUE.THIS_MONTH,
    from: commonFilterTime.find(
      (item) => item.value === FILTER_TIME_VALUE.THIS_MONTH
    ).from,
    to: commonFilterTime.find(
      (item) => item.value === FILTER_TIME_VALUE.THIS_MONTH
    ).to,
  };

  const [filterEngine, setFilterEngine] = useState(DEFAULT_FILTER_ENGINE);

  const [filterTimeValue, setFilterTimeValue] = useState(
    FILTER_TIME_VALUE.THIS_MONTH
  );
  const [filterCount, setFilterCount] = useState(0);
  const [showFilter, setShowFilter] = useState(false);
  const refreshFilterKey = useRef(0);
  const [dataCategory, setDataCategory] = useState(DEFAULT_DATA_CATE);
  const [dataCreate, setDataCreate] = useState({});
  const [isShowPopupNote, setIsShowPopupNote] = useState(false);
  const [isShowPopupDelete, setisShowPopupDelete] = useState(false);
  const [dataNote, setDataNote] = useState('');

  const BOOK_ORDER_STATUS_OPTION = Object.keys(RESERVATION_STATUS).map(
    (item) => ({
      label: getOrderStatus(RESERVATION_STATUS[item]).label,
      value: RESERVATION_STATUS[item],
      onClick: () => handleOnClickStatusOption(RESERVATION_STATUS[item]),
    })
  );

  const OPTIONS = [
    {
      label: (
        <div className="table-option__menu-item">
          <i className="pi pi-eye"></i>Xem chi ti???t
        </div>
      ),
      value: 1,
      onClick: (e) => {
        FileSaver.saveAs(
          'https://firebasestorage.googleapis.com/v0/b/fir-library-upload.appspot.com/o/images%2F001_1.jpg?alt=media&token=07f95ae5-cf2f-4de3-9a0b-5656a92df579',
          'test',
          { autoBom: true }
        );
      },
    },
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
        <PopupSelection
          overlayClassName="status-overlay"
          options={BOOK_ORDER_STATUS_OPTION}
          placement="left"
        >
          <div className="table-option__menu-item">
            <i className="pi pi-arrows-h"></i>?????i tr???ng th??i
          </div>
        </PopupSelection>
      ),
      value: 4,
      onClick: ({ key }) => {
        setRowIdSelected(key);
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
        setisShowPopupDelete(key);
      },
    },
  ];

  const CONFIGS = {
    /**
     * *Config
     */
    resizableColumns: false,
    dataKey: 'bookOrderID',
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
    getBooksLendingFilter();
    // getCategory();
  }, []);

  useEffect(() => {
    if (isLoading) return;
    getBooksLendingFilter();
  }, [paging]);

  const getPopupCreateUserPops = () => {
    if (popupMode === POPUP_MODE.ADD) {
      return {
        title: 'Th??m m???i phi???u',
        footerRight: [
          <Button
            onClick={() => {
              setpopupMode(POPUP_MODE.ADD);
              setIsShowPopupCreateBookOrder(false);
            }}
            theme={BUTTON_THEME.THEME_6}
            name="H???y"
          />,
          <Button name="Th??m" onClick={handleAdd} />,
        ],
      };
    } else if (popupMode === POPUP_MODE.EDIT) {
      return {
        title: 'S???a th??ng tin phi???u',
        footerRight: [
          <Button
            onClick={() => {
              setpopupMode(POPUP_MODE.EDIT);
              setIsShowPopupCreateBookOrder(false);
            }}
            name="H???y"
            theme={BUTTON_THEME.THEME_6}
          />,
          <Button name="C???p nh???p" onClick={handleEdit} />,
        ],
      };
    }
  };

  const getCategory = () => {
    let _filter = [
      ['IsDeleted', OPERATOR.EQUAL, '0'],
      OPERATOR.AND,
      ['Status', OPERATOR.EQUAL, '1'],
    ];

    baseApi.post(
      (res) => {
        let _data = res.data.pageData.map((item) => ({
          ...item,
          key: item?.categoryID,
          label: item.title,
          parentID: item.parentID,
        }));
        _data = listToTree(_data);

        setDataCategory({
          ...dataCategory,
          totalRecord: res.data.totalRecord,
          data: _data,
        });
      },
      (err) => {},
      () => {},
      END_POINT.TOE_GET_CATEGORIES_FILTER,
      {
        filter: btoa(JSON.stringify(_filter)),
        pageSize: MAXIMUM_PAGESIZE,
        pageIndex: 1,
      },
      null
    );
  };

  const getBooksLendingFilter = (filters = [], body = {}) => {
    let _filter = [
      ['IsDeleted', OPERATOR.EQUAL, '0'],
      OPERATOR.AND,
      ['Status', OPERATOR.EQUAL, '1'],
    ];
    if (filters.length) {
      _filter.push(OPERATOR.AND);
      _filter.push(filters);
    } else if (paging.filterValue?.trim() != '') {
      let _value = paging.filterValue?.trim();
      _filter.push(OPERATOR.AND);
      _filter.push([
        ['FullName', OPERATOR.CONTAINS, encodeURI(_value)],
        OPERATOR.OR,
        ['PhoneNumber', OPERATOR.CONTAINS, encodeURI(_value)],
        OPERATOR.OR,
        ['BookOrderCode', OPERATOR.CONTAINS, encodeURI(_value)],
      ]);
    }

    if (paging.orderStatus !== -1) {
      _filter.push(OPERATOR.AND);
      _filter.push(['OrderStatus', OPERATOR.EQUAL, paging.orderStatus]);
    }

    baseApi.post(
      (res) => {
        let _data = res.data.pageData;
        setDataTable(_data.map((_) => ({ ..._, key: _.bookOrderID })));
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
      END_POINT.TOE_BOOK_ORDERS_FILTER_V2,
      {
        filter: btoa(JSON.stringify(_filter)),
        pageSize: paging.pageSize,
        pageIndex: paging.page,
        sort: JSON.stringify([['ModifiedDate', SORT_TYPE.DESC]]),
        ...body,
      },
      null
    );
  };

  const handleEdit = () => {
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
            detail: 'C???p nh???t th??nh c??ng',
            life: 3000,
          });
          getBooksLendingFilter();
        } else {
          toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: 'C???p nh???t th???t b???i',
            life: 3000,
          });
        }
        setIsShowPopupCreateBookOrder(false);
      },
      (err) => {
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: 'C???p nh???t th???t b???i',
          life: 3000,
        });
      },
      () => {},
      format(END_POINT.TOE_UPDATE_BOOK, dataDetail.bookOrderID),
      _body,
      null,
      null
    );
  };

  const handleAdd = () => {
    const imagePromise = uploadFiles(dataCreate.image, 'images');
    const filePromise = uploadFiles(dataCreate.file, 'files');
    if (dataCreate.image && dataCreate.file) {
      Promise.all([imagePromise, filePromise])
        .then((res) => {
          updateBook(res[0], res[1]);
        })
        .catch((err) => {
          toast.current.show({
            severity: 'error',
            summary: 'Th??m m???i th???t b???i',
            detail: JSON.stringify(err),
            life: 3000,
          });
        });
    } else if (dataCreate.file) {
      filePromise
        .then((res) => {
          updateBook('', res);
        })
        .catch((err) => {
          toast.current.show({
            severity: 'error',
            summary: 'Th??m m???i th???t b???i',
            detail: JSON.stringify(err),
            life: 3000,
          });
        });
    } else {
      imagePromise
        .then((res) => {
          updateBook(res, '');
        })
        .catch((err) => {
          toast.current.show({
            severity: 'error',
            summary: 'Th??m m???i th???t b???i',
            detail: JSON.stringify(err),
            life: 3000,
          });
        });
    }
  };

  const updateBook = (imgUrl = null, fileUrl = null) => {
    let _body = {
      ...dataCreate,
      author: JSON.stringify(dataCreate?.authors),
      createdDate: new Date(Date.now() + 7 * 60 * 60 * 1000),
      createdBy: getUserName(),
      modifiedDate: new Date(Date.now() + 7 * 60 * 60 * 1000),
      modifiedBy: getUserName(),
      image: imgUrl,
      file: fileUrl,
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
          getBooksLendingFilter();
        } else {
          toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Th??m m???i th???t b???i',
            life: 3000,
          });
        }
        setIsShowPopupCreateBookOrder(false);
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
      END_POINT.TOE_INSERT_BOOK,
      _body,
      null,
      null
    );
  };

  const handleChangeStatus = (status) => {
    let _body = dataTable.filter((item) => item?.bookOrderID === rowIdSelected);
    if (_body.length) {
      _body = _body[0];
      _body['orderStatus'] = status;
      _body['modifiedDate'] = new Date(Date.now() + 7 * 60 * 60 * 1000);
      if (status === RESERVATION_STATUS.CANCELED) _body['note'] = dataNote;

      baseApi.put(
        (res) => {
          if (res.data > 0) {
            toast.current.show({
              severity: 'success',
              summary: 'Success',
              detail: format(
                'Chuy???n tr???ng th??i {0} th??nh c??ng!',
                <b>{getOrderStatus(status).label}</b>
              ),
              life: 3000,
            });
            getBooksLendingFilter();
          }
        },
        (err) => {
          toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: format(
              'Chuy???n tr???ng th??i {0} th???t b???i!',
              <b>{getOrderStatus(status).label}</b>
            ),
            life: 3000,
          });
        },
        () => {},
        format(END_POINT.TOE_UPDATE_BOOK_ORDER, _body?.bookOrderID),
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
          key: item?.bookOrderID,
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
        if (res.data > 0) {
          toast.current.show({
            severity: 'success',
            summary: 'Success',
            detail: 'X??a th??nh c??ng',
            life: 3000,
          });
          getBooksLendingFilter();
        } else {
          toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: 'X??a th???t b???i',
            life: 3000,
          });
        }
        setisShowPopupDelete(null);
      },
      (err) => {
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: 'X??a th???t b???i',
          life: 3000,
        });
        setisShowPopupDelete(null);
      },
      () => {},
      format(END_POINT.TOE_DELETE_BOOK_ORDER, key)
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

  function renderOrderStatus(status) {
    if (isLoading) return <Skeleton></Skeleton>;
    let statusObject = getOrderStatus(status);
    return <Tag color={statusObject.color}>{statusObject.label}</Tag>;
  }

  function handleOnClickStatusOption(status) {
    switch (status) {
      case RESERVATION_STATUS.LENDING:
      case RESERVATION_STATUS.EXPIRED:
      case RESERVATION_STATUS.PENDING:
      case RESERVATION_STATUS.RETURNED:
      case RESERVATION_STATUS.WAITING:
        handleChangeStatus(status);
        break;
      case RESERVATION_STATUS.NONE:
      case RESERVATION_STATUS.CANCELED:
        setIsShowPopupNote(true);
        break;
      default:
        break;
    }
  }

  function renderBookOrderInfomation(info) {
    if (isLoading) return <Skeleton></Skeleton>;
    let infoParsed = ParseJson(info);
    if (isArray(infoParsed) && !isEmpty(infoParsed)) {
      if (infoParsed.length === 1) {
        return infoParsed[0].bookCode;
      } else {
        let tooltipContent = (
          <div className="tt-wrapper">
            {infoParsed.map((item) => {
              return (
                <div className="tt-row">
                  <div className="tt-row__left">{item.bookCode}</div>|
                  <div className="tt-row__right">{item.bookName}</div>
                </div>
              );
            })}
          </div>
        );

        return (
          <Tooltip
            openClassName="tt-tag-table-order"
            overlayClassName="tt-tag-table-order"
            title={tooltipContent}
          >
            <div
              style={{ backgroundColor: '#ffc107', fontWeight: 700 }}
              className="tag-table-info"
              color={'#000000'}
            >
              {infoParsed.length}+
            </div>
          </Tooltip>
        );
      }
    }
  }

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
      default:
        return null;
    }
  }

  const handleFilter = () => {
    isSearchingFilterEngine.current = true;
  };

  function renderBookFormat(row) {
    if (isLoading) return <Skeleton></Skeleton>;

    let bookFormat = '';
    switch (row.bookFormat) {
      case BOOK_FORMAT.EBOOK:
        bookFormat = 'T??i li???u ??i???n t???';
      case BOOK_FORMAT.PAPER_BACK:
        bookFormat = 'T??i li???u gi???y';
      default:
        break;
    }

    return bookFormat;
  }

  function renderBookImage(row) {
    if (isLoading) return <Skeleton></Skeleton>;

    return (
      <img className="table-image" src={row.image} alt="image" width={100} />
    );
  }

  function renderBookCategory(row) {
    if (isLoading) return <Skeleton></Skeleton>;
    return (
      <SmartText innnerClassName="toe-font-label">{row.categoryID}</SmartText>
    );
  }

  const handleDoubleClickRow = ({ data }) => {
    let infoParsed = ParseJson(data.bookOrderInformation)?.map(
      (item) => item.bookCode
    );
    setLocalStorage(
      LOCAL_STORATE_KEY.BOOK_CODE_FROM_BOOK_LENDING,
      JSON.stringify(infoParsed)
    );

    window.open('/admin/danh-muc/sach', '_blank');
  };

  const getDataExport = () => {
    const dataExport = [];
    const columns = COLUMNS.map((item) => item.field).filter(
      (item) => !COLUMN_NOT_EXPORT.includes(item.toLowerCase())
    );

    dataExport.push(columns);

    dataTable.forEach((item) => {
      let raw = [];
      columns.forEach((col) => {
        if (col === 'bookOrderInformation') {
          let parsed = ParseJson(item[col]);
          raw.push(parsed?.map((item) => item.bookCode)?.join(','));
          return;
        }
        if (col === 'orderStatus') {
          getOrderStatus;
          raw.push(getOrderStatus(item[col]).label);
          return;
        }

        raw.push(item[col]);
      });
      dataExport.push(raw);
    });

    dataExport[0] = dataExport[0].map(
      (item) => COLUMNS.find((it) => it.field?.trim() === item?.trim())?.header
    );

    return dataExport;
  };
  //#endregion

  return (
    <Layout
      title="Qu???n l?? m?????n tr???"
      rightButtons={[
        <Button
          onClick={() => setIsShowPopupCreateBookOrder(true)}
          leftIcon={<PlusOutlined />}
          type={BUTTON_TYPE.LEFT_ICON}
          name="Th??m m???i phi???u"
        />,
      ]}
      className="layout-book-lending-page"
    >
      <div
        id={id}
        style={style}
        className={buildClass(['toe-admin-booklending-page', className])}
      >
        <div className="toe-admin-booklending-page__toolbar">
          <div className="toe-admin-booklending-page__row">
            <div className="toe-admin-booklending-page__row--left">
              {' '}
              <Input
                onChange={(value) => {
                  setPaging({
                    ...paging,
                    filterValue: value,
                  });
                }}
                placeholder={'T??m ki???m T??n b???n ?????c, m?? s??ch, s??? phi???u...'}
                value={paging.filterValue}
                leftIcon={<i className="pi pi-search"></i>}
                delay={300}
              />
              <Dropdown
                className="dropdown-filter-by-menu"
                defaultValue={paging.orderStatus}
                options={DROPDOWN_STATUS}
                hasSubLabel
                onChange={({ value }) =>
                  setPaging({ ...paging, orderStatus: value })
                }
                prefixValue={'Tr???ng th??i'}
                scrollHeight={350}
              />
              <div className="toe-admin-book-page__filter">
                <Tooltip title="B??? l???c">
                  <div
                    className="btn-show-advanced-filter"
                    onClick={() => setShowFilter(true)}
                  >
                    <i className="pi pi-filter"></i>
                  </div>
                </Tooltip>
                {filterCount ? (
                  <div className="toe-admin-book-page__filter-count toe-font-hint">
                    {filterCount}
                  </div>
                ) : null}
              </div>
              {filterCount ? (
                <div
                  onClick={() => {
                    setFilterTimeValue(DEFAULT_FILTER_VALUE);
                    getBooksFilter([]);
                    setFilterCount(0);
                  }}
                  className="toe-admin-book-page__filter-remove toe-font-hint"
                >
                  X??a t???t c??? l???c
                </div>
              ) : null}
            </div>

            <div className="toe-admin-booklending-page__row--right">
              <div className="toe-admin-book-page__filter">
                <Tooltip title="Dowload CSV">
                  <CSVLink
                    data={getDataExport()}
                    asyncOnClick={true}
                    onClick={(event, done) => {}}
                    filename={genFileNameWithTime('DANH_SACH_MUON_TRA')}
                  >
                    <div className="btn-show-advanced-filter">
                      <ExportOutlined />
                    </div>
                  </CSVLink>
                </Tooltip>
                {filterCount ? (
                  <div className="toe-admin-book-page__filter-count toe-font-hint">
                    {filterCount}
                  </div>
                ) : null}
              </div>
            </div>
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
          onRowDoubleClick={handleDoubleClickRow}
          rowClassName={() => 'cursor-pointer'}
        />
        <Paginator
          onChange={({ page, pageSize }) => {
            setPaging({ ...paging, page, pageSize });
          }}
          page={paging.page}
          pageSize={paging.pageSize}
          totalRecords={totalRecords}
        />
        {showFilter ? (
          <SideBar
            className="sidebar-filter-booklending"
            show={showFilter}
            onClose={() => setShowFilter(false)}
            title={'B??? l???c'}
            onClickRefreshButton={() => {
              setFilterTimeValue(DEFAULT_FILTER_VALUE);
            }}
            bottomRightButtons={[
              <Button
                name={'H???y'}
                theme={BUTTON_THEME.THEME_6}
                onClick={() => setShowFilter(false)}
              />,
              <Button
                type={BUTTON_TYPE.LEFT_ICON}
                leftIcon={<SearchOutlined />}
                name={'T??m ki???m'}
                onClick={handleFilter}
              />,
            ]}
          >
            <div className="sidebar-filter-booklending__row">
              <Dropdown
                options={commonFilterTime}
                defaultValue={filterEngine.value}
                label={'Ng??y l???p'}
                onChange={({ value }) => {
                  let timeBetween = commonFilterTime.find(
                    (item) => item.value === value
                  );
                  console.log(
                    moment(timeBetween.from).format(DATE_FORMAT.TYPE_1),
                    '-----',
                    moment(timeBetween.to).format(DATE_FORMAT.TYPE_1)
                  );
                  setFilterEngine({
                    ...filterEngine,
                    from: timeBetween.from,
                    to: timeBetween.to,
                    value,
                  });
                }}
              />
            </div>
            {filterEngine.value === FILTER_TIME_VALUE.OPTION ? (
              <div className="sidebar-filter-booklending__row date">
                <div className="sidebar-filter-booklending__col">
                  {' '}
                  <div className="toe-font-label">T???</div>
                  <DatePicker defaultValue={new Date(filterEngine.from)} />{' '}
                </div>
                <div className="sidebar-filter-booklending__col">
                  {' '}
                  <div className="toe-font-label">?????n</div>
                  <DatePicker defaultValue={new Date(filterEngine.to)} />
                </div>
              </div>
            ) : null}
          </SideBar>
        ) : null}
      </div>
      <Modal
        maximizable={false}
        onClose={() => setIsShowPopupNote(false)}
        show={isShowPopupNote}
        title={'L?? do h???y'}
        footerRight={[
          <Button
            theme={BUTTON_THEME.THEME_6}
            onClick={() => setIsShowPopupNote(false)}
            name="H???y"
          />,
          <Button
            name="X??c nh???n"
            onClick={() => {
              handleChangeStatus(RESERVATION_STATUS.CANCELED);
            }}
          />,
        ]}
      >
        <TextAreaBase
          placeholder={'L?? do h???y'}
          onChange={(value) => setDataNote(value)}
        />
      </Modal>
      {isShowPopupDelete ? (
        <ToastConfirmDelete
          onClose={() => setisShowPopupDelete(null)}
          onAccept={() => {
            handleRemove(isShowPopupDelete);
          }}
        />
      ) : null}
      <Toast ref={toast}></Toast>
    </Layout>
  );
}

export default BookLendingPage;
