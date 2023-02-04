import { BookOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import { BOOK_FORMAT, TEXT_FALL_BACK } from '../../../constants/commonConstant';
import {
  buildClass,
  isValidHttpUrl,
  ParseJson,
} from '../../../constants/commonFunction';
import SmartText from '../../atomics/base/SmartText/SmartText';
import { getBookType } from '../../pages/user/function';
import './book.scss';

Book.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  bookType: PropTypes.number,
  bookTitle: PropTypes.string,
  bookAuthor: PropTypes.string,
  onClick: PropTypes.func,
  hasBottomTitle: PropTypes.bool,
  image: PropTypes.string,
};

Book.defaultProps = {
  id: '',
  className: '',
  style: {},
  bookType: '',
  bookTitle: '',
  bookAuthor: '',
  onClick: () => {},
  hasBottomTitle: true,
  image: '',
};

function Book(props) {
  const {
    id,
    style,
    bookType,
    bookTitle,
    bookAuthor,
    className,
    onClick,
    hasBottomTitles,
    image,
  } = props;

  const BG_COLOR = [
    '#E4CA99',
    '#A3A6A3',
    '#717D84',
    '#129A7D',
    '#563C2D',
    '#D4B68E',
    '#934A32',
    '#934A32',
    '#934A32',
  ];

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  const getBookAuthor = (single = false) => {
    let authors = ParseJson(bookAuthor);
    if (!authors) return TEXT_FALL_BACK.TYPE_1;
    if (single) return authors[0];
    else return authors;
  };

  return (
    <div
      id={id}
      style={style}
      className={buildClass(['toe-book', 'toe-font-body', className])}
      onClick={onClick}
    >
      <Tooltip title={getBookType(bookType)}>
        <div className="toe-book__type">
          <BookOutlined />
        </div>
      </Tooltip>
      {isValidHttpUrl(image) ? (
        <Tooltip title={bookTitle}>
          <img className="toe-book__title" src={image} />
        </Tooltip>
      ) : (
        <div
          style={{
            backgroundColor: BG_COLOR[getRandomInt(BG_COLOR.length)],
          }}
          className="toe-book__title"
        >
          <SmartText innerStyle={{ color: '#fff' }} rows={5}>
            {bookTitle}
          </SmartText>
        </div>
      )}

      <div className="toe-book__author">{getBookAuthor(true)}</div>
      {hasBottomTitles && (
        <div className="toe-book__bottom-title">
          <SmartText rows={2}>{bookTitle || TEXT_FALL_BACK.TYPE_1}</SmartText>
        </div>
      )}
    </div>
  );
}

export default Book;
