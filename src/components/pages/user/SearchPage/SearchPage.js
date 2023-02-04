import { SearchOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { Chip } from 'primereact/chip';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  BUTTON_SHAPE,
  BUTTON_THEME,
  BUTTON_TYPE,
} from '../../../../constants/commonConstant';
import { filterAction } from '../../../../redux/slices/filterSlice';
import Button from '../../../atomics/base/Button/Button';
import Input from '../../../atomics/base/Input/Input';
import SideBar from '../../../atomics/base/SideBar/SideBar';
import Banner from '../../../molecules/Banner/Banner';
import Dropdown from '../../../molecules/Dropdown/Dropdown';
import FilterEngine from '../../../molecules/FilterEngine/FilterEngine';
import Footer from '../../../sections/User/Footer/Footer';
import Layout from '../../../sections/User/Layout/Layout';
import './searchPage.scss';

SearchPage.propTypes = {
  titlePage: PropTypes.string,
};

SearchPage.defaultProps = { titlePage: '' };

function SearchPage(props) {
  const { children, titlePage } = props;

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

  const selector = useSelector(
    (rootState) => rootState.filter.SearchPageFilterEnige
  );
  const dispatch = useDispatch();
  const [showFilterEngine, setShowFilterEngine] = useState(false);
  const [defaultFilterType, setDefaultFilterType] = useState(0);
  const [commonSearchValue, setCommonSearchValue] = useState('');

  const params = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const renderSection = (title) => {
    return (
      <div className="toe-book-page__body-section">
        <div className="toe-book-page__body-type toe-font-title">{title}</div>
        <div className="toe-book-page__body-content">{fake}</div>
        <div className="toe-book-page__body-btn">
          <Button
            shape={BUTTON_SHAPE.NORMAL}
            type={BUTTON_TYPE.RIGHT_ICON}
            rightIcon={<Chip label="9548" />}
            onClick={() => {
              navigate('itme-type');
            }}
            name={'Xem tất cả'}
          />
        </div>
      </div>
    );
  };

  const renderReport = (title) => {
    return (
      <div className="toe-book-page__body-section">
        <div className="toe-book-page__body-type toe-font-title">{title}</div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="toe-book-page">
        <Banner breadCrumbs={[{ label: 'mượn trả tài liệu', url: pathname }]} />
        <div className="toe-book-page__body-wrapper">
          <div className="toe-book-page__body">
            <div className="toe-book-page__body-main">
              <div
                className="toe-book-page__body-type toe-font-title"
                style={{ marginBottom: 8 }}
              >
                Tìm kiếm
              </div>
              <div className="toe-book-page__search">
                <Dropdown
                  options={filterTypeOptions}
                  defaultValue={defaultFilterType}
                  className="toe-book-page__search-dropdown-filter"
                />
                <Input
                  autoFocus
                  onChange={(e) => setCommonSearchValue(e)}
                  placeholder={'Tìm kiếm sách, tin tức, thông báo, tài liệu...'}
                />
                <Button
                  type={BUTTON_TYPE.LEFT_ICON}
                  leftIcon={<SearchOutlined />}
                  name={'Tìm kiếm'}
                  disabled={!commonSearchValue}
                  onClick={() => {}}
                />
                <div className="toe-admin-book-page__filter">
                  <Tooltip title="Bộ lọc">
                    <div
                      className="btn-show-advanced-filter"
                      onClick={() => setShowFilterEngine(true)}
                    >
                      <i className="pi pi-filter"></i>
                    </div>
                  </Tooltip>
                </div>
              </div>
              <div className="toe-book-page__search-engine">
                {/* {' '}
                {showFilterEngine ? <FilterEngine /> : null} */}
              </div>
              {renderSection('Tài liệu mới')}
              {renderSection('Tài liệu mượn nhiều')}
              {renderSection('Tài liệu số mới')}
              {renderSection('Tài liệu số mượn nhiều')}
              {renderReport('Thống kê')}
            </div>
          </div>
        </div>
        <Footer />
      </div>
      <SideBar
        show={showFilterEngine}
        onClose={() => setShowFilterEngine(false)}
        title={'Bộ lọc nâng cao'}
        bottomRightButtons={[
          <Button
            name={'Hủy'}
            theme={BUTTON_THEME.THEME_6}
            onClick={() => setShowFilterEngine(false)}
          />,
          <Button name={'Tìm kiếm'} />,
        ]}
      >
        <FilterEngine
          defaultControls={selector.controls}
          defaultFilter={selector.filter}
          onChange={({ filter, controls }) => {
            dispatch(
              filterAction.changeBooksPageFilterEnige({ controls, filter })
            );
          }}
        />
      </SideBar>
    </Layout>
  );
}

export default SearchPage;
