import END_POINT from '../../../constants/endpoint';
import {
  SORT_TYPE,
  TEXT_FALL_BACK,
  OPERATOR,
  BOOK_FORMAT,
  BOOK_TYPE,
} from '../../../constants/commonConstant';
import baseApi from '../../../api/baseApi';

const DEFAULT_PAGE_SIZE = 10;
const NotPrivateFilter = ['IsPrivate', OPERATOR.EQUAL, '0'];

export const getNewPaperDocuments = (
  onSuccess,
  onFailure,
  beforeSend,
  customFilter = []
) => {
  let _filter = [
    ['IsDeleted', OPERATOR.EQUAL, '0'],
    OPERATOR.AND,
    ['Status', OPERATOR.EQUAL, '1'],
    OPERATOR.AND,
    ['BookFormat', OPERATOR.EQUAL, BOOK_FORMAT.PAPER_BACK],
    OPERATOR.AND,
    NotPrivateFilter,
    ...customFilter,
  ];

  baseApi.post(
    onSuccess,
    onFailure,
    beforeSend,
    END_POINT.TOE_GET_BOOKS_FILTER,
    {
      filter: btoa(JSON.stringify(_filter)),
      pageSize: DEFAULT_PAGE_SIZE,
      pageIndex: 1,
      sort: JSON.stringify([['CreatedDate', SORT_TYPE.DESC]]),
    },
    null
  );
};

export const getElectronicDocuments = (onSuccess, onFailure, beforeSend) => {
  let _filter = [
    ['IsDeleted', OPERATOR.EQUAL, '0'],
    OPERATOR.AND,
    ['Status', OPERATOR.EQUAL, '1'],
    OPERATOR.AND,
    ['BookFormat', OPERATOR.EQUAL, BOOK_FORMAT.EBOOK],
    OPERATOR.AND,
    NotPrivateFilter,
  ];

  baseApi.post(
    onSuccess,
    onFailure,
    beforeSend,
    END_POINT.TOE_GET_BOOKS_FILTER,
    {
      filter: btoa(JSON.stringify(_filter)),
      pageSize: DEFAULT_PAGE_SIZE,
      pageIndex: 1,
      sort: JSON.stringify([['CreatedDate', SORT_TYPE.DESC]]),
    },
    null
  );
};

export const getBookType = (type) => {
  switch (type) {
    case BOOK_FORMAT.EBOOK:
      return 'Tài liệu số';
    case BOOK_FORMAT.PAPER_BACK:
      return 'Tài liệu giấy';
    default:
      return TEXT_FALL_BACK.TYPE_1;
  }
};

export const getBookFormat = (type) => {
  if (type == BOOK_TYPE.SYLLABUS) return 'Giáo trình';
  else if (type == BOOK_TYPE.REFERENCE_BOOK) return 'Sách tham khảo';
  return TEXT_FALL_BACK.TYPE_1;
};
