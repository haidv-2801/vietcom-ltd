import PropTypes from 'prop-types';
import React from 'react';
import { Calendar } from 'primereact/calendar';
import './datePicker.scss';
import { buildClass } from '../../../../constants/commonFunction';
import moment from 'moment';

DatePicker.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  placeholder: PropTypes.string,
  max: PropTypes.instanceOf(Date),
  min: PropTypes.instanceOf(Date),
  defaultValue: PropTypes.instanceOf(Date),
  onChange: PropTypes.func,
  width: PropTypes.any,
  disabled: PropTypes.bool,
  mask: PropTypes.string,
};

DatePicker.defaultProps = {
  id: '',
  className: '',
  style: {},
  placeholder: 'dd/mm/yyyy',
  max: null,
  min: null,
  defaultValue: null,
  width: '100%',
  onChange: () => {},
  disabled: false,
  mask: 'dd/mm/yyyy',
};

function DatePicker(props) {
  const {
    id,
    style,
    className,
    placeholder,
    max,
    min,
    defaultValue,
    onChange,
    width,
    disabled,
    mask,
  } = props;

  return (
    <Calendar
      id={id}
      style={{ width, ...style }}
      className={buildClass(['toe-font-body toe-datepicker', className])}
      inputClassName={buildClass(['toe-font-body toe-datepicker__input'])}
      panelClassName={buildClass(['toe-font-body toe-datepicker__panel'])}
      placeholder={placeholder}
      maxDate={max}
      minDate={min}
      value={new Date(defaultValue)}
      onChange={onChange}
      // mask={mask}
      disabled={disabled}
      keepInvalid={true}
      showIcon
      hideOnDateTimeSelect
      dateFormat="dd/mm/yy"
    />
  );
}

export default DatePicker;
