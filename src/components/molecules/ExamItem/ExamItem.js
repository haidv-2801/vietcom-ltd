import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { buildClass } from '../../../constants/commonFunction';
import './examItem.scss';
import SmartText from '../../atomics/base/SmartText/SmartText';

ExamItem.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  examLabel: PropTypes.any,
  examNumber: PropTypes.any,
  onClick: PropTypes.func,
};

ExamItem.defaultProps = {
  id: '',
  className: '',
  style: {},
  examLabel: '',
  examNumber: '',
  onClick: () => {},
};

function ExamItem(props) {
  const { id, style, className, examLabel, examNumber, onClick } = props;

  return (
    <div
      id={id}
      style={style}
      className={buildClass(['toe-exam-item', className])}
      onClick={onClick}
    >
      <div className="toe-exam-item__number">{examNumber}</div>

      <div className="toe-exam-item__title">
        <SmartText className="toe-font-label" maxWidth={175}>
          {examLabel}
        </SmartText>
        <div className="toe-exam-item__subtitle toe-font-hint">
          Reading + Listening
        </div>
        <div className="toe-font-hint">Ngày đăng: 15/02/2022</div>
      </div>
    </div>
  );
}

export default ExamItem;
