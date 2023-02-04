import PropTypes from 'prop-types';
import React from 'react';
import { buildClass } from '../../../constants/commonFunction';
import { useNavigate } from 'react-router-dom';
import NotificationItem from '../NotificationItem/NotificationItem';
import './notificationList.scss';
import { PATH_NAME } from '../../../constants/commonConstant';

NotificationList.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  data: PropTypes.array,
  isLoading: PropTypes.bool,
};

NotificationList.defaultProps = {
  id: '',
  className: '',
  style: {},
  data: [],
  isLoading: false,
};

function NotificationList(props) {
  const { id, style, className, data, isLoading } = props;

  const navigate = useNavigate();

  const handleSeeDetail = (noti) => {
    navigate(PATH_NAME.NOTIFICATION + '/' + noti.slug + '/' + noti.postID);
  };

  return (
    <div
      id={id}
      style={style}
      className={buildClass(['toe-notification-list toe-font-body', className])}
    >
      {data.length
        ? data.map((noti) => {
            return (
              <React.Fragment key={noti?.postID}>
                <NotificationItem
                  title={noti?.title}
                  date={noti?.createdDate}
                  description={noti?.description}
                  isLoading={isLoading}
                  imgSrc={noti.image}
                  slug={noti.slug}
                  viewCount={noti.viewCount}
                  onClick={() => handleSeeDetail(noti)}
                />
              </React.Fragment>
            );
          })
        : null}
    </div>
  );
}

export default NotificationList;
