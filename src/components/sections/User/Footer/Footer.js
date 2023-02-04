import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import { buildClass } from '../../../../constants/commonFunction';
import Button from '../../../atomics/base/Button/Button';
import Input from '../../../atomics/base/Input/Input';
import './footer.scss';

Footer.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
};

Footer.defaultProps = {
  id: '',
  className: '',
  style: {},
};

function Footer(props) {
  const { id, style, className } = props;

  return (
    <footer
      id={id}
      style={style}
      className={buildClass([
        'toe-layout-user-page-container__footer',
        className,
      ])}
    >
      <div className="footer-top">
        {' '}
        <Link
          className="btn btn-outline-light btn-floating m-1"
          to="#!"
          role="button"
        >
          <i className="pi pi-facebook" />
        </Link>
        <Link
          className="btn btn-outline-light btn-floating m-1"
          to="#!"
          role="button"
        >
          <i className="pi pi-twitter" />
        </Link>
        <Link
          className="btn btn-outline-light btn-floating m-1"
          to="#!"
          role="button"
        >
          <i className="pi pi-google" />
        </Link>
        <Link
          className="btn btn-outline-light btn-floating m-1"
          to="#!"
          role="button"
        >
          <i className="pi pi-github" />
        </Link>
      </div>
      <div className="footer-bottom">
        <span className="footer-bottom__label toe-font-label">
          {' '}
          Email hỗ trợ:
        </span>
        <Input style={{ width: 400 }} placeholder={'thuvien365@gmail.com'} />
        <Button className="footer-bottom__btn-send" name={'Gửi'} />
      </div>
      <div className="footer-copyright">
        © 2021 Copyright:
        <Link className="text-white" to="#">
          {' '}
          Thuvien365@gmail.com
        </Link>
      </div>
    </footer>
  );
}

export default Footer;
