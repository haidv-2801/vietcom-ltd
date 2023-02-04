import PropTypes from 'prop-types';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DATE_FORMAT,
  DAYS_OF_WEEK,
  PATH_NAME,
  UTC_INTRODUCE_VIDEO,
} from '../../../constants/commonConstant';
import { buildClass } from '../../../constants/commonFunction';
import moment from 'moment';
import './hotNews.scss';

HotNews.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  onClick: PropTypes.func,
  data: PropTypes.array,
};

HotNews.defaultProps = {
  id: '',
  className: '',
  style: {},
  onClick: () => {},
  data: [],
};

function HotNews(props) {
  const { id, style, className, onClick, data } = props;
  const navigate = useNavigate();

  const handleSeeDetailNew = (item) => {
    navigate(PATH_NAME.NEWS + `/${item.slug}/${item.postID}`);
  };

  const renderCommonItems = () => {
    return data.map((item, _) => (
      <div
        onClick={() => handleSeeDetailNew(item)}
        key={_}
        className="toe-hot-news__section-content"
      >
        <div className="toe-hot-news__section-content__img">
          <img src={item.image} alt={item.slug} />
        </div>
        <div className="toe-hot-news__section-content__info">
          <div className="toe-hot-news__section-content__desc">
            {item.title}
          </div>
          <div className="toe-hot-news__section-content__date">
            {DAYS_OF_WEEK[new Date(item.createdDate).getDay()]},
            {moment(item.createdDate).format(DATE_FORMAT.TYPE_2)}
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div
      id={id}
      style={style}
      className={buildClass(['toe-hot-news toe-font-body', className])}
    >
      <div className="toe-hot-news__section">
        <h2 className="toe-hot-news__section-title toe-font-large-title">
          Tin tiêu điểm
        </h2>
        {renderCommonItems()}
      </div>
      <div className="toe-hot-news__section">
        <h2 className="toe-hot-news__section-title toe-font-large-title">
          Giới thiệu thư viện
        </h2>
        <div className="toe-hot-news__section-content__ytb">
          <iframe
            src={UTC_INTRODUCE_VIDEO}
            allowFullScreen="allowfullscreen"
            mozallowfullscreen="mozallowfullscreen"
            msallowfullscreen="msallowfullscreen"
            oallowfullscreen="oallowfullscreen"
            webkitallowfullscreen="webkitallowfullscreen"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

export default HotNews;
