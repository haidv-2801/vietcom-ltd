import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { buildClass } from '../../../constants/commonFunction';
import './questionCheckbox.scss';
import GroupCheck from '../GroupCheck/GroupCheck';

QuestionCheckbox.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  questionName: PropTypes.any,
  answers: PropTypes.array,
  defaultValue: PropTypes.any,
  imgSrc: PropTypes.string,
  onChange: PropTypes.func,
};

QuestionCheckbox.defaultProps = {
  id: '',
  className: '',
  style: {},
  questionName: null,
  answers: [],
  imgSrc: '',
  defaultValue: null,
  onChange: () => {},
};

function QuestionCheckbox(props) {
  const {
    id,
    style,
    className,
    questionName,
    answers,
    imgSrc,
    onChange,
    defaultValue,
  } = props;

  return (
    <div
      id={id}
      style={style}
      className={buildClass(['toe-question-checkbox', className])}
    >
      <div className="toe-question-checkbox__ques toe-font-label-bold">
        {questionName}
      </div>
      <GroupCheck
        defaultValue={defaultValue}
        onChange={onChange}
        options={answers}
      />
      <img src={imgSrc} alt="" />
    </div>
  );
}

export default QuestionCheckbox;
