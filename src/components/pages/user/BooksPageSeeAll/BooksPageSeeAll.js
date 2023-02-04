import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';
import { Skeleton } from 'primereact/skeleton';
import baseApi from '../../../../api/baseApi';
import {
  BOOK_FORMAT,
  BUTTON_TYPE,
  KEY_CODE,
  MAXIMUM_PAGESIZE,
  OPERATOR,
  PAGEGING,
  SORT_TYPE,
} from '../../../../constants/commonConstant';
import {
  buildClass,
  DOCUMENT_SECTION,
  ParseJson,
} from '../../../../constants/commonFunction';
import END_POINT from '../../../../constants/endpoint';
import Banner from '../../../molecules/Banner/Banner';
import Book from '../../../molecules/Book/Book';
import Paginator from '../../../molecules/Paginator/Paginator';
import Footer from '../../../sections/User/FooterLib/Footer';
import Layout from '../../../sections/User/Layout/Layout';
import { getBookType, getNewPaperDocuments } from '../function';
import Input from '../../../atomics/base/Input/Input';
import './booksPageSeeAll.scss';

BooksPageSeeAll.propTypes = {
  titlePage: PropTypes.string,
};

BooksPageSeeAll.defaultProps = { titlePage: '' };

function BooksPageSeeAll(props) {
  const { children, titlePage } = props;
  const VIEW_TYPE = {
    LARGE: 0,
    SMALL: 1,
  };

  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { pathname } = useLocation();
  const [data, setData] = useState([]);
  const [totalRecord, setTotalRecord] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const cateParam = searchParams.get('categoryID');
  const searchParam = searchParams.get('search');

  const breadCrumbs = pathname
    .split('/')
    .filter(Boolean)
    .map((item, _) => ({ label: item, url: _ === 0 ? '/' + item : item }));

  const navigate = useNavigate();
  const [viewType, setViewType] = useState(VIEW_TYPE.SMALL);
  const [cateSelected, setCateSelected] = useState(-1);
  const [textSearch, setTextSearch] = useState(null);
  const textSearchRef = useRef('');

  useEffect(() => {
    const { slug } = params;
    if (slug) {
      switch (slug) {
        case DOCUMENT_SECTION.BORROWED_DOCUMENTS_A_LOT:
          break;
        case DOCUMENT_SECTION.BORROWED_EDOCUMENTS_A_LOT:
          break;
        case DOCUMENT_SECTION.DOCUMENT_NEW:
          getNewPaperDocuments(
            (res) => {
              let _data = res.data.pageData,
                _totalRecord = res.data.totalRecord;
              setData(_data);
              setTotalRecord(_totalRecord);
              setIsLoading(false);
            },
            (err) => {
              setIsLoading(false);
            },
            () => {
              setIsLoading(true);
            }
          );
          break;
        case DOCUMENT_SECTION.E_DOCUMENT_NEW:
          break;
        default:
          break;
      }
    } else {
    }
    callApiGetCategory();
  }, []);

  useEffect(() => {
    let moreFilter = [];
    if (cateParam != -1 && cateParam != null) {
      moreFilter = [OPERATOR.AND, ['categoryID', OPERATOR.EQUAL, cateParam]];
    }

    if (textSearchRef.current?.trim()) {
      moreFilter.push(OPERATOR.AND);
      moreFilter.push(['bookName', OPERATOR.CONTAINS, textSearchRef.current]);
    }

    getNewPaperDocuments(
      (res) => {
        let _data = res.data.pageData,
          _totalRecord = res.data.totalRecord;
        setData(_data);
        setTotalRecord * _totalRecord;
        setIsLoading(false);
      },
      (err) => {
        setIsLoading(false);
      },
      () => {
        setIsLoading(true);
      },
      moreFilter
    );
  }, [cateParam, searchParam]);

  const callApiGetCategory = () => {
    let _filter = [
      ['IsDeleted', OPERATOR.EQUAL, '0'],
      OPERATOR.AND,
      ['Status', OPERATOR.EQUAL, '1'],
    ];

    baseApi.post(
      (res) => {
        let data = res.data.pageData;
        setCategories([{ title: 'Tất cả', categoryID: -1 }, ...data]);
      },
      (err) => {},
      () => {},
      END_POINT.TOE_GET_CATEGORIES_FILTER,
      {
        filter: btoa(JSON.stringify(_filter)),
        pageSize: MAXIMUM_PAGESIZE,
        pageIndex: 1,
        sort: JSON.stringify([['CreatedDate', SORT_TYPE.DESC]]),
      },
      null
    );
  };

  const handleViewDetail = (bookID) => {
    navigate(bookID);
  };

  const renderReport = (title) => {
    return (
      <div className="toe-book-see-all-page__body-section">
        <div className="toe-book-see-all-page__body-type toe-font-title">
          {title}
        </div>
      </div>
    );
  };

  const renderSection = (title) => {
    if (isLoading) return renderSkeleton(5);
    if (!data?.length) return 'Không có dữ liệu';
    const _data = data.map((item, _) => {
      return (
        <div key={_} className="toe-book-see-all-page__body-content__item">
          <Book
            className="toe-book-see-all-page__body-content__book"
            bookTitle={item?.bookName}
            bookAuthor={item?.author}
            bookType={item?.bookFormat}
            image={item?.image}
            onClick={() => handleViewDetail(item.bookID)}
          />
          {viewType === VIEW_TYPE.SMALL && (
            <div className="toe-book-see-all-page__body-content__item-info">
              <h2
                onClick={() => handleViewDetail(item.bookID)}
                className="toe-book-see-all-page__body-content__item-info__row toe-font-label"
              >
                {item?.bookName}
              </h2>
              <div className="toe-book-see-all-page__body-content__item-info__row">
                <span className="toe-font-label">Loại tài liệu:</span>{' '}
                <span className="toe-font-body">
                  {getBookType(item?.bookFormat)}
                </span>
              </div>
              <div className="toe-book-see-all-page__body-content__item-info__row">
                <span className="toe-font-label">Tác giả:</span>
                <span className="toe-font-body list-author">
                  {ParseJson(item?.author)?.join(', ')}
                </span>
              </div>
              <div className="toe-book-see-all-page__body-content__item-info__row">
                <span className="toe-font-label">Nhà xuất bản:</span>
                <span className="toe-font-body">{item?.publisher}</span>
              </div>
              {/* <div className="toe-book-see-all-page__body-content__item-info__row">
                <span className="toe-font-label">Thông tin xếp giá:</span>
                <span className="toe-font-body">C1</span>
              </div> */}
            </div>
          )}
        </div>
      );
    });

    return (
      <div className="toe-book-see-all-page__body-section">
        <div className="toe-book-see-all-page__body-type toe-font-title">
          {title}
        </div>
        <div
          className={buildClass([
            'toe-book-see-all-page__body-content',
            viewType === VIEW_TYPE.SMALL && 'view-type-small',
          ])}
        >
          {_data}
        </div>
      </div>
    );
  };

  const handleChangeViewType = (viewtype) => {
    setViewType(viewtype);
  };

  const handleFilterByCate = ({ categoryID }) => {
    if (searchParam == null || !textSearchRef.current?.trim()) {
      setSearchParams({ categoryID });
    } else {
      setSearchParams({
        search: searchParam ?? textSearchRef.current,
        categoryID,
      });
    }
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

    return <div className="skeleton-list"> {arr}</div>;
  };

  const handleSetSearch = () => {
    if (textSearchRef.current?.trim() != '') {
      setSearchParams({
        categoryID: cateParam,
        search: encodeURI(textSearchRef.current?.trim()),
      });
    } else {
      setSearchParams({
        categoryID: cateParam ?? -1,
      });
    }
  };

  return (
    <Layout>
      <div className="toe-book-see-all-page">
        <Banner breadCrumbs={breadCrumbs} />
        <div className="toe-book-see-all-page__body-wrapper">
          <div className="toe-book-see-all-page__body">
            <div className="toe-book-see-all-page__body-main">
              <div className="toe-book-see-all-page__body-main__left toe-font-body">
                {renderReport('Tài nguyên khác')}
                <div className="__other-resource">Z39.50</div>
                <div className="__other-resource">OAI/PMH</div>

                <div className="toe-font-body" style={{ marginTop: 24 }}>
                  {renderReport('Thể loại')}
                  <div className="button-search">
                    <Input
                      placeholder={'Tìm kiếm sách'}
                      className="input-filter-book"
                      onChange={(e) => (textSearchRef.current = e)}
                      onKeyDown={(e) => {
                        if (e.keyCode === KEY_CODE.ENTER) {
                          handleSetSearch();
                        }
                      }}
                    />
                    <div
                      className="button-search__icon"
                      onClick={handleSetSearch}
                    >
                      <SearchOutlined />
                    </div>
                  </div>
                  {categories.map((item) => (
                    <div
                      onClick={() => {
                        handleFilterByCate(item);
                        setCateSelected(item.categoryID);
                      }}
                      key={item.categoryID}
                      className={buildClass([
                        '__other-resource category',
                        cateSelected === item.categoryID && 'cate-active',
                      ])}
                    >
                      {item.title}
                    </div>
                  ))}
                </div>
              </div>
              <div className="toe-book-see-all-page__body-main__right">
                {renderReport('Tài liệu mượn nhiều')}
                <div className="toe-book-see-all-page__body-main__right__nav-view-item">
                  <div
                    onClick={() => handleChangeViewType(VIEW_TYPE.SMALL)}
                    className={buildClass([
                      'nav-view-item',
                      viewType === VIEW_TYPE.SMALL && 'nav-view-item--selected',
                    ])}
                  >
                    <i className="pi pi-list"></i>
                  </div>
                  <div
                    onClick={() => handleChangeViewType(VIEW_TYPE.LARGE)}
                    className={buildClass([
                      'nav-view-item',
                      viewType === VIEW_TYPE.LARGE && 'nav-view-item--selected',
                    ])}
                  >
                    <i className="pi pi-th-large"></i>
                  </div>
                </div>
                {renderSection()}
              </div>
            </div>
          </div>
          {data.length > Math.min(...PAGEGING) ? (
            <Paginator
              hasShowLeftInfo={false}
              hasChangePageSize={false}
              totalRecords={totalRecord}
              onChange={(data) => {}}
              pageSize={20}
            />
          ) : null}
        </div>
        <Footer />
      </div>
    </Layout>
  );
}

export default BooksPageSeeAll;
