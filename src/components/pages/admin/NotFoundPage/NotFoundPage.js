import React from 'react';
import { useNavigate } from 'react-router-dom';
import './notFoundPage.scss';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="toe-not-found-page">
      <div>
        <h1>Bạn không có quyền truy cập trang này</h1>
        <a onClick={() => navigate('/')} className="toe-not-found-page__back">
          Quay về trang chủ
        </a>
      </div>
    </div>
  );
};

export default NotFoundPage;
