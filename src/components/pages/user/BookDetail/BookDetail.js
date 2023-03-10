import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { Skeleton, Tooltip } from 'antd';
import axios from 'axios';
import { isArray } from 'lodash';
import moment from 'moment';
import { ConfirmPopup } from 'primereact/confirmpopup';
import { Toast } from 'primereact/toast';
import PropTypes from 'prop-types';
import { useContext, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { format } from 'react-string-format';
import baseApi from '../../../../api/baseApi';
import { getUserID, validateMember } from '../../../../constants/commonAuth';
import {
  BUTTON_SHAPE,
  BUTTON_THEME,
  BUTTON_TYPE,
  CARD_STATUS,
  LOCAL_STORATE_KEY,
  PATH_NAME,
  REQUIRED_FILEDS_BORROWING_BOOK,
  TEXT_FALL_BACK,
} from '../../../../constants/commonConstant';
import {
  buildClass,
  ParseJson,
  requireRegisterView,
} from '../../../../constants/commonFunction';
import END_POINT from '../../../../constants/endpoint';
import { AuthContext, setLocalStorage } from '../../../../contexts/authContext';
import { CartContext } from '../../../../contexts/cartContext';
import { appAction } from '../../../../redux/slices/appSlice';
import Button from '../../../atomics/base/Button/Button';
import Message from '../../../atomics/base/Message/Message';
import Modal from '../../../atomics/base/ModalV2/Modal';
import SmartText from '../../../atomics/base/SmartText/SmartText';
import Book from '../../../molecules/Book/Book';
import PhuocngPdf from '../../../molecules/PhuocngPdf/PhuocngPdf';
import Footer from '../../../sections/User/Footer/Footer';
import Layout from '../../../sections/User/Layout/Layout';
import { getBookFormat, getBookType } from '../function';
import './bookDetail.scss';

BookDetail.propTypes = {
  titlePage: PropTypes.string,
  isPrivate: PropTypes.bool,
};

BookDetail.defaultProps = {
  titlePage: '',
  isPrivate: false,
};

function BookDetail(props) {
  const { children, titlePage, isPrivate } = props;
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cancelRequestRef = useRef();
  const toast = useRef(null);

  const context = useContext(AuthContext);
  const cartContext = useContext(CartContext);
  const [dataDetail, setDataDetail] = useState({});
  const [isShowPreview, setIsShowPreview] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [visible, setVisible] = useState(false);
  const { pathname, search } = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [bookBlob, setBookBlob] = useState(null);
  const [errorLoadPdf, setErrorLoadPdf] = useState(false);
  const [hasCardMember, setHasCardMember] = useState(false);

  useEffect(() => {
    getDetailBook(params?.id);

    validateMember()
      .then((res) => {
        setHasCardMember(res?.cardStatus == CARD_STATUS.CONFIRMED);
        setLocalStorage(LOCAL_STORATE_KEY.MEMBER_INFO, JSON.stringify(res));
      })
      .catch((err) => {
        setHasCardMember(false);
      });

    return () => {
      if (cancelRequestRef.current?.Cancel) {
        cancelRequestRef.current?.Cancel();
      }
    };
  }, [params?.id]);

  const getDetailBook = (id) => {
    cancelRequestRef.current = axios.CancelToken.source();
    baseApi.get(
      (res) => {
        setDataDetail(res);
        if (!res.available) {
          setErrorMessage('T??i li???u t???m th???i kh??ng c?? s???n');
        }
      },
      (err) => {},
      () => {},
      format(END_POINT.TOE_GET_BOOK_BY_ID, id),
      null,
      { cancelToken: cancelRequestRef.current?.token }
    );
  };

  const bookItem = () => {
    let authors = ParseJson(dataDetail.author);
    if (isArray(authors))
      authors = authors?.map((item) => <div className="tag">{item}</div>);
    return (
      <div className="toe-book-detail-page__item">
        <div>
          <Book
            className="toe-book-detail-page__book"
            bookTitle={dataDetail?.bookName}
            bookAuthor={dataDetail?.author}
            bookType={dataDetail?.bookFormat}
            onClick={() => {}}
            image={dataDetail?.image}
          />
          {dataDetail.file ? (
            <Tooltip title="?????c t??i li???u">
              <div style={{ width: 'fit-content' }}>
                <Button
                  className="button-preview"
                  theme={BUTTON_THEME.THEME_4}
                  type={BUTTON_TYPE.LEFT_ICON}
                  leftIcon={
                    isShowPreview ? <EyeInvisibleOutlined /> : <EyeOutlined />
                  }
                  shape={BUTTON_SHAPE.NORMAL}
                  name={'?????c t??i li???u'}
                  onClick={handlePreview}
                />
              </div>
            </Tooltip>
          ) : (
            'B???n xem tr?????c ch??a ???????c t???i l??n.'
          )}
        </div>
        <div className="toe-book-detail-page__item-info__group">
          <h2
            onClick={() => {}}
            className="toe-book-detail-page__item-info__row toe-font-label book-name"
          >
            <SmartText innnerClassName="toe-font-large-title" rows={3}>
              {dataDetail?.bookName}
            </SmartText>
          </h2>
          <div className="toe-book-detail-page__item-info">
            <div className="toe-book-detail-page__item-info__block">
              <div className="toe-book-detail-page__item-info__row title toe-font-label">
                M?? t???
              </div>
              <div className="toe-book-detail-page__item-info__row">
                {dataDetail?.description ?? TEXT_FALL_BACK.TYPE_1}
              </div>
            </div>
          </div>
          <div className="toe-book-detail-page__item-info">
            <div className="toe-book-detail-page__item-info__block">
              <div className="toe-book-detail-page__item-info__row title toe-font-label">
                D??? li???u bi??n m???c
              </div>
              <div className="toe-book-detail-page__item-info__row">
                <span className="toe-font-label">Lo???i t??i li???u:</span>{' '}
                <span className="toe-font-body">
                  {getBookFormat(dataDetail?.bookType)}
                </span>
              </div>
              <div className="toe-book-detail-page__item-info__row">
                <span className="toe-font-label">?????nh d???ng t??i li???u:</span>{' '}
                <span className="toe-font-body">
                  {getBookType(dataDetail?.bookFormat)}
                </span>
              </div>
              <div
                className="toe-book-detail-page__item-info__row"
                style={{ display: 'flex' }}
              >
                <span className="toe-font-label">T??c gi???:</span>
                <span className="toe-font-body infomation-col__title-row__tags">
                  {authors || TEXT_FALL_BACK.TYPE_1}
                </span>
              </div>
              <div className="toe-book-detail-page__item-info__row">
                <span className="toe-font-label">Nh?? xu???t b???n:</span>
                <span className="toe-font-body">
                  {dataDetail?.publisher || TEXT_FALL_BACK.TYPE_1}
                </span>
              </div>
              <div className="toe-book-detail-page__item-info__row">
                <span className="toe-font-label">N??m xu???t b???n:</span>
                <span className="toe-font-body">
                  {dataDetail?.publicationDate
                    ? moment(dataDetail?.publicationDate).format('YYYY')
                    : TEXT_FALL_BACK.TYPE_1}
                </span>
              </div>
            </div>
          </div>
          <div className="toe-book-detail-page__item-info">
            {!dataDetail?.isPrivate ? (
              <div className="toe-book-detail-page__item-info__block">
                <div className="toe-book-detail-page__item-info__row title toe-font-label">
                  D??? li???u x???p gi??
                </div>
                <div className="toe-book-detail-page__item-info__row">
                  <span className="toe-font-label">T???ng s??? b???n:</span>{' '}
                  <span className="toe-font-body">
                    {dataDetail?.amount ?? TEXT_FALL_BACK.TYPE_1}
                  </span>
                </div>
                <div className="toe-book-detail-page__item-info__row">
                  <span className="toe-font-label">S??? b???n ch??a m?????n:</span>{' '}
                  <span className="toe-font-body">
                    {dataDetail?.available ?? TEXT_FALL_BACK.TYPE_1}
                  </span>
                </div>
                <div className="toe-book-detail-page__item-info__row">
                  <span className="toe-font-label">S??? b???n ???????c gi??? ch???:</span>{' '}
                  <span className="toe-font-body">
                    {dataDetail?.reserved ?? TEXT_FALL_BACK.TYPE_1}
                  </span>
                </div>
                <div className="toe-book-detail-page__item-info__row">
                  <span className="toe-font-label">Th??ng tin x???p gi??:</span>
                  <span className="toe-font-body">
                    {dataDetail?.placement ?? TEXT_FALL_BACK.TYPE_1}
                  </span>
                </div>
              </div>
            ) : null}
          </div>

          <div className="toe-book-detail-page__item-info">
            <div className="toe-book-detail-page__item-info__block">
              <div className="toe-book-detail-page__item-info__row title toe-font-label">
                C??c m???c t??? truy c???p
              </div>
              <div className="toe-book-detail-page__item-info__row">
                <span className="toe-font-label">T??? kh??a:</span>{' '}
                <span className="infomation-col__title-row infomation-col__title-row__tags toe-font-body">
                  {dataDetail?.bookName
                    ?.split(' ')
                    .filter(Boolean)
                    .map((item, _) => (
                      <div className="tag" key={_}>
                        {item}
                      </div>
                    ))}
                </span>
              </div>
            </div>
          </div>
          {!dataDetail?.isPrivate ? (
            <>
              <div className="toe-book-detail-page__item-info">
                <div className="toe-book-detail-page__item-info__block">
                  <div className="toe-book-detail-page__item-info__row title toe-font-label">
                    Thao t??c
                  </div>
                  {!hasCardMember ? (
                    requireRegisterView(navigate)
                  ) : (
                    <div className="toe-book-detail-page__item-info__row">
                      <a
                        id="js-button-add-to-cart"
                        className={buildClass([
                          bookNotAvailable() && 'disable',
                        ])}
                        onClick={handleBorrowing}
                      >
                        ?????t m?????n
                      </a>
                      {/* <span className="toe-font-hint">
                        (Y??u c???u c?? hi???u l???c 2 ng??y t??? khi ?????t m?????n)
                      </span> */}
                    </div>
                  )}
                </div>
              </div>
              <div className="toe-book-detail-page__item-info warning">
                {errorMessage ? <Message title={errorMessage} /> : null}
              </div>
            </>
          ) : null}
        </div>
      </div>
    );
  };

  const renderReport = (title) => {
    return (
      <div className="toe-book-detail-page__body-section">
        <div className="toe-book-detail-page__body-type toe-font-title">
          {title}
        </div>
      </div>
    );
  };

  const handleBorrowing = () => {
    if (!context.isLoggedIn) {
      navigate(PATH_NAME.LOGIN);
      dispatch(appAction.changeHistory([pathname + search]));
    } else {
      const userID = getUserID();
      getUserByID(userID)
        .then((res) => {
          //Xem user hi???n t???i ???? ????? th??ng tin ch??a
          const requireFields = Object.values(REQUIRED_FILEDS_BORROWING_BOOK);
          const isEnough = requireFields.every(
            (item) => res[item.en] && res[item.en]?.trim() != ''
          );
          if (isEnough) {
            handleAddToCard(dataDetail);
          } else {
            let err =
                'Vui l??ng {0} ?????y ????? th??ng tin {1} ????? c?? th??? ti???p th???c thao t??c.',
              lostField = requireFields
                .filter((item) => !res[item.en] || res[item.en]?.trim() === '')
                .map((item) => item.vi);

            setErrorMessage(
              format(
                err,
                <span
                  onClick={() => {
                    navigate(PATH_NAME.USER);
                  }}
                  className="text-underline"
                >
                  c???p nh???t
                </span>,
                <b style={{ color: '' }}>{lostField.join(', ')}</b>
              )
            );
          }
        })
        .catch((err) => {
          toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: 'C?? l???i x???y ra',
            life: 3000,
          });
        });
    }
  };

  const handleAddToCard = (dataDetail) => {
    delete dataDetail?.author;
    const success = cartContext.add({
      id: dataDetail?.bookID,
      quantity: 1,
      ...dataDetail,
    });
    if (success) {
      setVisible(true);
      toast.current.show({
        severity: 'success',
        summary: 'Th??nh c??ng',
        detail: 'Th??m s??ch th??nh c??ng',
        life: 3000,
      });
    }
  };

  const getUserByID = (id) => {
    return baseApi.get(
      null,
      null,
      null,
      format(END_POINT.TOE_GET_USER_BY_ID, id),
      null,
      null
    );
  };

  const bookNotAvailable = () => {
    return (
      !dataDetail?.available || dataDetail?.amount === dataDetail?.reserved
    );
  };

  const handlePreview = () => {
    setIsShowPreview(true);
    setErrorLoadPdf(!dataDetail.file);
  };

  const acceptGoToCart = () => {
    navigate(PATH_NAME.USER + '?view=gio-muon');
  };

  const rejectGoToCart = () => {};

  return (
    <Layout>
      <div className="toe-book-detail-page">
        <div className="toe-book-detail-page__body-wrapper">
          <div className="toe-book-detail-page__body">
            <div className="toe-book-detail-page__body-main">
              <div className="toe-book-detail-page__body-main__left toe-font-body">
                <div className="__row">{bookItem()}</div>

                {isShowPreview ? (
                  <Modal
                    maximizable={true}
                    onClose={() => setIsShowPreview(false)}
                    title={dataDetail.bookName}
                    className="modal-pdf-reader"
                    show
                  >
                    {isLoading ? (
                      <>
                        <Skeleton></Skeleton>
                        <Skeleton></Skeleton>
                        <Skeleton></Skeleton>
                        <Skeleton></Skeleton>
                      </>
                    ) : errorLoadPdf ? (
                      'L???i load file'
                    ) : (
                      <PhuocngPdf
                        renderError={<div>L???i kh??ng t???i ???????c file</div>}
                        url={dataDetail.file}
                      />
                    )}
                  </Modal>
                ) : null}
              </div>
              <div className="toe-book-detail-page__body-main__right toe-font-body">
                {renderReport('T??i nguy??n kh??c')}
                <div className="__other-resource">Z39.50</div>
                <div className="__other-resource">OAI/PMH</div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
        <Toast ref={toast}></Toast>
        <ConfirmPopup
          className="toe-font-body"
          target={document.getElementById('js-button-add-to-cart')}
          visible={visible}
          onHide={() => setVisible(false)}
          message="B???n c?? mu???n ??i ?????n Gi??? m?????n?"
          icon="pi pi-shopping-cart"
          acceptLabel="?????ng ??"
          rejectLabel="H???y"
          acceptClassName="btn-accept-go-cart"
          rejectClassName="btn-accept-go-cart"
          accept={acceptGoToCart}
          reject={rejectGoToCart}
        />
      </div>
    </Layout>
  );
}

export default BookDetail;
