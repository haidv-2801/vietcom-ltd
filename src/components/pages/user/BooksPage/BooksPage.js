import { SearchOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { Chip } from 'primereact/chip';
import { Skeleton } from 'primereact/skeleton';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import baseApi from '../../../../api/baseApi';
import {
  ADMIN_BOOK_PAGE_BOLUMN_SEARCH,
  BUTTON_SHAPE,
  BUTTON_THEME,
  BUTTON_TYPE,
  OPERATOR,
  SECTION_TEXT,
} from '../../../../constants/commonConstant';
import {
  buildClass,
  DOCUMENT_SECTION,
} from '../../../../constants/commonFunction';
import END_POINT from '../../../../constants/endpoint';
import Button from '../../../atomics/base/Button/Button';
import Input from '../../../atomics/base/Input/Input';
import SideBar from '../../../atomics/base/SideBar/SideBar';
import Banner from '../../../molecules/Banner/Banner';
import Book from '../../../molecules/Book/Book';
import Dropdown from '../../../molecules/Dropdown/Dropdown';
import FilterEngine from '../../../molecules/FilterEngine/FilterEngine';
import Footer from '../../../sections/User/Footer/Footer';
import Layout from '../../../sections/User/Layout/Layout';
import { getElectronicDocuments, getNewPaperDocuments } from '../function';
import './booksPage.scss';

BooksPage.propTypes = {
  titlePage: PropTypes.string,
};

BooksPage.defaultProps = { titlePage: '' };

function BooksPage(props) {
  const { children, titlePage } = props;

  const filterTypeOptions = [
    {
      label: 'Tất cả',
      value: 0,
    },
    {
      label: 'Nhan đề',
      value: 1,
    },
    {
      label: 'Tác giả',
      value: 2,
    },
  ];
  const responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 4,
      numScroll: 4,
    },
    {
      breakpoint: '600px',
      numVisible: 2,
      numScroll: 2,
    },
    {
      breakpoint: '480px',
      numVisible: 1,
      numScroll: 1,
    },
  ];
  const DEFAULT_PAGE_SIZE = 5;

  const DEFAULT_SECTION = {};

  const selector = useSelector(
    (rootState) => rootState.filter.booksPageFilterEnige
  );
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [showFilterEngine, setShowFilterEngine] = useState(false);
  const [defaultFilterType, setDefaultFilterType] = useState(0);
  const [commonSearchValue, setCommonSearchValue] = useState('');
  const [bookSection, setBookSection] = useState({});
  const [isPressBtnSearch, setIsPressBtnSearch] = useState(false);

  //Data tai lieu
  const [documentNew, setDocumentNew] = useState({
    data: [],
    totalRecord: 0,
    isLoading: false,
  });

  const [EDocumentNew, setEDocumentNew] = useState({
    data: [],
    totalRecord: 0,
    isLoading: false,
  });

  const [documentSearch, setDocumentSearch] = useState({
    data: [],
    totalRecord: 0,
    isLoading: false,
    searchOption: null,
  });

  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  //filter
  const DEFAULT_FILTER_VALUE = { controls: [], filter: [] };

  const [filterValue, setFilterValue] = useState(DEFAULT_FILTER_VALUE);
  const [filterCount, setFilterCount] = useState(0);
  const [showFilter, setShowFilter] = useState(false);
  const refreshFilterKey = useRef(0);

  useEffect(() => {
    callGetNewPaperDocuments();
    callGetElectronicDocuments();
  }, []);

  const callGetNewPaperDocuments = () => {
    getNewPaperDocuments(
      (res) => {
        let _data = res.data.pageData,
          _totalRecord = res.data.totalRecord;

        setDocumentNew({
          data: _data,
          isLoading: false,
          totalRecord: _totalRecord,
        });

        setIsLoading(false);
      },
      (err) => {
        setDocumentNew((p) => ({
          ...p,
          isLoading: false,
        }));
        setIsLoading(false);
      },
      () => {
        setDocumentNew((p) => ({
          ...p,
          isLoading: true,
        }));
        setIsLoading(true);
      }
    );
  };

  const callGetElectronicDocuments = () => {
    getElectronicDocuments(
      (res) => {
        let _data = res.data.pageData,
          _totalRecord = res.data.totalRecord;

        setEDocumentNew({
          data: _data,
          isLoading: false,
          totalRecord: _totalRecord,
        });

        setIsLoading(false);
      },
      (err) => {
        setEDocumentNew((p) => ({
          ...p,
          isLoading: false,
        }));

        setIsLoading(false);
      },
      () => {
        setEDocumentNew((p) => ({
          ...p,
          isLoading: true,
        }));
        setIsLoading(true);
      }
    );
  };

  const handleClickSeeAll = (section) => {
    navigate(section);
  };

  const renderSection = (
    title,
    document = {},
    section = DOCUMENT_SECTION.DOCUMENT_NEW,
    isAll = false
  ) => {
    const data = document?.data?.map((book) => {
      return (
        <Book
          key={book.bookID}
          className="toe-book-page__body-content__book"
          bookTitle={book.bookName}
          bookAuthor={book.author}
          bookType={book.bookFormat}
          onClick={() => {
            navigate(section + '/' + book.bookID);
          }}
          image={book.image}
        />
      );
    });

    return (
      <div className="toe-book-page__body-section">
        <div className="toe-book-page__body-type toe-font-title">{title}</div>
        <div
          className={buildClass([
            'toe-book-page__body-content',
            document?.isLoading && 'js-loading',
          ])}
        >
          {document?.isLoading ? renderSkeleton(5) : data}
        </div>
        {!isAll ? (
          <div className="toe-book-page__body-btn">
            <Button
              shape={BUTTON_SHAPE.NORMAL}
              type={BUTTON_TYPE.RIGHT_ICON}
              rightIcon={<Chip label={document?.totalRecord} />}
              onClick={() => {
                handleClickSeeAll(section);
              }}
              name={'Xem tất cả'}
            />
          </div>
        ) : null}
      </div>
    );
  };

  const renderReport = (title) => {
    return (
      <div className="toe-book-page__body-section">
        <div className="toe-book-page__body-type toe-font-title">{title}</div>
      </div>
    );
  };

  const renderSkeleton = (number) => {
    let arr = [];
    for (let i = 0; i < number; i++) {
      arr.push(
        <div className="skeleton-book" key={i}>
          <Skeleton key={i} height="200px" width="150px" />
        </div>
      );
    }
  };

  const handleSearch = () => {
    if (!commonSearchValue) setIsPressBtnSearch(false);
    else {
      getBooksFilter();
      setIsPressBtnSearch(true);
    }
  };

  const getBooksFilter = (body = []) => {
    debugger;
    let _value = commonSearchValue?.trim();
    let _filter = [
      ['IsDeleted', OPERATOR.EQUAL, '0'],
      OPERATOR.AND,
      ['Status', OPERATOR.EQUAL, '1'],
    ];
    if (body.length) {
      _filter.push(OPERATOR.AND);
      _filter.push(body);
    } else if (_value != '') {
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
        debugger;
        let _data = res.data.pageData.sort((a, b) => {
          const time = (date) => new Date(date).getTime();
          if (time(b?.createdDate) - time(a?.modifiedDate) > 0) {
            return time(b?.createdDate) - time(a?.createdDate);
          } else {
            return time(b?.modifiedDate) - time(a?.modifiedDate);
          }
        });

        setDocumentSearch({
          ...documentSearch,
          data: _data,
          totalRecord: res.data.totalRecord,
          isLoading: false,
        });
      },
      (err) => {
        setDocumentSearch({
          ...documentSearch,
          isLoading: false,
        });
      },
      () => {
        setDocumentSearch({
          ...documentSearch,
          isLoading: true,
        });
      },
      END_POINT.TOE_GET_BOOKS_FILTER,
      {
        filter: btoa(JSON.stringify(_filter)),
        pageSize: 20,
        pageIndex: 1,
      },
      null
    );
  };

  const getSearchString = useMemo(() => commonSearchValue, [isPressBtnSearch]);

  const handleFilter = () => {
    setIsPressBtnSearch(true);
    setFilterCount(filterValue.controls.length);
    getBooksFilter(filterValue.filter);
  };

  return (
    <Layout>
      <div className="toe-book-page">
        <Banner breadCrumbs={[{ label: 'mượn trả tài liệu', url: pathname }]} />
        <div className="toe-book-page__body-wrapper">
          <div className="toe-book-page__body">
            <div className="toe-book-page__body-main">
              <div
                className="toe-book-page__body-type toe-font-title"
                style={{ marginBottom: 8 }}
              >
                Tìm kiếm
              </div>
              <div className="toe-book-page__search">
                <Dropdown
                  options={filterTypeOptions}
                  defaultValue={defaultFilterType}
                  className="toe-book-page__search-dropdown-filter"
                  wrapperClass="toe-book-page__search-dropdown-filter__wrapper"
                  onChange={({ value }) => setDefaultFilterType(value)}
                />
                <Input
                  autoFocus
                  onChange={(e) => {
                    setCommonSearchValue(e);
                  }}
                  placeholder={'Tìm kiếm sách, tin tức, thông báo, tài liệu...'}
                />
                <Button
                  type={BUTTON_TYPE.LEFT_ICON}
                  leftIcon={<SearchOutlined />}
                  name={'Tìm kiếm'}
                  onClick={handleSearch}
                />
                <div className="toe-admin-book-page__filter">
                  <Tooltip title="Bộ lọc">
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

                  {filterCount ? (
                    <div
                      onClick={() => {
                        setFilterValue(DEFAULT_FILTER_VALUE);
                        getBooksFilter([]);
                        setFilterCount(0);
                      }}
                      className="toe-admin-book-page__filter-remove toe-font-hint"
                    >
                      Xóa tất cả lọc
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="toe-book-page__search-engine"></div>
              {isPressBtnSearch ? (
                <>
                  <div className="toe-font-body toe-book-page__search-engine text-search">
                    Từ khóa tìm kiếm: {getSearchString}
                  </div>
                  {renderSection(
                    'Kết quả',
                    documentSearch,
                    DOCUMENT_SECTION.DOCUMENT_NEW
                  )}
                </>
              ) : (
                <>
                  {renderSection(
                    SECTION_TEXT.DOCUMENT_NEW,
                    documentNew,
                    DOCUMENT_SECTION.DOCUMENT_NEW
                  )}
                  {renderSection(
                    SECTION_TEXT.BORROWED_DOCUMENTS_A_LOT,
                    {},
                    DOCUMENT_SECTION.BORROWED_DOCUMENTS_A_LOT
                  )}
                  {renderSection(
                    SECTION_TEXT.E_DOCUMENT_NEW,
                    EDocumentNew,
                    DOCUMENT_SECTION.BORROWED_DOCUMENTS_A_LOT
                  )}
                  {renderSection(
                    SECTION_TEXT.BORROWED_EDOCUMENTS_A_LOT,
                    DOCUMENT_SECTION.BORROWED_EDOCUMENTS_A_LOT
                  )}
                </>
              )}

              {renderReport('Thống kê')}
            </div>
          </div>
        </div>
        <Footer />
      </div>
      {showFilter ? (
        <SideBar
          show={showFilter}
          onClose={() => setShowFilter(false)}
          title={'Bộ lọc nâng cao'}
          onClickRefreshButton={() => {
            setFilterValue({ filter: [], controls: [] });
            refreshFilterKey.current++;
          }}
          bottomRightButtons={[
            <Button
              name={'Hủy'}
              theme={BUTTON_THEME.THEME_6}
              onClick={() => setShowFilter(false)}
            />,
            <Button
              type={BUTTON_TYPE.LEFT_ICON}
              leftIcon={<SearchOutlined />}
              name={'Tìm kiếm'}
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
    </Layout>
  );
}

export default BooksPage;
