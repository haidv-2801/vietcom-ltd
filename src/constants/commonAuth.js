import baseApi from '../api/baseApi';
import { getLocalStorage, setLocalStorage } from '../contexts/authContext';
import { CARD_STATUS, LOCAL_STORATE_KEY, OPERATOR } from './commonConstant';
import END_POINT from './endpoint';

/**
 * Phân quyền
 */
export const ROLES = {
  MEMBER: 2,
  ADMIN: 0,
  STAFF: 1,
  GUEST: 3,
};

export const getUserName = () => {
  const user = JSON.parse(
    decodeURIComponent(getLocalStorage(LOCAL_STORATE_KEY.USER_INFO))
  );
  return user?.fullName;
};

export const getAccountName = () => {
  return getLocalStorage(LOCAL_STORATE_KEY.ACCOUNT_NAME);
};

export const getFullName = () => {
  return getLocalStorage(LOCAL_STORATE_KEY.FULL_NAME);
};

export const getUserID = () => {
  const user = JSON.parse(
    decodeURIComponent(getLocalStorage(LOCAL_STORATE_KEY.USER_INFO))
  );
  return user?.userID;
};

export const validateMember = () => {
  const filter = [
    ['IsDeleted', OPERATOR.EQUAL, '0'],
    OPERATOR.AND,
    ['Status', OPERATOR.EQUAL, '1'],
    OPERATOR.AND,
    ['AccountID', OPERATOR.EQUAL, getUserID()],
  ];

  return new Promise((rs, rj) => {
    baseApi.post(
      (dataLCard) => {
        let data = dataLCard?.data?.pageData;
        if (!data?.length) return rj();
        data = data[0];
        rs(data);
      },
      (err) => {
        rj();
      },
      () => {},
      END_POINT.TOE_LIBRARY_CARD_FILTER,
      {
        filter: btoa(JSON.stringify(filter)),
        pageIndex: 1,
        pageSize: 1,
      },
      null
    );
  });
};
