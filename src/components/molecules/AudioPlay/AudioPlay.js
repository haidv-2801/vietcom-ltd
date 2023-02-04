import PropTypes from 'prop-types';
import React from 'react';
import { buildClass } from '../../../constants/commonFunction';
import './audioPlay.scss';

AudioPlay.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  src: PropTypes.string,
  label: PropTypes.any,
};

AudioPlay.defaultProps = {
  id: '',
  className: '',
  style: {},
  src: '',
  label: 'Audio:',
};

function AudioPlay(props) {
  const { id, style, className, src, label } = props;

  return (
    <div
      id={id}
      style={style}
      className={buildClass(['toe-audio-player', className])}
    >
      {label && <b className="toe-audio-player__label">{label}</b>}
      <audio preload="auto" controls style={{ width: '100%' }}>
        <source src={src} />
      </audio>
    </div>
  );
}

export default AudioPlay;
