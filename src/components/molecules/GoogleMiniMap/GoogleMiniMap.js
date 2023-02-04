import PropTypes from 'prop-types';
import React from 'react';
import { buildClass } from '../../../constants/commonFunction';
import GoogleMapReact from 'google-map-react';
import './googleMiniMap.scss';
import { GOOGLE_API_KEY } from '../../../constants/commonConstant';

GoogleMiniMap.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  src: PropTypes.string,
};

GoogleMiniMap.defaultProps = {
  id: '',
  className: '',
  style: {},
  src: '',
};

const AnyReactComponent = ({ text }) => <div>{text}</div>;

function GoogleMiniMap(props) {
  const { id, style, className } = props;

  return (
    <div
      id={id}
      style={style}
      className={buildClass(['toe-google-map', className])}
    >
      {' '}
      <GoogleMapReact
        bootstrapURLKeys={{ key: GOOGLE_API_KEY }}
        defaultCenter={this.props.center}
        defaultZoom={this.props.zoom}
      >
        <AnyReactComponent lat={59.955413} lng={30.337844} text="My Marker" />
      </GoogleMapReact>
    </div>
  );
}

export default GoogleMiniMap;
