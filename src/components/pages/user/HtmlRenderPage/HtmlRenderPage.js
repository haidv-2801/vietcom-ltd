import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { format } from 'react-string-format';
import baseApi from '../../../../api/baseApi';
import { isGuid } from '../../../../constants/commonFunction';
import END_POINT from '../../../../constants/endpoint';
import HotNews from '../../../molecules/HotNews/HotNews';
import Footer from '../../../sections/User/Footer/Footer';
import Layout from '../../../sections/User/Layout/Layout';
import { useSelector } from 'react-redux';
import store from '../../../../redux/store';
import Banner from '../../../molecules/Banner/Banner';
import { BellOutlined } from '@ant-design/icons';
import './htmlRenderPage.scss';
import {
  MAXIMUM_PAGESIZE,
  OPERATOR,
} from '../../../../constants/commonConstant';

HtmlRenderPage.propTypes = {
  titlePage: PropTypes.string,
};

HtmlRenderPage.defaultProps = { titlePage: '' };

function HtmlRenderPage(props) {
  const { children, titlePage } = props;

  const params = useParams();
  const { pathname } = useLocation();

  const appSelector = useSelector((store) => store.app.menus);
  const [postDetail, setPostDetail] = useState({});
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPosts();
  }, []);

  useEffect(() => {
    if (isGuid(params?.postID)) getPostByID(params?.postID);
    else {
      /**
       * todo: Lấy id menu theo alias -> lấy bài viết theo menu
       */

      if (params?.slug) {
        let menus = appSelector.filter(
          (item) => item.slug === params.menuType + '/' + params.slug
        );
        if (menus.length) {
          getPostsByMenuID(menus[0].menuID);
        }
      } else {
        setError('Oops! Không tải được trang!');
      }
    }
  }, [params, appSelector]);

  const getPostByID = (id) => {
    baseApi.get(
      (res) => {
        let body = { ...res };
        body['viewCount'] = +body['viewCount'] + 1;
        setPostDetail(res);

        baseApi.put(
          (res) => {},
          (err) => {},
          () => {},
          format(END_POINT.TOE_UPDATE_POST, id),
          body,
          null,
          null
        );
      },
      (err) => {
        if (err.status == 404) {
          setError('Oops! Không tải được trang!');
        } else {
          setError('Oops! Không có dữ liệu!');
        }
      },
      () => {},
      format(END_POINT.TOE_GET_POST_BY_ID, id),
      null,
      null
    );
  };

  const getPostsByMenuID = (nenuID) => {
    baseApi.post(
      (res) => {
        let _data = res.data.pageData;
        if (_data.length) {
          setError(null);
          _data.sort((a, b) => {
            return (
              new Date(b.createdDate).getTime() -
              new Date(a.createdDate).getTime()
            );
          });
          setPostDetail(_data[0]);
        } else {
          setError('Oops! Không có dữ liệu!');
        }
      },
      (err) => {
        setError('Oops! Không tải được trang!');
      },
      () => {},
      END_POINT.TOE_GET_POSTS_FILTER,
      {
        filter: btoa(
          JSON.stringify([
            ['MenuID', OPERATOR.EQUAL, encodeURI(nenuID)],
            OPERATOR.AND,
            ['IsDeleted', OPERATOR.EQUAL, '0'],
            OPERATOR.AND,
            ['Status', OPERATOR.EQUAL, '1'],
          ])
        ),
        pageIndex: 1,
        pageSize: MAXIMUM_PAGESIZE,
      },
      null
    );
  };

  const renderHtmlMarkup = () => {
    if (!postDetail?.content) return null;
    let content = null;
    try {
      content = JSON.parse(postDetail?.content);
    } catch (err) {
      setError('Oops! Không tải được trang!');
    }
    return content;
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

  const getDataBreadCrumb = () => {
    if (pathname) {
      let arr = pathname.split('/');
      arr = arr.map((item) => {
        return { label: item, url: item };
      });
      return arr;
    }

    return [];
  };

  return (
    <Layout>
      <div className="toe-html-render-page">
        <Banner
          breadCrumbs={[
            {
              label: postDetail?.title,
              url: params?.slug ?? params?.postType,
            },
          ]}
          title={titlePage}
          icon={<BellOutlined />}
        />
        <div className="toe-html-render-page__body-wrapper">
          <div className="toe-html-render-page__body">
            <div className="toe-html-render-page__body-left">
              {error ? (
                error
              ) : (
                <>
                  <div className="toe-html-render-page__body-left__title toe-font-body">
                    {postDetail?.title}
                  </div>
                  <div
                    className="toe-html-render-page__body-left__content toe-font-body"
                    dangerouslySetInnerHTML={{
                      __html: renderHtmlMarkup(),
                    }}
                  ></div>
                </>
              )}
            </div>
            <div className="toe-html-render-page__body-right">
              {' '}
              <HotNews data={posts} />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </Layout>
  );
}

export default HtmlRenderPage;
