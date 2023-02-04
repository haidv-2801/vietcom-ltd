import { BreadCrumb } from 'primereact/breadcrumb';
import PropTypes from 'prop-types';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { buildClass } from '../../../constants/commonFunction';
import './banner.scss';

Banner.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  title: PropTypes.any,
  icon: PropTypes.any,
  breadCrumbs: PropTypes.array,
};

Banner.defaultProps = {
  id: '',
  className: '',
  style: {},
  title: '',
  icon: null,
  breadCrumbs: [],
};

function Banner(props) {
  const { id, style, className, title, icon, breadCrumbs } = props;
  const navigate = useNavigate();

  const home = {
    icon: 'pi pi-home',
    url: '/',
  };

  return (
    <div
      id={id}
      style={style}
      className={buildClass(['toe-banner', 'toe-font-body', className])}
    >
      <div className="toe-banner__content">
        <div className="toe-banner__content-title">{title}</div>
        <div className="toe-banner__content-icon">{icon}</div>
        <div className="toe-banner__content-breadcrumb">
          <BreadCrumb
            className="toe-banner__breadcrumb toe-font-body"
            model={breadCrumbs}
            home={home}
          />
        </div>
      </div>
    </div>
  );
}

export default Banner;
