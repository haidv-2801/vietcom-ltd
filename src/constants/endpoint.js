const DEV_HOST = process.env.REACT_APP_DEV_DOMAIN;
const PROD_HOST = process.env.REACT_APP_PROD_DOMAIN;
const host =
  process.env.NODE_ENV.toLowerCase() === 'development' ||
  process.env.NODE_ENV.toLowerCase() == ''
    ? DEV_HOST
    : PROD_HOST;

const END_POINT = (() => {
  return {
    //login
    TOE_LOGIN: host + '/auth/login',

    //exam
    TOE_GET_EXAM_INTRO: host + '/api/exams/intro',
    TOE_GET_EXAMS: host + '/api/exams/name',
    TOE_GET_EXAM_DETAIL: host + '/api/exams',

    //admin
    /**
     * *Endpoint bài đăng
     */
    TOE_GET_POSTS_FILTER_PAGING: host + 'api/Posts/PostsFilterPaging',
    TOE_GET_POSTS: host + 'api/Posts',
    TOE_UPDATE_POST: host + 'api/Posts/{0}',
    TOE_INSERT_POST: host + 'api/Posts',
    TOE_GET_POST_BY_ID: host + 'api/Posts/{0}',
    TOE_DELETE_POST: host + 'api/Posts/{0}',
    TOE_GET_POSTS_FILTER: host + 'api/Posts/Filter',

    /**
     * *Endpoint menu
     */
    TOE_GET_MENUS_FILTER_PAGING: host + 'api/Menus/MenusFilterPaging',
    TOE_GET_MENUS: host + 'api/Menus',
    TOE_GET_MENUS_POST_COUNT: host + 'api/Menus/MenuPostsCount',
    TOE_UPDATE_MENU: host + 'api/Menus/{0}',
    TOE_INSERT_MENU: host + 'api/Menus',
    TOE_GET_MENU_BY_ID: host + 'api/Menus/{0}',
    TOE_DELETE_MENU: host + 'api/Menus/{0}',
    TOE_GET_MENUS_FILTER: host + 'api/Menus/Filter',

    /**
     * *Endpoint user
     */
    TOE_GET_USERS_FILTER_PAGING: host + 'api/Accounts/AccountsFilterPaging',
    TOE_GET_USERS: host + 'api/Accounts',
    TOE_UPDATE_USER: host + 'api/Accounts/{0}',
    TOE_UPDATE_USER_PASSWORD: host + 'api/Accounts/ChangePassword/{0}',
    TOE_DELETE_USER: host + 'api/Accounts/{0}',
    TOE_INSERT_USER: host + 'api/Accounts',
    TOE_GET_USER_BY_ID: host + 'api/Accounts/{0}',
    TOE_USER_LOGIN: host + 'api/Accounts/Login',
    TOE_USER_FILTER: host + 'api/Accounts/Filter',

    /**
     * *Endpoint book
     */
    TOE_GET_BOOKS_FILTER_PAGING: host + 'api/Books/BooksFilterPaging',
    TOE_GET_BOOKS: host + 'api/BookItems',
    TOE_UPDATE_BOOK: host + 'api/BookItems/{0}',
    TOE_DELETE_BOOK: host + 'api/BookItems/{0}',
    TOE_INSERT_BOOK: host + 'api/BookItems',
    TOE_GET_BOOK_BY_ID: host + 'api/BookItems/{0}',
    TOE_GET_BOOKS_FILTER: host + 'api/BookItems/Filter',
    TOE_GET_BOOKS_PRIVATE_FILTER: host + 'api/BookItems/private/filter',
    TOE_GET_NEXT_BOOK_CODE: host + 'api/BookItems/NextBookCode',

    /**
     * *Endpoint category
     */
    TOE_GET_CATEGORIES: host + 'api/category',
    TOE_UPDATE_CATEGORY: host + 'api/category/{0}',
    TOE_DELETE_CATEGORY: host + 'api/category/{0}',
    TOE_INSERT_CATEGORY: host + 'api/category',
    TOE_GET_CATEGORY_BY_ID: host + 'api/category/{0}',
    TOE_GET_CATEGORIES_FILTER: host + 'api/categorys/Filter',

    /**
     * *Endpoint upload
     */
    TOE_GET_FILE: host + 'uploads/{0}',
    TOE_INSERT_FILE: host + 'api/file/insert',

    /**
     * *Endpoint book order
     */
    TOE_INSERT_BOOK_ORDER: host + 'api/BookOrder/Insert',
    TOE_UPDATE_BOOK_ORDER: host + 'api/BookOrder/{0}',
    TOE_NEXT_BOOK_ORDER: host + 'api/BookOrder/NextBookOrderCode',
    TOE_BOOK_ORDERS_FILTER_V2: host + 'api/BookOrder/BookOrderFilterV2',
    TOE_DELETE_BOOK_ORDER: host + 'api/BookOrder/{0}',

    /**
     * *Endpoint notification
     */
    TOE_GET_NOTIFICATIONS_FILTER: host + 'api/Notifications/Filter',

    /**
     * *Endpoint safeaddress
     */
    TOE_INSERT_SAFE_ADDRESS: host + 'api/SafeAddress',
    TOE_UPDATE_SAFE_ADDRESS: host + 'api/SafeAddress/{0}',
    TOE_DELETE_SAFE_ADDRESS: host + 'api/SafeAddress/{0}',
    TOE_SAFE_ADDRESS_FILTER: host + 'api/SafeAddress/Filter',
    TOE_SAFE_ADDRESS_ALLOWED_ACCESS:
      host + 'api/SafeAddress/CheckAllowedAccess',

    /**
     * *Endpoint role
     */
    TOE_INSERT_ROLES: host + 'api/Roles',
    TOE_UPDATE_ROLES: host + 'api/Roles/{0}',
    TOE_DELETE_ROLES: host + 'api/Roles/{0}',
    TOE_ROLES_FILTER: host + 'api/Roles/Filter',
    TOE_ROLES_ALLOWED_ACCESS: host + 'api/Roles/CheckAllowedAccess',

    /**
     * *Endpoint report
     */
    TOE_SCORE_CARD: host + 'api/scorecard',
    TOE_BOOK_BORROWED: host + 'api/top-book-borrowed',

    /**
     * *Endpoint librarycard
     */
    TOE_INSERT_LIBRARY_CARD: host + 'api/LibraryCard',
    TOE_UPDATE_LIBRARY_CARD: host + 'api/LibraryCard/{0}',
    TOE_DELETE_LIBRARY_CARD: host + 'api/LibraryCard/{0}',
    TOE_LIBRARY_CARD_FILTER: host + 'api/LibraryCard/Filter',
    TOE_GET_CATEGORY_BY_ID: host + 'api/LibraryCard/{0}',
    TOE_GET_NEXT_CARD_CODE: host + 'api/LibraryCard/NextCardCode',
    TOE_ACCEPT_MANY: host + 'api/LibraryCard/AcceptMany',
  };
})();

export const GEOTARGET_ENDPOINT = {
  VN_CITY_PROVINCE: 'https://provinces.open-api.vn/api/',
  VN_DISTRICT: 'https://provinces.open-api.vn/api/p/{0}?depth=2',
  VN_WARD_COMMUNE: 'https://provinces.open-api.vn/api/d/{0}?depth=2',
};

export default END_POINT;
