import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { PATH_NAME } from '../../../constants/commonConstant';
import { AuthContext } from '../../../contexts/authContext';

const RequiredAuth = ({ children }) => {
  const auth = useContext(AuthContext);

  if (auth.isLoggedIn && auth.isSysAdmin()) {
    return children;
  }

  if (auth.isLoggedIn && auth.isStaff()) {
    return children;
  }

  if (auth.isLoggedIn) {
    return <Navigate to={PATH_NAME.HOME} />;
  }

  return <Navigate to={PATH_NAME.LOGIN} />;
};

export default RequiredAuth;
