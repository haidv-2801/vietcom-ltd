import React from 'react';
import PropTypes from 'prop-types';

Icons.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
};

Icons.defaultProps = {
  id: '',
  className: '',
  style: {},
};

function Icons(props) {
  const { id, style, className } = props;
  return (
    <div id={id} style={style} className={buildClass(['toe-font-body'])}></div>
  );
}

export default Icons;
