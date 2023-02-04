import {
  ExportOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Tag, Tooltip } from 'antd';
import FileSaver from 'file-saver';
import { isArray, isEmpty } from 'lodash';
import moment from 'moment';
import { Chip } from 'primereact/chip';
import { Skeleton } from 'primereact/skeleton';
import { Toast } from 'primereact/toast';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { CSVLink } from 'react-csv';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { format } from 'react-string-format';
import baseApi from '../../../../api/baseApi';
import { uploadFiles } from '../../../../api/firebase';
import Modal from '../../../atomics/base/ModalV2/Modal';
import TextAreaBase from '../../../atomics/base/TextArea/TextArea';
import { getUserName } from '../../../../constants/commonAuth';
import {
  BOOK_FORMAT,
  BUTTON_THEME,
  BUTTON_TYPE,
  COLUMN_NOT_EXPORT,
  DATE_FORMAT,
  FILTER_TIME_VALUE,
  LOCAL_STORATE_KEY,
  MAXIMUM_PAGESIZE,
  OPERATOR,
  RESERVATION_STATUS,
  SORT_TYPE,
} from '../../../../constants/commonConstant';
import {
  buildClass,
  commonFilterTime,
  genFileNameWithTime,
  getOrderStatus,
  listToTree,
  ParseJson,
} from '../../../../constants/commonFunction';
import END_POINT from '../../../../constants/endpoint';
import { setLocalStorage } from '../../../../contexts/authContext';
import Button from '../../../atomics/base/Button/Button';
import DatePicker from '../../../atomics/base/DatePicker/DatePicker';
import Input from '../../../atomics/base/Input/Input';
import PopupSelection from '../../../atomics/base/PopupSelectionV1/PopupSelection';
import SideBar from '../../../atomics/base/SideBar/SideBar';
import SmartText from '../../../atomics/base/SmartText/SmartText';
import Dropdown from '../../../molecules/Dropdown/Dropdown';
import Paginator from '../../../molecules/Paginator/Paginator';
import Table from '../../../molecules/Table/Table';
import Layout from '../../../sections/Admin/Layout/Layout';
import './dashBoardPage.scss';
import ToastConfirmDelete from '../../../molecules/ToastConfirmDelete/ToastConfirmDelete';
import ScoreCard from '../../../molecules/ScoreCard/ScoreCard';
import { ImBook } from 'react-icons/im';
import { FaUserFriends, FaReceipt, FaNewspaper } from 'react-icons/fa';
import MostBorrowedBookChart from './Control/MostBorrowedBookChart/MostBorrowedBookChart';

DashBoardPage.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
};

DashBoardPage.defaultProps = {
  id: '',
  className: '',
  style: {},
};

function DashBoardPage(props) {
  const { id, style, className } = props;

  const navigate = useNavigate();

  //#region state
  const [isLoading, setIsLoading] = useState(false);
  const [dataScoreCard, setDataScoreCard] = useState({});
  const [topBookBorrowed, setTopBookBorrowed] = useState([]);
  //#endregion

  useEffect(() => {
    callApiGetDataScoreCard();
    getTopBookBorrowed();
  }, []);

  //#region
  const callApiGetDataScoreCard = () => {
    baseApi.get(
      (res) => {
        setDataScoreCard({
          totalBooks: res.totalBooks,
          totalBookOrdereds: res.totalBookOrdereds,
          totalLibraryCards: res.totalLibraryCards,
        });
        setIsLoading(false);
      },
      (err) => {
        setIsLoading(false);
      },
      () => {
        setIsLoading(true);
      },
      END_POINT.TOE_SCORE_CARD,
      null,
      null
    );
  };

  const getTopBookBorrowed = () => {
    baseApi.get(
      (res) => {
        setTopBookBorrowed(res);
        setIsLoading(false);
      },
      (err) => {
        setIsLoading(false);
      },
      () => {
        setIsLoading(true);
      },
      END_POINT.TOE_BOOK_BORROWED,
      null,
      null
    );
  };

  const renderNoData = () => {
    return (
      <img
        width={200}
        src={require('../../../../assets/images/nodata/nodata-chart.jpg')}
        alt="nodata"
      />
    );
  };
  //#endregion

  return (
    <Layout title="Tổng quan">
      <div className="toe-dashboard-page">
        <div className="toe-dashboard-page__section score-card">
          <ScoreCard
            backgroundColor="#EF4444"
            icon={<ImBook size={40} fill="#fff" />}
            label={'Tổng số sách'}
            value={dataScoreCard?.totalBooks ?? 0}
            isLoading={isLoading}
          />
          <ScoreCard
            backgroundColor="#7C3AED"
            icon={<FaReceipt size={40} fill="#fff" />}
            label={'Tổng số sách mượn'}
            value={dataScoreCard?.totalBookOrdereds ?? 0}
            isLoading={isLoading}
          />
          <ScoreCard
            backgroundColor="#F59E0B"
            icon={<FaNewspaper size={40} fill="#fff" />}
            label={'Bài đăng mới hôm nay'}
            value={dataScoreCard?.totalBookOrdereds ?? 0}
            isLoading={isLoading}
          />
          <ScoreCard
            icon={<FaUserFriends size={40} fill="#fff" />}
            backgroundColor="#10B981"
            label={'Tổng số thành viên'}
            value={dataScoreCard?.totalLibraryCards ?? 0}
            isLoading={isLoading}
          />
        </div>
        <div className="toe-dashboard-page__section chart">
          <div className="top-most-borrowed-book">
            <div className="top-most-borrowed-book__title toe-font-title">
              Sách mượn nhiều
            </div>
            <div className="top-most-borrowed-book__chart">
              {!topBookBorrowed.length && !isLoading ? (
                renderNoData()
              ) : (
                <MostBorrowedBookChart
                  data={topBookBorrowed.map((item) => ({
                    label: item.bookCode,
                    value: item.quantity,
                    name: item.bookName,
                  }))}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default DashBoardPage;

// <div className="top-most-borrowed-book">
// {' '}
// <div className="top-most-borrowed-book__title toe-font-title">
//   Tình trạng mượn trả
// </div>
// <div className="top-most-borrowed-book__chart">
//   {!topBookBorrowed.length && !isLoading ? (
//     renderNoData()
//   ) : (
//     <MostBorrowedBookChart
//       data={topBookBorrowed.map((item) => ({
//         label: item.bookCode,
//         value: item.quantity,
//         name: item.bookName,
//       }))}
//     />
//   )}
// </div>
// </div>
