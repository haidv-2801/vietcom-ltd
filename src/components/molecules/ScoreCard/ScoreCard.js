import PropTypes from 'prop-types';
import React from 'react';
import { buildClass } from '../../../constants/commonFunction';
import { Skeleton } from 'primereact/skeleton';
import './scoreCard.scss';

ScoreCard.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  src: PropTypes.string,
  label: PropTypes.any,
  value: PropTypes.any,
  icon: PropTypes.any,
  backgroundColor: PropTypes.string,
  isLoading: PropTypes.bool,
};

ScoreCard.defaultProps = {
  id: '',
  className: '',
  style: {},
  src: '',
  label: null,
  value: null,
  icon: null,
  backgroundColor: null,
  isLoading: false,
};

function ScoreCard(props) {
  const {
    id,
    style,
    className,
    label,
    value,
    icon,
    backgroundColor,
    isLoading,
  } = props;

  return (
    <div
      id={id}
      style={style}
      className={buildClass([
        'toe-score-card',
        className,
        isLoading && 'isloading',
      ])}
    >
      {isLoading ? (
        <>
          <Skeleton borderRadius={0} height={20} width={'100%'} />
          <Skeleton borderRadius={0} height={20} width={'90%'} />
          <Skeleton borderRadius={0} height={20} width={'85%'} />
        </>
      ) : (
        <>
          {' '}
          <div className="toe-score-card__label toe-font-title">
            {icon && (
              <div
                className="toe-score-card__icon"
                style={{ backgroundColor: backgroundColor }}
              >
                {icon}
              </div>
            )}
          </div>
          <div className="toe-score-card__row toe-font-large-title">
            <div className="toe-score-card__label">{label}</div>
            <div className="toe-score-card__value">{value}</div>
          </div>{' '}
        </>
      )}
    </div>
  );
}

export default ScoreCard;
