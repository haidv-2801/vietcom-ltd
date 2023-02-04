import React from 'react';
import PropTypes from 'prop-types';
import { buildClass } from '../../../../constants/commonFunction';
import './loading.scss';

Loading.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  show: PropTypes.bool,
};

Loading.defaultProps = {
  id: '',
  className: '',
  style: {},
  show: false,
};

function Loading(props) {
  const { id, style, className, show } = props;
  return (
    <>
      {show && (
        <div
          id={id}
          style={style}
          className={buildClass(['toe-loading-app', className])}
        >
          <div className="toe-loading-app_wrapper">
            <div className="ball1"></div>
            <div className="ball2"></div>
            <div className="ball3"></div>
            <div className="ball4"></div>
          </div>
        </div>
      )}
    </>
  );
}

export default Loading;
