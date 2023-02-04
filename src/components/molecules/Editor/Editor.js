import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import { Editor as EditorTiny } from '@tinymce/tinymce-react';
import { buildClass } from '../../../constants/commonFunction';

import './editor.scss';

Editor.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  onChange: PropTypes.func,
  onContentChange: PropTypes.func,
  defaultContent: PropTypes.any,
  label: PropTypes.any,
};

Editor.defaultProps = {
  id: '',
  className: '',
  style: {},
  onChange: () => {},
  onContentChange: () => {},
  defaultContent: 'Type some text here...',
  label: '',
};

function Editor(props) {
  const {
    id,
    style,
    className,
    onChange,
    onContentChange,
    defaultContent,
    label,
  } = props;

  const editorRef = useRef(null);

  const filePickerCallback = (cb, value, meta) => {
    var input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.onchange = function () {
      var file = this.files[0];

      var reader = new FileReader();
      reader.onload = function () {
        var id = 'blobid' + new Date().getTime();
        var blobCache = editorRef.current.editorUpload.blobCache;
        var base64 = reader.result.split(',')[1];
        var blobInfo = blobCache.create(id, file, base64);
        blobCache.add(blobInfo);
        cb(blobInfo.blobUri(), { title: file.name });
      };
      reader.readAsDataURL(file);
    };

    input.click();
  };

  const imagesUploadHandler = (blobInfo, success, failure) => {
    var formData = new FormData();
    formData.append('file', blobInfo.blob(), blobInfo.filename());
  };

  return (
    <div
      id={id}
      style={style}
      className={buildClass(['toe-editor', 'toe-font-body', className])}
    >
      {label ? (
        <span className="toe-editor__label toe-font-label">{label}</span>
      ) : null}
      <EditorTiny
        onInit={(evt, editor) => (editorRef.current = editor)}
        value={defaultContent}
        init={{
          selector: 'textarea',
          height: '100%',
          menubar: true,
          plugins: ['image code table link media codesample'],
          toolbar: [
            'undo redo | formatselect | ' +
              'bold italic backcolor | alignleft aligncenter ' +
              'alignright alignjustify | bullist numlist outdent indent | ' +
              'removeformat | image  preview  fullscreen code',
          ],
          image_title: true,
          automatic_uploads: true,
          file_picker_types: 'image',
          paste_data_images: true,
          file_picker_callback: filePickerCallback,
          images_upload_handler: imagesUploadHandler,
          images_upload_urlL: 'images',
          paste_as_text: true,
          paste_block_drop: false,
          content_style:
            'body { font-family:OpenSans-Regular,sans-serif; font-size:14px }',
        }}
        onChange={onChange}
        onEditorChange={onContentChange}
      />
    </div>
  );
}

export default Editor;
