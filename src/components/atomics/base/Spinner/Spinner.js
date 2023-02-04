import React from 'react';
import PropTypes from 'prop-types';
import { buildClass } from '../../../../constants/commonFunction';
import { ProgressSpinner } from 'primereact/progressspinner';
import './spinner.scss';

Spinner.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  show: PropTypes.bool,
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  stroke: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  fill: PropTypes.string,
};

Spinner.defaultProps = {
  id: '',
  className: '',
  style: {},
  show: false,
  size: 50,
  fill: '#ffffff',
  stroke: 4,
};

function Spinner(props) {
  const { id, style, className, show, size, fill, stroke } = props;
  return (
    <>
      {show && (
        <ProgressSpinner
          className={buildClass(['toe-spinner-app', className])}
          style={{ width: size + 'px', height: size + 'px' }}
          strokeWidth={stroke}
          fill={fill}
          animationDuration=".8s"
        />
      )}
    </>
  );
}

export default Spinner;
