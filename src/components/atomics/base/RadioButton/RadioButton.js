import { InputTextarea } from 'primereact/inputtextarea';
import PropTypes from 'prop-types';
import React, { useRef } from 'react';
import { buildClass } from '../../../../constants/commonFunction';
import { RadioButton as RadioButtonPrime } from 'primereact/radiobutton';
import './radioButton.scss';

RadioButton.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  checked: PropTypes.bool,
  label: PropTypes.string,
  onChange: PropTypes.func,
};

RadioButton.defaultProps = {
  id: '',
  className: '',
  style: {},
  checked: false,
  label: '',
  onChange: () => {},
};

function RadioButton(props) {
  const { id, style, className, checked, label, onChange } = props;

  const ref = useRef('');

  return (
    <div
      className="toe-radio-button toe-font-body"
      onClick={() => onChange(!checked)}
    >
      <RadioButtonPrime
        id={id}
        style={style}
        className={buildClass(['toe-radio-button__radio', className])}
        checked={checked}
      />
      <div className="toe-radio-button">{label}</div>
    </div>
  );
}

export default RadioButton;
