import { Card } from 'primereact/card';
import { Image } from 'primereact/image';
import { Skeleton } from 'primereact/skeleton';
import PropTypes from 'prop-types';
import React from 'react';
import { buildClass } from '../../../constants/commonFunction';
import SmartText from '../../atomics/base/SmartText/SmartText';
import './card.scss';

CardItem.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  onClick: PropTypes.func,
  imgSrc: PropTypes.any,
  title: PropTypes.any,
  subTitle: PropTypes.any,
  footer: PropTypes.any,
  description: PropTypes.any,
  isLoading: PropTypes.bool,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

CardItem.defaultProps = {
  id: '',
  className: '',
  style: {},
  onClick: () => {},
  imgSrc: null,
  title: null,
  subTitle: null,
  subTitle: null,
  footer: null,
  description: null,
  width: '20em',
  isLoading: false,
};

function CardItem(props) {
  const {
    id,
    style,
    className,
    onClick,
    imgSrc,
    title,
    subTitle,
    footer,
    description,
    isLoading,
    width,
  } = props;

  const header = () => {
    return (
      <div className="toe-card-img" onClick={onClick}>
        <Image src={imgSrc} alt="Image" />
      </div>
    );
  };

  return (
    <div
      id={id}
      style={style}
      className={buildClass(['toe-card toe-font-body', className])}
    >
      {isLoading ? (
        <div className="custom-skeleton p-4">
          <Skeleton className="mb-3" width="100%" height="150px"></Skeleton>
          <div className="flex">
            <Skeleton shape="circle" size="4rem" className="mr-2"></Skeleton>
            <div>
              <Skeleton width="14rem" className="mb-2"></Skeleton>
              <Skeleton width="10rem" className="mb-2"></Skeleton>
              <Skeleton height=".5rem" className="mb-1"></Skeleton>
            </div>
          </div>
        </div>
      ) : (
        <Card
          title={
            <div className="toe-font-large-title" onClick={onClick}>
              {title}
            </div>
          }
          subTitle={<div className="toe-font-body">{subTitle}</div>}
          footer={footer}
          header={header()}
        >
          <p className="m-0" style={{ lineHeight: '1.5' }}>
            <div className="toe-font-body">{description}</div>
          </p>
        </Card>
      )}
    </div>
  );
}

export default CardItem;
