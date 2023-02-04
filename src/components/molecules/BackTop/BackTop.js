import { BackTop as BackTopAntd } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import { buildClass } from '../../../constants/commonFunction';
import './backTop.scss';

BackTop.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
};

BackTop.defaultProps = {
  id: '',
  className: '',
  style: {},
};

function BackTop(props) {
  const { id, style, className } = props;

  return (
    <BackTopAntd
      className={buildClass(['toe-backtop', className])}
      style={style}
    >
      <div style={{ color: 'red' }}>Top</div>
    </BackTopAntd>
  );
}

export default BackTop;
