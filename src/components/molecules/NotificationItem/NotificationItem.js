import moment from 'moment';
import { Skeleton } from 'primereact/skeleton';
import PropTypes from 'prop-types';
import { DATE_FORMAT } from '../../../constants/commonConstant';
import { buildClass } from '../../../constants/commonFunction';
import SmartText from '../../atomics/base/SmartText/SmartText';
import './notificationItem.scss';

NotificationItem.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  onClick: PropTypes.func,
  imgSrc: PropTypes.any,
  title: PropTypes.any,
  description: PropTypes.any,
  date: PropTypes.any,
  isLoading: PropTypes.bool,
  viewCount: PropTypes.number,
};

NotificationItem.defaultProps = {
  id: '',
  className: '',
  style: {},
  onClick: () => {},
  imgSrc: null,
  title: null,
  description: null,
  width: '20em',
  isLoading: false,
  date: null,
  viewCount: 0,
};

function NotificationItem(props) {
  const {
    id,
    style,
    className,
    onClick,
    imgSrc,
    title,
    description,
    date,
    isLoading,
    viewCount,
  } = props;

  return (
    <div
      id={id}
      style={style}
      className={buildClass(['toe-notification-item toe-font-body', className])}
    >
      <div className="toe-notification-item__image" onClick={onClick}>
        {isLoading ? (
          <Skeleton height="100%"></Skeleton>
        ) : (
          <img src={imgSrc} alt={props.slug ?? 'image'} />
        )}
      </div>
      {isLoading ? (
        <div className="toe-notification-item__info">
          <div className="toe-notification-item__title">
            <Skeleton width="40rem" height="2rem"></Skeleton>
          </div>
          <div className="toe-notification-item__date toe-font-hint">
            <Skeleton width="30rem" height="1rem"></Skeleton>
          </div>
          <div className="toe-notification-item__desc">
            <Skeleton width="40rem" height="1rem"></Skeleton>
          </div>
        </div>
      ) : (
        <div className="toe-notification-item__info">
          <div className="toe-notification-item__title" onClick={onClick}>
            <SmartText>{title}</SmartText>
          </div>
          <div className="toe-notification-item__date toe-font-hint">
            Ngày tạo: {moment(date).format(DATE_FORMAT.TYPE_1)} - Lượt xem:{' '}
            {viewCount}
          </div>
          <div className="toe-notification-item__desc">
            <SmartText rows={2}>{description}</SmartText>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationItem;
