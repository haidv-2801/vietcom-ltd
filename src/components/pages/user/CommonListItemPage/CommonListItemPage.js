import { BellOutlined } from '@ant-design/icons';
import { Skeleton } from 'primereact/skeleton';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import baseApi from '../../../../api/baseApi';
import END_POINT from '../../../../constants/endpoint';
import Banner from '../../../molecules/Banner/Banner';
import CommonItem from '../../../molecules/CommonItem/CommonItem';
import HotNews from '../../../molecules/HotNews/HotNews';
import PaginatorAntd from '../../../molecules/PaginatorAntd/PaginatorAntd';
import Footer from '../../../sections/User/Footer/Footer';
import Layout from '../../../sections/User/Layout/Layout';
import store from '../../../../redux/store';
import { useSelector } from 'react-redux';
import './commonListItemPage.scss';

CommonListItemPage.propTypes = {
  titlePage: PropTypes.string,
  menuID: PropTypes.string,
};

CommonListItemPage.defaultProps = { titlePage: '', menuID: '' };

function CommonListItemPage(props) {
  const { children, titlePage, menuID } = props;
  const MIN_PAGE_SIZE = 20;

  const navigate = useNavigate();
  const params = useParams();
  const appSelector = useSelector((store) => store.app.menus);
  const { pathname } = useLocation();

  const [paging, setPaging] = useState({
    page: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [dataTable, setDataTable] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPostsByMenuID(menuID);
    getPosts();
  }, []);

  useEffect(() => {
    getPostsByMenuID(menuID);
  }, [paging, menuID]);

  const renderCommonItems = () => {
    if (isLoading) return renderSkeleton();
    if (totalRecords <= 0) return 'Không có dữ liệu hiển thị';
    return dataTable.map((item, _) => (
      <CommonItem
        onClick={() => {
          navigate(`${item?.slug}/${item?.postID}`);
        }}
        slug={item.slug}
        key={item?.postID}
        title={item?.title}
        description={item?.description}
        date={item?.createdDate}
        viewCount={item?.viewCount}
        imgSrc={item.image}
      />
    ));
  };

  const getPostsByMenuID = (menuID) => {
    // let _menuID = appSelector.filter(item=>item.slug===)
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
        setTotalRecords(res.data.totalRecord);
        setDataTable(_data);
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
            ['MenuID', '=', menuID],
            'AND',
            ['Status', '=', '1'],
            'AND',
            ['IsDeleted', '=', '0'],
          ])
        ),
        pageIndex: paging.page,
        pageSize: MIN_PAGE_SIZE,
      }
    );
  };

  const getPosts = () => {
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
        setPosts(_data);
      },
      (err) => {},
      () => {},
      END_POINT.TOE_GET_POSTS_FILTER,
      {
        filter: btoa(
          JSON.stringify([['Status', '=', '1'], 'AND', ['IsDeleted', '=', '0']])
        ),
        pageIndex: 1,
        pageSize: 5,
      }
    );
  };

  const renderSkeleton = () => {
    let number = Math.min(MIN_PAGE_SIZE, totalRecords || MIN_PAGE_SIZE),
      arr = [],
      obj = {};

    return (
      <div className="custom-skeleton p-4">
        <div className="m-0 p-0">
          <div className="mb-3">
            <div className="flex">
              <Skeleton shape="circle" size="7rem" className="mr-2"></Skeleton>
              <div style={{ flex: '1' }}>
                <Skeleton width="100%" className="mb-2"></Skeleton>
                <Skeleton width="75%"></Skeleton>
              </div>
            </div>
          </div>
          <div className="mb-3">
            <div className="flex">
              <Skeleton shape="circle" size="7rem" className="mr-2"></Skeleton>
              <div style={{ flex: '1' }}>
                <Skeleton width="100%" className="mb-2"></Skeleton>
                <Skeleton width="75%"></Skeleton>
              </div>
            </div>
          </div>
          <div className="mb-3">
            <div className="flex">
              <Skeleton shape="circle" size="7rem" className="mr-2"></Skeleton>
              <div style={{ flex: '1' }}>
                <Skeleton width="100%" className="mb-2"></Skeleton>
                <Skeleton width="75%"></Skeleton>
              </div>
            </div>
          </div>
          <div>
            <div className="flex">
              <Skeleton shape="circle" size="7rem" className="mr-2"></Skeleton>
              <div style={{ flex: '1' }}>
                <Skeleton width="100%" className="mb-2"></Skeleton>
                <Skeleton width="75%"></Skeleton>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="toe-common-list-item-page">
        <div className="toe-common-list-item-page__banner">
          <Banner
            breadCrumbs={[{ label: titlePage, url: pathname }]}
            title={titlePage}
            icon={<BellOutlined />}
          />
        </div>
        <div className="toe-common-list-item-page__body-wrapper">
          <div className="toe-common-list-item-page__body">
            <div className="toe-common-list-item-page__body-left">
              {renderCommonItems()}
              {totalRecords > 0 ? (
                <PaginatorAntd
                  className="toe-common-list-item-page__paginator"
                  totalRecords={totalRecords}
                  page={paging.page}
                  pageSize={MIN_PAGE_SIZE}
                  onChange={(data) => {
                    setPaging({ page: data });
                  }}
                />
              ) : null}
            </div>
            <div className="toe-common-list-item-page__body-right">
              <HotNews data={posts} />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </Layout>
  );
}

export default CommonListItemPage;
