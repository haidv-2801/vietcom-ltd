import React, { useEffect } from 'react';

function useResizeImage(maxWidth = 300, maxHeight = 300) {
  var file = YOUR_FILE,
    fileType = file.type,
    reader = new FileReader();

  reader.onloadend = function () {
    var image = new Image();
    image.src = reader.result;

    image.onload = function () {
      var imageWidth = image.width,
        imageHeight = image.height;

      if (imageWidth > imageHeight) {
        if (imageWidth > maxWidth) {
          imageHeight *= maxWidth / imageWidth;
          imageWidth = maxWidth;
        }
      } else {
        if (imageHeight > maxHeight) {
          imageWidth *= maxHeight / imageHeight;
          imageHeight = maxHeight;
        }
      }

      var canvas = document.createElement('canvas');
      canvas.width = imageWidth;
      canvas.height = imageHeight;

      var ctx = canvas.getContext('2d');
      ctx.drawImage(this, 0, 0, imageWidth, imageHeight);

      // The resized file ready for upload
      var finalFile = canvas.toDataURL(fileType);
      return finalFile;
    };
  };

  reader.readAsDataURL(file);
}

export default useResizeImage;
