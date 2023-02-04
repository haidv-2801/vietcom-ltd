import React from 'react';
import Viewer, { Worker } from '@phuocng/react-pdf-viewer';
import '@phuocng/react-pdf-viewer/cjs/react-pdf-viewer.css';
import './phuocngPdf.scss';

const PhuocngPdf = ({ url, renderError }) => {
  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.4.456/build/pdf.worker.min.js">
      <div
        className="toe-phuocng-pdf"
        style={{ height: '100%', width: '100%' }}
      >
        <Viewer renderError={renderError} fileUrl={url} />
      </div>
    </Worker>
  );
};

export default PhuocngPdf;
