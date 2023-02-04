import { BellOutlined, SearchOutlined } from '@ant-design/icons';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import baseApi from '../../../../api/baseApi';
import {
  BUTTON_THEME,
  BUTTON_TYPE,
  FIXED_MENU_ID,
  MAXIMUM_PAGESIZE,
  OPERATOR,
  PATH_NAME,
} from '../../../../constants/commonConstant';
import END_POINT from '../../../../constants/endpoint';
import { filterAction } from '../../../../redux/slices/filterSlice';
import Button from '../../../atomics/base/Button/Button';
import Loading from '../../../atomics/base/Loading/Loading';
import SideBar from '../../../atomics/base/SideBar/SideBar';
import TitleSeparator from '../../../atomics/base/TitleSeparator/TitleSeparator';
import CardItem from '../../../molecules/Card/Card';
import CardList from '../../../molecules/CardList/CardList';
import DynamicMenu from '../../../molecules/DynamicMenu/DynamicMenu';
import FilterEngine from '../../../molecules/FilterEngine/FilterEngine';
import NotificationList from '../../../molecules/NotificationList/NotificationList';
import Footer from '../../../sections/User/FooterLib/Footer';
import Layout from '../../../sections/User/Layout/Layout';
import './homePage.scss';

let FAKE = [
  {
    id: 'c0d5e47b-b4c0-4f8d-9400-1e08b149c6d9',
    title: 'Mrs',
    subTitle: "Devil's Diary",
    description: 'NDLTD – Mạng thư viện số luận văn, luận án quốc tếNDLTD ',
    imgSrc: 'https://lic.haui.edu.vn/media/79/t79761.jpg',
  },
  {
    id: '5fcf6022-68ed-4af0-a490-9377945df748',
    title: 'Rev',
    subTitle: 'Godzilla: Final Wars (Gojira: Fainaru uÃ´zu)',
    description: 'OpenDOAR - Danh mục các nguồn tin truy cập mởOpenDOAR',
    imgSrc: 'https://lic.haui.edu.vn/media/79/t79747.jpg',
  },
  {
    id: '3b9b8540-b690-4ef8-aabd-a6e869d0313a',
    title: 'Honorable',
    subTitle: 'French Roast',
    description:
      'Trung tâm Thông tin - Thư viện tổ chức tập huấn công tác xây dựng Bộ sưu tập theo ngành đào tạo',
    imgSrc: 'https://lic.haui.edu.vn/media/78/m78555.jpg',
  },
  {
    id: '094c64e8-a214-457e-aee2-d4e2b4f9962a',
    title: 'Ms',
    subTitle: 'Green Dolphin Street',
    description: 'National Institute of Technology, Trichy',
    imgSrc: 'http://dummyimage.com/249x100.png/dddddd/000000',
  },
  {
    id: '094c64e8-a214-457e-aee2-d4e2b4f99887',
    title: 'Ms',
    subTitle: 'Green Dolphin Street',
    description: 'National Institute of Technology, Trichy',
    imgSrc: 'http://dummyimage.com/249x100.png/dddddd/000000',
  },
];

let FAKE_1 = [
  {
    id: '76e27cc3-6b63-4561-add5-0691a9ff71eb',
    title: 'Financial Advisor',
    date: '2022-01-23 19:02:24',
    description:
      '6516242544963693847057350325418647114783488064203485078535349127282818593615535604209261248806895364622077950302198964033506468234514776315872815841165860258289341',
  },
  {
    id: '66852abe-09a8-4a15-9a1b-ac92d144dfeb',
    title: 'Environmental Tech',
    date: '2021-08-05 06:43:12',
    description:
      '2179183981625722754802305327089035137875331597755925718510147002471177114940767714858458284596610738906241787498672485496568720095458837899912424734558300962211935',
  },
  {
    id: '82a8368c-6dc6-4930-813b-2900b688a252',
    title: 'Human Resources Manager',
    date: '2021-10-26 13:33:49',
    description:
      '9651245772556704569141732767693193920664399082559714645204551162717580218510718308823288164248479179081510112505301002713228993179149947206232989671502566201547214',
  },
  {
    id: '68f3e434-d0f4-4111-bb52-4969bf8e8fec',
    title: 'Technical Writer',
    date: '2021-11-13 16:18:12',
    description:
      '3931297960674866260125900525631983838624381053475553580213736913953696746423452156625636450252375638011106829261176616888575083038025871408758750637393616703537843',
  },
];

HomePage.propTypes = {};

HomePage.defaultProps = {};

function HomePage(props) {
  const MIN_PAGE_SIZE = 20;

  const filterTypeOptions = [
    {
      label: 'Tất cả',
      value: 0,
    },
    {
      label: 'Nhan đề',
      value: 1,
    },
    {
      label: 'Tác giả',
      value: 2,
    },
  ];

  const responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 4,
      numScroll: 4,
    },
    {
      breakpoint: '600px',
      numVisible: 2,
      numScroll: 2,
    },
    {
      breakpoint: '480px',
      numVisible: 1,
      numScroll: 1,
    },
  ];

  const refreshFilterKey = useRef(0);

  const navigate = useNavigate();
  const selector = useSelector(
    (rootState) => rootState.filter.homePageFilterEnige
  );
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [showFilterEngine, setShowFilterEngine] = useState(false);
  const [defaultFilterType, setDefaultFilterType] = useState(0);
  const [commonSearchValue, setCommonSearchValue] = useState('');
  const [filterValue, setFilterValue] = useState({ controls: [], filter: [] });
  const [totalRecords, setTotalRecords] = useState(0);
  const [dataTable, setDataTable] = useState([]);
  const [dataPostsNews, setDataPostsNews] = useState([]);
  const [dataPostsNoti, setDataPostsNoti] = useState([]);
  const [dataPostNewBooks, setDataPostNewBooks] = useState([]);

  useEffect(() => {
    getPostsByMenuID();
  }, []);

  const getPostsByMenuID = (menuID) => {
    baseApi.post(
      (res) => {
        let _data = res.data.pageData.sort((a, b) => {
          const time = (date) => new Date(date).getTime();
          if (time(b?.modifiedDate) - time(a?.modifiedDate) === 0) {
            return time(b?.createdDate) - time(a?.createdDate);
          } else {
            return time(b?.modifiedDate) - time(a?.modifiedDate);
          }
        });

        _data = _data.map((post) => ({
          ...post,
          key: post.postID,
          title: post.title,
          description: post.description,
          date: post.createdDate,
        }));

        setTotalRecords(res.data.totalRecord);

        setDataPostsNews(
          _data.filter((item) => item.menuID === FIXED_MENU_ID.NEWS).slice(0, 3)
        );

        setDataPostsNoti(
          _data
            .filter((item) => item.menuID === FIXED_MENU_ID.NOTIFICATION)
            .slice(0, 3)
        );

        setDataPostNewBooks(
          _data
            .filter(
              (item) => item.menuID === FIXED_MENU_ID.NEW_BOOKS_INTRODUCTION
            )
            .slice(0, 3)
        );

        setIsLoading(false);
      },
      (err) => {
        setIsLoading(false);
      },
      () => {
        setIsLoading(true);
      },
      END_POINT.TOE_GET_POSTS_FILTER,
      {
        filter: btoa(
          JSON.stringify([
            [
              ['MenuID', OPERATOR.EQUAL, FIXED_MENU_ID.NEWS],
              OPERATOR.OR,
              ['MenuID', OPERATOR.EQUAL, FIXED_MENU_ID.NOTIFICATION],
              OPERATOR.OR,
              ['MenuID', OPERATOR.EQUAL, FIXED_MENU_ID.NEW_BOOKS_INTRODUCTION],
            ],
            'AND',
            ['Status', OPERATOR.EQUAL, '1'],
            'AND',
            ['IsDeleted', OPERATOR.EQUAL, '0'],
          ])
        ),
        pageIndex: 1,
        pageSize: MAXIMUM_PAGESIZE,
      }
    );
  };

  const itemTemplate = (card) => {
    return (
      <CardItem
        key={card.id}
        title={card?.title}
        subTitle={card?.subTitle}
        imgSrc={card?.imgSrc}
        description={card?.description}
        width={'30em'}
        isLoading={isLoading}
      />
    );
  };

  const handleFilter = () => {
    dispatch(
      filterAction.changeHomePageFilterEnige({
        controls: filterValue.controls,
        filter: filterValue.filter,
      })
    );
  };

  const handleSearch = () => {
    navigate(PATH_NAME.SEARCH);
  };

  return (
    <Layout>
      <div className="toe-home-page">
        <div className="toe-home-page__img-banner">
          <h1 className="toe-home-page__img-banner__text">THƯ VIỆN GTVT</h1>
          {/* <img width={'auto'} height={'auto'} src={HomeHeaderImg} alt="" /> */}
        </div>
        {/* <h4 className="toe-home-page__noti-section">
          <TitleSeparator icon={<SearchOutlined />} title={'Tìm kiếm'} />
        </h4> */}
        {/* <div className="toe-home-page__img-banner__search"> */}
        {/* <Dropdown
            options={filterTypeOptions}
            defaultValue={defaultFilterType}
            className="toe-home-page__img-banner__search-dropdown-filter"
          /> */}
        {/* <Input
            autoFocus
            onChange={(e) => setCommonSearchValue(e)}
            placeholder={'Tìm kiếm sách, tin tức, thông báo, tài liệu...'}
          />
          <Button
            type={BUTTON_TYPE.LEFT_ICON}
            leftIcon={<SearchOutlined />}
            name={'Tìm kiếm'}
            disabled={!commonSearchValue}
            onClick={handleSearch}
          /> */}
        {/* <Tooltip title="Bộ lọc">
            <div
              className="btn-show-advanced-filter"
              onClick={() => setShowFilterEngine(true)}
            >
              <i className="pi pi-filter"></i>
            </div>
          </Tooltip> */}
        {/* </div> */}
        <div className="toe-home-page__noti-section">
          <TitleSeparator
            icon={<BellOutlined />}
            title={'tin tức'}
            onClick={() => {
              navigate(PATH_NAME.NEWS);
            }}
          />
        </div>
        <div className="toe-home-page__news">
          <div className="toe-home-page__news-carousel">
            <CardList isLoading={isLoading} cards={dataPostsNews} />
          </div>
        </div>
        <div className="toe-home-page__noti-section">
          <TitleSeparator
            icon={<BellOutlined />}
            title={'thông báo'}
            onClick={() => {
              navigate(PATH_NAME.NOTIFICATION);
            }}
          />
        </div>
        <div className="toe-home-page__notificaitons">
          <div className="toe-home-page__notificaitons-left">
            {' '}
            <DynamicMenu />
          </div>
          <div className="toe-home-page__notificaitons-right">
            <NotificationList isLoading={isLoading} data={dataPostsNoti} />

            {/* <Button
              className="toe-home-page__notificaitons-right__btn-more"
              name={'Xem thêm...'}
              theme={BUTTON_THEME.THEME_4}
            />  */}
          </div>
        </div>

        <div className="toe-home-page__noti-section">
          <TitleSeparator
            className=""
            icon={<BellOutlined />}
            title={'giới thiệu sách mới'}
            onClick={() => {
              navigate(PATH_NAME.NEW_BOOKS_INTRODUCTION);
            }}
          />
        </div>
        <div className="toe-home-page__new-book">
          <CardList isLoading={isLoading} cards={dataPostNewBooks} />
        </div>
      </div>
      <Footer />
      <Loading show={isLoading} />
      <SideBar
        show={showFilterEngine}
        onClose={() => setShowFilterEngine(false)}
        title={'Bộ lọc nâng cao'}
        onClickRefreshButton={() => {
          // dispatch(
          //   filterAction.changeHomePageFilterEnige({ controls: [], filter: [] })
          // );

          setFilterValue({ filter: [], controls: [] });
          refreshFilterKey.current++;
        }}
        bottomRightButtons={[
          <Button
            name={'Hủy'}
            theme={BUTTON_THEME.THEME_6}
            onClick={() => setShowFilterEngine(false)}
          />,
          <Button
            type={BUTTON_TYPE.LEFT_ICON}
            leftIcon={<SearchOutlined />}
            name={'Tìm kiếm'}
            onClick={handleFilter}
          />,
        ]}
      >
        <FilterEngine
          key={refreshFilterKey.current}
          defaultControls={selector.controls}
          defaultFilter={selector.filter}
          onChange={({ filter, controls }) => {
            // dispatch(
            //   filterAction.changeHomePageFilterEnige({ controls, filter })
            // );

            setFilterValue({ filter, controls });
          }}
        />
      </SideBar>
    </Layout>
  );
}

export default HomePage;
