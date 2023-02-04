import { Layout as LayoutAntd } from 'antd';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buildClass } from '../../../../constants/commonFunction';
import { useScroll } from '../../../../hooks/useScrollDown';
import useWindowResize from '../../../../hooks/useWindowResize';
import Header from '../Header/Header';
import HeaderTopBar from '../HeaderTopBar/HeaderTopBar';
import './layout.scss';

Layout.propTypes = {
  title: PropTypes.any,
  rightButtons: PropTypes.array,
  showNav: PropTypes.bool,
  bodyClass: PropTypes.string,
};

Layout.defaultProps = {
  title: null,
  rightButtons: [],
  showNav: true,
  bodyClass: '',
};

function Layout(props) {
  const { title, rightButtons, children, showNav, bodyClass } = props;
  const history = useNavigate();

  const homeRef = useScroll({
    top: () => {
      const header = document.querySelector(
        '.toe-layout-user-page-container__header'
      );

      header && header.classList.remove('header--box-shadow');
    },
    scrollDown: () => {
      const header = document.querySelector(
        '.toe-layout-user-page-container__header'
      );

      header && header.classList.remove('header--box-shadow');
      header && header.classList.add('header--box-shadow');
    },
  });

  const SCREEN_WIDTH = 1080;

  const [expandedMenu, setExpandedMenu] = useState(false);
  const [width, height] = useWindowResize();

  useEffect(() => {
    if (width > SCREEN_WIDTH) {
      setExpandedMenu(false);
    }
  }, [width]);

  useEffect(() => {}, []);

  return (
    <LayoutAntd>
      <div
        className={buildClass([
          'toe-layout-user-page-container',
          width <= SCREEN_WIDTH && 'toe-layout-user-page-container__1024',
        ])}
      >
        <HeaderTopBar />
        <Header showNav={showNav} />
        <div
          ref={homeRef}
          className={buildClass([
            'toe-layout-user-page-container__body',
            bodyClass,
          ])}
        >
          {children}
        </div>
      </div>
    </LayoutAntd>
  );
}

export default Layout;
