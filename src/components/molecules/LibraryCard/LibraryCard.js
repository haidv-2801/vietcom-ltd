import PropTypes from 'prop-types';
import React from 'react';
import { buildClass } from '../../../constants/commonFunction';
import './libraryCard.scss';

LibraryCard.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  src: PropTypes.string,
  label: PropTypes.any,
};

LibraryCard.defaultProps = {
  id: '',
  className: '',
  style: {},
  src: '',
  label: 'Audio:',
};

function LibraryCard(props) {
  const { id, style, className, src, label } = props;

  return (
    <div
      id={id}
      style={style}
      className={buildClass(['toe-library-card', className])}
    ></div>
  );
}

export default LibraryCard;
