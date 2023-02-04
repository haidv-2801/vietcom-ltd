import React from 'react';
import { useState } from 'react';
import Viewer, { Worker } from '@phuocng/react-pdf-viewer';
import '@phuocng/react-pdf-viewer/cjs/react-pdf-viewer.css';
import { Upload, Button } from 'antd';
import { ACCEPT_FILE_PDF } from '../../../constants/commonConstant';
import { uploadFiles } from '../../../api/firebase';
import UpLoadImage from '../../molecules/UpLoadImage/UpLoadImage';
import ToastConfirmDelete from '../../molecules/ToastConfirmDelete/ToastConfirmDelete';
import MostBorrowedBookChart from '../admin/DashBoardPage/Control/MostBorrowedBookChart/MostBorrowedBookChart';

function MyPdf() {
  return (
    <div>
      <MostBorrowedBookChart />
    </div>
  );
}
export default MyPdf;
