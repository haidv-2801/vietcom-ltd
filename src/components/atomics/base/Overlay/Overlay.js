import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { buildClass } from '../../../../constants/commonFunction';
import useOnClickOutside from '../../../../hooks/useClickOutSide';
import './overlay.scss';

Overlay.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  onClick: PropTypes.func,
};

Overlay.defaultProps = {
  id: '',
  className: '',
  style: {},
  name: '',
  onClick: () => {},
};

function Overlay(props) {
  const { id, style, className, children, onClick } = props;
  const ref = useRef(null);
  useOnClickOutside(ref, onClick);
  return (
    <div
      id={id}
      style={style}
      className={buildClass(['toe-overlay', className])}
    >
      <div ref={ref} className="toe-overlay__child">
        {children}
      </div>
    </div>
  );
}

export default Overlay;
