import React from 'react';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from 'recharts';
import './mostBorrowedBookChart.scss';

import PropTypes from 'prop-types';
import { TEXT_FALL_BACK } from '../../../../../../constants/commonConstant';

MostBorrowedBookChart.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  data: PropTypes.array,
};

MostBorrowedBookChart.defaultProps = {
  id: '',
  className: '',
  style: {},
  data: [],
};

function MostBorrowedBookChart(props) {
  const { data } = props;

  const KEY = {
    LABEL: 'label',
    VALUE: 'value',
  };

  const renderCustomizedLabel = (props) => {
    const { x, y, width, height, value } = props;
    const radius = 10;
    return (
      <g>
        <text
          x={x + width / 2}
          y={y - radius}
          fill="#454545"
          textAnchor="middle"
          dominantBaseline="middle"
          className="toe-font-body"
        >
          {value}
        </text>
      </g>
    );
  };

  const renderCustomizedTooltip = (props) => {
    const { active, payload } = props;
    if (!active || !payload) return null;
    const obj = payload[0].payload;
    return (
      <div className="chart-customize-tooltip toe-font-label">
        {obj.name ?? TEXT_FALL_BACK.TYPE_1}
      </div>
    );
  };

  return (
    <ResponsiveContainer
      width={'100%'}
      height={300}
      className="top-borrowed-chart"
    >
      <BarChart
        margin={{ left: -20 }}
        data={data.sort((a, b) => b[KEY.VALUE] - a[KEY.VALUE])}
      >
        <CartesianGrid strokeDasharray="4 4" />
        <XAxis dataKey="label" />
        <YAxis tickCount={1} />
        <Tooltip
          cursor={{ fill: 'transparent' }}
          content={renderCustomizedTooltip}
        />
        <Legend
          align="center"
          payload={[
            { id: 'value', value: 'Mã sách', color: '#8884d8', type: 'square' },
          ]}
        />
        <Bar barSize={40} dataKey={KEY.VALUE} fill="#8884d8">
          <LabelList
            dataKey={KEY.VALUE}
            content={(data) => renderCustomizedLabel(data)}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default MostBorrowedBookChart;
