import PropTypes from 'prop-types';
import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { PATH_NAME } from '../../../constants/commonConstant';
import { buildClass } from '../../../constants/commonFunction';
import CardItem from '../Card/Card';
import ImgMore from '../../../assets/images/news.jpg';
import './cardList.scss';

CardList.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  cards: PropTypes.array,
  isLoading: PropTypes.bool,
};

CardList.defaultProps = {
  id: '',
  className: '',
  style: {},
  cards: [],
  isLoading: false,
};

function CardList(props) {
  const { id, style, className, cards, isLoading } = props;
  const navigate = useNavigate();

  const handleSeeDetail = (item) => {
    navigate(PATH_NAME.NEWS + '/' + item.slug + '/' + item.postID);
  };

  return (
    <div
      id={id}
      style={style}
      className={buildClass(['toe-card-list', className])}
    >
      {cards.length
        ? cards.map((card) => {
            return (
              <CardItem
                key={card.postID}
                title={card?.title}
                subTitle={card?.subTitle}
                imgSrc={card?.image}
                description={card?.description}
                isLoading={isLoading}
                onClick={() => handleSeeDetail(card)}
              />
            );
          })
        : null}

      <CardItem
        className="toe-more-data"
        title={'>>> * Tin tiêu điểm'}
        subTitle={''}
        imgSrc={ImgMore}
        description={''}
        onClick={() => {}}
      />
    </div>
  );
}

export default CardList;
