import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { buildClass } from '../../../../constants/commonFunction';
import MainLogo from '../../../../assets/images/toeiclogo.png';
import Avatar from '../../../../assets/images/me.jpg';
import useWindowResize from '../../../../hooks/useWindowResize';
import Layout from '../../../sections/User/Layout/Layout';
import Footer from '../../../sections/User/Footer/Footer';
import './App.scoped.css';
import './bootstrap.min.scoped.css';
import './homePage.scss';

HomePage.propTypes = {};

HomePage.defaultProps = {};

function HomePage(props) {
  return (
    <Layout>
      <div className="toe-home-page">
        <div className="container intro">
          <div className="row">
            <div className="col-md-6">
              <div className="onlinetoic">
                <h1 className="onlinetoic_one">
                  ONLINE TOEIC TEST - Thi Thử <br /> TOEIC Online Miễn Phí
                </h1>
              </div>
              <div className="slogantoic slogantoic-one">
                {' '}
                Đề thi thử TOEIC được thực hiện theo format mới, có chấm điểm và
                hiển thị chi tiết đề thi giúp bạn đánh giá chính xác điểm TOEIC
                hiện tại đặc biệt website dễ sử dụng và hoàn toàn miễn phí phù
                hợp với tất cả mọi người
              </div>
            </div>
          </div>
        </div>
        <div className="container about">
          <div className="row">
            <div className="col-md-6">
              <div className="left-content">
                <div className="right-img">
                  <img
                    src="https://preview.colorlib.com/theme/courses/assets/img/gallery/about3.png"
                    alt="about"
                    width="100%"
                    height="100%"
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="right-content">
                <div className="section-tittle section-tittle2 mb-20">
                  <div className="front-text">
                    <h4>
                      Trang web này cung cấp các bài thi thực hành tương tác cho
                      bài thi TOEIC Listening và Reading
                    </h4>
                    <h4>Trang web này sẽ giúp bạn: </h4>
                  </div>
                </div>
                <div className="single-features">
                  <div className="features-icon">
                    <i
                      className="pi pi-check"
                      style={{
                        fontSize: '1.5rem',
                        color: '#42BF80',
                        fontWeight: 'bold',
                      }}
                    />
                  </div>
                  <div className="features-caption">
                    <p>Phát triển kỹ năng làm bài kiểm tra của bạn.</p>
                  </div>
                </div>
                <div className="single-features">
                  <div className="features-icon">
                    <i
                      className="pi pi-check"
                      style={{
                        fontSize: '1.5rem',
                        color: '#42BF80',
                        fontWeight: 'bold',
                      }}
                    />
                  </div>
                  <div className="features-caption">
                    <p>Xác định các lĩnh vực cần cải thiện.</p>
                  </div>
                </div>
                <div className="single-features">
                  <div className="features-icon">
                    <i
                      className="pi pi-check"
                      style={{
                        fontSize: '1.5rem',
                        color: '#42BF80',
                        fontWeight: 'bold',
                      }}
                    />
                  </div>
                  <div className="features-caption">
                    <p>Mở rộng ngữ pháp và vốn từ vựng của bạn.</p>
                  </div>
                </div>
                <div className="single-features">
                  <div className="features-icon">
                    <i
                      className="pi pi-check"
                      style={{
                        fontSize: '1.5rem',
                        color: '#42BF80',
                        fontWeight: 'bold',
                      }}
                    />
                  </div>
                  <div className="features-caption">
                    <p>Cải thiện sự tự tin của bạn.</p>
                  </div>
                </div>
                <div className="single-features">
                  <div className="features-icon">
                    <i
                      className="pi pi-check"
                      style={{
                        fontSize: '1.5rem',
                        color: '#42BF80',
                        fontWeight: 'bold',
                      }}
                    />
                  </div>
                  <div className="features-caption">
                    <p>Xem điểm TOEIC ước tính của bạn!.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>{' '}
        <Footer />
      </div>
    </Layout>
  );
}

export default HomePage;
