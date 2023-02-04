import { isArray } from 'lodash';
import { Tooltip as TooltipPrime } from 'primereact/tooltip';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { OPERATOR } from '../../../constants/commonConstant';
import { buildClass } from '../../../constants/commonFunction';
import Input from '../../atomics/base/Input/Input';
import Dropdown from '../Dropdown/Dropdown';
import './filterEngine.scss';

FilterEngine.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  onClick: PropTypes.func,
  onChange: PropTypes.func,
  defaultControls: PropTypes.array,
  defaultFilter: PropTypes.array,
  filterTypeOptions: PropTypes.array,
};

FilterEngine.defaultProps = {
  id: '',
  className: '',
  style: {},
  onClick: () => {},
  onChange: () => {},
  defaultControls: [],
  defaultFilter: [],
  filterTypeOptions: [],
};

function FilterEngine(props) {
  const {
    id,
    style,
    className,
    onClick,
    onChange,
    defaultControls,
    defaultFilter,
    filterTypeOptions,
  } = props;

  const MAXIMUM_CONTROLS = 10;

  const operators = [
    { label: 'AND', value: OPERATOR.AND },
    { label: 'OR', value: OPERATOR.OR },
    // { label: 'NOT', value: OPERATOR.NOT },
  ];

  const filterOperatorOptions = [
    {
      label: 'Bằng',
      value: OPERATOR.EQUAL,
    },
    {
      label: 'Không bằng',
      value: OPERATOR.NOT_EQUAL,
    },
    {
      label: 'Chứa',
      value: OPERATOR.CONTAINS,
    },
    {
      label: 'Bắt đầu bằng',
      value: OPERATOR.START_WIDTH,
    },
    {
      label: 'Kết thúc bằng',
      value: OPERATOR.END_WIDTH,
    },
  ];

  const [filterChainType, setFilterChainType] = useState({});
  const [filterBy, setFilterBy] = useState({});
  const [filterOperator, setFilterOperator] = useState({});
  const [filterValue, setFilterValue] = useState({});
  const [controlHover, setControlHover] = useState(null);
  const [filterControls, setFilterControls] = useState([]);

  useEffect(() => {
    buildFilter();
  }, [filterChainType, filterBy, filterOperator, filterValue, filterControls]);

  useEffect(() => {
    if (!filterControls.length && !defaultFilter.length) {
      const id = uuid();
      setFilterBy((pre) => ({ ...pre, [id]: filterTypeOptions[0]?.value }));
      setFilterChainType((pre) => ({ ...pre, [id]: OPERATOR.AND }));
      setFilterOperator((pre) => ({ ...pre, [id]: OPERATOR.CONTAINS }));
      setFilterControls([id]);
    }

    if (defaultFilter.length) {
      defaultValueFilter();
    }
  }, []);

  const getControl = (keyHover) => {
    return (
      <div
        onMouseOver={() => {
          setControlHover(keyHover);
        }}
        key={keyHover}
        onMouseLeave={() => setControlHover(null)}
        className="toe-filter-engine__control"
      >
        <div className="toe-filter-engine__control-row">
          {filterControls?.[0] === keyHover ? null : (
            <Dropdown
              className="toe-filter-engine__control-dropdown"
              onChange={(data) => {
                setFilterChainType((pre) => ({
                  ...pre,
                  [keyHover]: data.value,
                }));
              }}
              defaultValue={filterChainType[keyHover]}
              options={operators}
            />
          )}
          <Dropdown
            onChange={(data) => {
              setFilterBy((pre) => ({ ...pre, [keyHover]: data.value }));
            }}
            defaultValue={filterBy[keyHover]}
            options={filterTypeOptions}
            placeholder="Lọc theo"
          />{' '}
        </div>
        <div className="toe-filter-engine__control-row">
          <Dropdown
            onChange={(data) => {
              setFilterOperator((pre) => ({
                ...pre,
                [keyHover]: data.value,
              }));
            }}
            defaultValue={filterOperator[keyHover]}
            options={filterOperatorOptions}
            placeholder="Điều kiện"
            className="toe-filter-engine__control-dropdown"
          />{' '}
          <Input
            onChange={(e) =>
              setFilterValue((pre) => ({
                ...pre,
                [keyHover]: e?.trim(),
              }))
            }
            maxLength={255}
            autoFocus
            defaultValue={filterValue[keyHover]}
            placeholder={'Nhập giá trị lọc'}
          />
        </div>

        {controlHover === keyHover && (
          <div
            onClick={() => handleRemoveControl(keyHover)}
            className="btn-remove-control"
          >
            <i style={{ color: 'red' }} className="pi pi-trash"></i>
          </div>
        )}
      </div>
    );
  };

  const renderBottomBtns = () => {
    return null;
    {
      /* <div className="toe-filter-engine__control">
    <Button
      type={BUTTON_TYPE.LEFT_ICON}
      leftIcon={<RetweetOutlined />}
      name={'Làm mới'}
      theme={BUTTON_THEME.THEME_6}
      onClick={() => {}}
    />
    <Button
      type={BUTTON_TYPE.LEFT_ICON}
      leftIcon={<SearchOutlined />}
      name={'Tìm kiếm'}
      onClick={() => {}}
    />
  </div> */
    }
  };

  const handleAddNewControl = () => {
    if (filterControls.length >= MAXIMUM_CONTROLS) return;
    const id = uuid();
    setFilterBy((pre) => ({ ...pre, [id]: filterTypeOptions[0].value }));
    setFilterChainType((pre) => ({ ...pre, [id]: operators[0].value }));
    setFilterOperator((pre) => ({ ...pre, [id]: OPERATOR.CONTAINS }));
    setFilterControls([...filterControls, id]);
  };

  const handleRemoveControl = (keyRemove) => {
    setFilterControls(filterControls.filter((_) => _ !== keyRemove));
  };

  const buildFilter = () => {
    let filter = [];

    for (const item of filterControls) {
      const chain = filterChainType[item];
      const by = filterBy[item];
      const operator = filterOperator[item];
      const value = filterValue[item];

      if (filter.length) filter.push(chain);
      filter.push([by, operator, !value ? value : encodeURI(value)]);
    }

    onChange({ filter, controls: filterControls });
  };

  const defaultValueFilter = () => {
    let index = 0;

    for (const filter of defaultFilter) {
      if (isArray(filter)) {
        const id = defaultControls[index++];
        const [by, operator, value] = filter;

        setFilterBy((pre) => ({ ...pre, [id]: by }));
        setFilterOperator((pre) => ({ ...pre, [id]: operator }));
        setFilterValue((pre) => ({
          ...pre,
          [id]: !value ? value : decodeURI(value),
        }));
      } else {
        const id = defaultControls[index];
        setFilterChainType((pre) => ({ ...pre, [id]: filter }));
      }
    }

    setFilterControls([...defaultControls]);
  };

  return (
    <div
      id={id}
      style={style}
      className={buildClass(['toe-filter-engine toe-font-body', className])}
    >
      <div className="toe-filter-engine__control">
        <div className="col-name">1.Loại nối</div>
        <div className="col-name">2.Trường</div>
        <div className="col-name">3.Điệu kiện</div>
        <div className="col-name">4.Giá trị</div>
      </div>
      {filterControls.map((_) => getControl(_))}
      <TooltipPrime
        position="left"
        target={'.pi-plus'}
        content="Thêm mới điều kiện"
      />
      <div className="toe-filter-engine__control __btn-add">
        {filterControls.length >= MAXIMUM_CONTROLS && (
          <div className="toe-font-hint" style={{ color: 'red' }}>
            Tối đa 10 điều kiện lọc
          </div>
        )}
        {filterControls.length === 0 && (
          <div className="toe-font-hint">Chưa có điều kiện lọc nào</div>
        )}
        <i
          onClick={handleAddNewControl}
          className={buildClass([
            'pi pi-plus',
            filterControls.length >= MAXIMUM_CONTROLS && 'pi-plus--disabled',
          ])}
        ></i>
      </div>

      {renderBottomBtns()}
    </div>
  );
}

export default FilterEngine;
