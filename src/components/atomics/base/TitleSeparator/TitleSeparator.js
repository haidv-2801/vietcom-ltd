import PropTypes from 'prop-types';
import React from 'react';
import { buildClass } from '../../../../constants/commonFunction';
import './titleSeparator.scss';

TitleSeparator.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  title: PropTypes.any,
  icon: PropTypes.any,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onClick: PropTypes.func,
};

TitleSeparator.defaultProps = {
  id: '',
  className: '',
  style: {},
  title: '',
  icon: null,
  width: 'auto',
  onClick: () => {},
};

function TitleSeparator(props) {
  const { id, style, className, title, icon, width, onClick } = props;
  return (
    <div
      id={id}
      // style={{ color: 'rgb(67, 193, 201)', width: width, ...style }}
      style={{ width: width, ...style }}
      className={buildClass([
        'toe-title-separator',
        'toe-font-large-title',
        className,
      ])}
      onClick={onClick}
    >
      {title}{' '}
      <div className="toe-title-separator__icon">
        <div className="toe-title-separator__line"></div>
        {icon}
        <div className="toe-title-separator__line"></div>
      </div>
    </div>
  );
}

export default TitleSeparator;
