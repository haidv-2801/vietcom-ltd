import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Tag, Tooltip } from 'antd';
import FileSaver from 'file-saver';
import moment from 'moment';
import { Chip } from 'primereact/chip';
import { Skeleton } from 'primereact/skeleton';
import { Toast } from 'primereact/toast';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { format } from 'react-string-format';
import baseApi from '../../../../api/baseApi';
import { uploadFiles } from '../../../../api/firebase';
import { getUserName } from '../../../../constants/commonAuth';
import {
  ADMIN_BOOK_PAGE_BOLUMN_SEARCH,
  BOOK_FORMAT,
  BUTTON_THEME,
  BUTTON_TYPE,
  DATE_FORMAT,
  GUID_NULL,
  LOCAL_STORATE_KEY,
  MAXIMUM_PAGESIZE,
  OPERATOR,
  TEXT_FALL_BACK,
} from '../../../../constants/commonConstant';
import {
  buildClass,
  isValidHttpUrl,
  listToTree,
  ParseJson,
} from '../../../../constants/commonFunction';
import END_POINT from '../../../../constants/endpoint';
import { getLocalStorage } from '../../../../contexts/authContext';
import Button from '../../../atomics/base/Button/Button';
import Input from '../../../atomics/base/Input/Input';
import Overlay from '../../../atomics/base/Overlay/Overlay';
import SideBar from '../../../atomics/base/SideBar/SideBar';
import SmartText from '../../../atomics/base/SmartText/SmartText';
import Spinner from '../../../atomics/base/Spinner/Spinner';
import FilterEngine from '../../../molecules/FilterEngine/FilterEngine';
import Paginator from '../../../molecules/Paginator/Paginator';
import Table from '../../../molecules/Table/Table';
import Layout from '../../../sections/Admin/Layout/Layout';
import './bookPage.scss';
import PopupCreateBook from './PopupCreateBook/PopupCreateBook';

BookPage.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
};

BookPage.defaultProps = {
  id: '',
  className: '',
  style: {},
};

function BookPage(props) {
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
      field: 'bookCode',
      sortable: true,
      header: <SmartText>M?? ???n ph???m</SmartText>,
      filterField: 'bookCode',
      body: (row) => {
        return <SmartText maxWidth={170}>{row?.bookCode}</SmartText>;
      },
      style: { width: 170, maxWidth: 170 },
    },
    {
      field: 'bookName',
      sortable: true,
      header: 'T??n ???n ph???m',
      filterField: 'bookName',
      body: (row) => {
        return (
          <div className="toe-font-body">
            {<SmartText rows={4}>{row?.bookName}</SmartText>}
          </div>
        );
      },
      style: { width: 250, maxWidth: 250 },
    },
    {
      field: 'description',
      header: 'M?? t???',
      filterField: 'description',
      body: (row) => {
        return (
          <div className="toe-font-body">
            {
              <SmartText rows={4}>
                {row?.description ?? TEXT_FALL_BACK.TYPE_1}
              </SmartText>
            }
          </div>
        );
      },
      style: { width: 200, maxWidth: 200 },
    },
    {
      field: 'bookFormat',
      header: 'Lo???i t??i li???u',
      filterField: 'bookFormat',
      body: (row) => renderBookFormat(row),
      style: { width: 200, maxWidth: 200 },
    },
    {
      field: 'image',
      header: 'H??nh ???nh',
      filterField: 'image',
      body: (row) => renderBookImage(row),
      style: { width: 200, maxWidth: 200 },
    },
    {
      field: 'isPrivate',
      header: 'Ph???m vi truy c???p',
      filterField: 'isPrivate',
      body: (row) => renderAccessScope(row),
      style: { width: 200, maxWidth: 200 },
    },
    {
      field: 'status',
      header: 'Tr???ng th??i',
      filterField: 'status',
      body: (row) => {
        return <div className="toe-font-body">{renderStatus(row?.status)}</div>;
      },
      style: { width: 180, maxWidth: 180 },
    },
    {
      field: 'createdDate',
      sortable: true,
      header: 'Ng??y t???o',
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

  const DEFAULT_FILTER_VALUE = { controls: [], filter: [] };
  const DEFAULT_DATA_CATE = { data: [], isLoading: false, totalRecord: 0 };

  const MIN_PAGE_SIZE = 10;
  const selector = useSelector(
    (rootState) => rootState.filter.booksPageAdminFilterEnige
  );
  const requestDoneRef = useRef(true);
  const [selected, setSelected] = useState([]);
  const [popupMode, setpopupMode] = useState(POPUP_MODE.ADD);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoading2, setIsLoading2] = useState(false);
  const [isShowPopupCreateBook, setIsShowPopupCreateBook] = useState(false);
  const [lazyParams, setLazyParams] = useState({ page: 1, rows: 10 });
  const [totalRecords, setTotalRecords] = useState(0);
  const [dataTable, setDataTable] = useState([]);
  const [paging, setPaging] = useState({
    filterValue: '',
    page: 1,
    pageSize: MIN_PAGE_SIZE,
    type: -1,
    bookID: -1,
  });
  const [filterValue, setFilterValue] = useState(DEFAULT_FILTER_VALUE);
  const [filterCount, setFilterCount] = useState(0);
  const [showFilter, setShowFilter] = useState(false);
  const [dataCategory, setDataCategory] = useState(DEFAULT_DATA_CATE);
  const [dataCreate, setDataCreate] = useState({
    languageCode: 'vi',
    bookFormat: BOOK_FORMAT.EBOOK,
  });
  const refreshFilterKey = useRef(0);

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
    dataKey: 'bookID',
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
    let filterInfo = ParseJson(
      getLocalStorage(LOCAL_STORATE_KEY.BOOK_CODE_FROM_BOOK_LENDING)
    );
    getBooksFilter();
    getCategory();
  }, []);

  useEffect(() => {
    if (isLoading) return;
    getBooksFilter();
  }, [paging]);

  const getPopupCreateUserPops = () => {
    if (popupMode === POPUP_MODE.ADD) {
      return {
        title: 'Th??m m???i ???n ph???m',
        footerRight: [
          <Button
            onClick={() => {
              setpopupMode(POPUP_MODE.ADD);
              setIsShowPopupCreateBook(false);
            }}
            theme={BUTTON_THEME.THEME_6}
            name="H???y"
          />,
          <Button name="Th??m" onClick={handleAdd} />,
        ],
      };
    } else if (popupMode === POPUP_MODE.EDIT) {
      return {
        title: 'S???a th??ng tin ???n ph???m',
        footerRight: [
          <Button
            onClick={() => {
              setpopupMode(POPUP_MODE.EDIT);
              setIsShowPopupCreateBook(false);
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

  const getBooksFilter = (body = []) => {
    let _filter = [['IsDeleted', OPERATOR.EQUAL, '0']];
    if (body.length) {
      _filter.push(OPERATOR.AND);
      _filter.push(body);
    } else if (paging.filterValue?.trim() != '') {
      let _value = paging.filterValue?.trim();
      _filter.push(OPERATOR.AND);
      _filter.push([
        ['BookCode', OPERATOR.CONTAINS, encodeURI(_value)],
        OPERATOR.OR,
        ['BookName', OPERATOR.CONTAINS, encodeURI(_value)],
        OPERATOR.OR,
        ['Description', OPERATOR.CONTAINS, encodeURI(_value)],
        OPERATOR.OR,
        ['Publisher', OPERATOR.CONTAINS, encodeURI(_value)],
      ]);
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

        setDataTable(_data.map((_) => ({ ..._, key: _.bookID })));
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
      END_POINT.TOE_GET_BOOKS_FILTER,
      {
        filter: btoa(JSON.stringify(_filter)),
        pageSize: paging.pageSize,
        pageIndex: paging.page,
      },
      null
    );
  };

  const handleEdit = () => {
    setIsLoading2(true);
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
          getBooksFilter();
        } else {
          toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: 'C???p nh???t th???t b???i',
            life: 3000,
          });
        }
        setIsLoading2(false);
        setIsShowPopupCreateBook(false);
      },
      (err) => {
        setIsLoading2(false);
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: 'C???p nh???t th???t b???i',
          life: 3000,
        });
      },
      () => {},
      format(END_POINT.TOE_UPDATE_BOOK, dataDetail.bookID),
      _body,
      null,
      null
    );
  };

  const handleAdd = () => {
    setIsLoading2(true);
    let filePromise = dataCreate.file
      ? uploadFiles(dataCreate.file, 'files')
      : Promise.resolve(null);
    let imagePromise = dataCreate.image
      ? uploadFiles(dataCreate.image, 'images')
      : Promise.resolve(null);

    Promise.all([imagePromise, filePromise])
      .then((res) => {
        updateBook(res[0], res[1]);
      })
      .catch((err) => {
        setIsLoading2(false);
        toast.current.show({
          severity: 'error',
          summary: 'Th??m m???i th???t b???i',
          detail: JSON.stringify(err),
          life: 3000,
        });
      });
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
          getBooksFilter();
        } else {
          toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Th??m m???i th???t b???i',
            life: 3000,
          });
        }
        setIsShowPopupCreateBook(false);
        setIsLoading2(false);
      },
      (err) => {
        setIsLoading2(false);
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

  const handleActive = (key) => {
    let _body = dataTable.filter((item) => item?.bookID === key);
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
            getBooksFilter();
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
        format(END_POINT.TOE_UPDATE_BOOK, _body?.bookID),
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
          key: item?.bookID,
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
          getBooksFilter();
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
      format(END_POINT.TOE_DELETE_BOOK, key)
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
    setFilterCount(filterValue.controls.length);
    getBooksFilter(filterValue.filter);
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
    if (!isValidHttpUrl(row.image)) return TEXT_FALL_BACK.TYPE_1;
    return (
      <img className="table-image" src={row.image} alt="image" width={100} />
    );
  }

  function renderAccessScope(row) {
    if (isLoading) return <Skeleton></Skeleton>;
    return (
      <div className="flex align-items-center">
        <Tag color={row.isPrivate ? '#FF8800' : '#28a745'}>
          {row.isPrivate ? 'Private' : 'Public'}
        </Tag>
        {row.isPrivate ? (
          <Tooltip title={'T??i li???u ch??? cho ph??p truy c???p n???i b???'}>
            <i className="pi pi-info-circle"></i>
          </Tooltip>
        ) : null}
      </div>
    );
  }
  //#endregion

  return (
    <Layout
      title="Qu???n l?? ???n ph???m"
      rightButtons={[
        <Button
          onClick={() => setIsShowPopupCreateBook(true)}
          leftIcon={<PlusOutlined />}
          type={BUTTON_TYPE.LEFT_ICON}
          name="Th??m m???i ???n ph???m"
        />,
      ]}
    >
      <div
        id={id}
        style={style}
        className={buildClass(['toe-admin-book-page', className])}
      >
        <div className="toe-admin-book-page__toolbar">
          <div className="toe-admin-book-page__row">
            <div className="toe-admin-book-page__row--left">
              {' '}
              <Input
                onChange={(value) => {
                  setPaging({
                    ...paging,
                    filterValue: value,
                  });
                }}
                placeholder={'T??m ki???m Ti??u ?????, Alias, M?? t???...'}
                value={paging.filterValue}
                leftIcon={<i className="pi pi-search"></i>}
                delay={300}
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
                    setFilterValue(DEFAULT_FILTER_VALUE);
                    getBooksFilter([]);
                    setFilterCount(0);
                  }}
                  className="toe-admin-book-page__filter-remove toe-font-hint"
                >
                  X??a t???t c??? l???c
                </div>
              ) : null}
            </div>
            <div className="toe-admin-book-page__row--right"> </div>

            {/* <Dropdown
              className="dropdown-filter-by-menu"
              defaultValue={paging.type}
              options={DROPDOWN_TYPE_OPTIONS}
              hasSubLabel
              prefixValue={'Lo???i Menu'}
              scrollHeight={350}
              onChange={({ value }) => setPaging({ ...paging, type: value })}
            /> */}
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
        {isShowPopupCreateBook && (
          <PopupCreateBook
            className="toe-admin-book-page__popup-create-book"
            show={true}
            onClose={() => setIsShowPopupCreateBook(false)}
            onChange={(data) => {
              setDataCreate({ ...dataCreate, ...data });
            }}
            defaultValue={dataCreate}
            dataCategory={dataCategory}
            {...getPopupCreateUserPops()}
          />
        )}
        {showFilter ? (
          <SideBar
            show={showFilter}
            onClose={() => setShowFilter(false)}
            title={'B??? l???c n??ng cao'}
            onClickRefreshButton={() => {
              setFilterValue({ filter: [], controls: [] });
              refreshFilterKey.current++;
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
            <FilterEngine
              key={refreshFilterKey.current}
              defaultControls={selector.controls}
              defaultFilter={selector.filter}
              filterTypeOptions={ADMIN_BOOK_PAGE_BOLUMN_SEARCH}
              onChange={({ filter, controls }) => {
                setFilterValue({ filter, controls });
              }}
            />
          </SideBar>
        ) : null}
        {isLoading2 && (
          <Overlay className="spinner-middle-overlay">
            {' '}
            <Spinner show className="spinner-middle" />
          </Overlay>
        )}
      </div>
      <Toast ref={toast}></Toast>
    </Layout>
  );
}

export default BookPage;
