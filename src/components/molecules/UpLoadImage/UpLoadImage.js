import { Image } from 'primereact/image';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { buildClass } from '../../../constants/commonFunction';
import './upLoadImage.scss';

UpLoadImage.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  onChange: PropTypes.func,
  defaultValue: PropTypes.any,
};

UpLoadImage.defaultProps = {
  id: '',
  className: '',
  style: {},
  onChange: () => {},
  defaultValue: null,
};

function UpLoadImage(props) {
  const { id, style, className, onChange, defaultValue } = props;
  const [image, setImage] = useState(defaultValue);

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      setImage(URL.createObjectURL(img));
      onChange && onChange(event.target.files[0]);
    }
  };

  return (
    <div
      id={id}
      style={style}
      className={buildClass(['toe-upload toe-font-body', className])}
    >
      {/* <div className="toe-upload__img-wrapper">
        {image ? <Image src={image} alt="Image" preview /> : null}
        {!image ? <i className="pi pi-user" /> : null}
      </div> */}
      <input
        type="file"
        name="myImage"
        id="image"
        accept="image/"
        // value={defaultValue}
        onChange={onImageChange}
      />
    </div>
  );
}

export default UpLoadImage;
