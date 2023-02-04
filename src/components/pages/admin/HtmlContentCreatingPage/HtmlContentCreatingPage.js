import { RetweetOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { Button as ButtonPrime } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { ProgressBar } from 'primereact/progressbar';
import { TabPanel, TabView } from 'primereact/tabview';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import baseApi from '../../../../api/baseApi';
import { uploadFiles } from '../../../../api/firebase';
import { getUserID, getUserName } from '../../../../constants/commonAuth';
import {
  BUTTON_THEME,
  BUTTON_TYPE,
  GUID_NULL,
  POST_TYPE,
  TEXT_FALL_BACK,
  MAXIMUM_FILE_SIZE,
} from '../../../../constants/commonConstant';
import {
  buildClass,
  formatBytes,
  listToTree,
  slugify,
} from '../../../../constants/commonFunction';
import END_POINT from '../../../../constants/endpoint';
import Button from '../../../atomics/base/Button/Button';
import Input from '../../../atomics/base/Input/Input';
import Spinner from '../../../atomics/base/Spinner/Spinner';
import TextAreaBase from '../../../atomics/base/TextArea/TextArea';
import TreeSelect from '../../../atomics/base/TreeSelect/TreeSelect';
import Editor from '../../../molecules/Editor/Editor';
import GroupCheck from '../../../molecules/GroupCheck/GroupCheck';
import Layout from '../../../sections/Admin/Layout/Layout';
import './htmlContentCreatingPage.scss';

HtmlContentCreatingPage.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
};

HtmlContentCreatingPage.defaultProps = {
  id: '',
  className: '',
  style: {},
};

function HtmlContentCreatingPage(props) {
  const { id, style, className } = props;
  const POST_TYPES = [
    { label: 'Tin tức', value: POST_TYPE.NEWS },
    { label: 'Thông báo', value: POST_TYPE.NOTIFICATION },
    { label: 'Giới thiệu sách', value: POST_TYPE.ABOUT_THE_BOOK },
  ];
  const DEFAULT_DATA = {
    title: 'Tiêu đề bài đăng mặc định',
    slug: 'tieu-de-bai-dang-mac-dinh',
    postType: '',
    htmlContent: 'Tiêu đề bài đăng content',
    description: 'Mô tả mặc định',
    menuID: GUID_NULL,
  };

  const navigate = useNavigate();

  const [htmlContent, setHtmlContent] = useState('Type some text...');
  const [defaultHtmlContent, setDefaultHtmlContent] =
    useState('Type some text...');

  const [data, setData] = useState(DEFAULT_DATA);

  const [activeIndex, setActiveIndex] = useState();
  const [totalSize, setTotalSize] = useState(0);
  const [files, setFiles] = useState([]);
  const [showWarningMessage, setShowWarningMessage] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const toast = useRef(null);
  const fileUploadRef = useRef(null);
  const forgeRenderKey = useRef(0);
  const [dataTable, setDataTable] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getMenus();
  }, []);

  const onTemplateRemove = (file, callback) => {
    setTotalSize(totalSize - file.size);
    callback();
  };

  const onTemplateUpload = (e) => {
    const _formData = new FormData();

    for (let file of e.files) {
      _formData.append(file.name, file);
    }

    toast.current.show({
      severity: 'success',
      summary: 'Success',
      detail: 'File Uploaded',
      life: 3000,
    });
  };

  const onTemplateSelect = (e) => {
    let _totalSize = totalSize;

    for (let file of e.files) {
      if (
        file.size > MAXIMUM_FILE_SIZE ||
        _totalSize + file.size > MAXIMUM_FILE_SIZE
      ) {
      } else {
        _totalSize += file.size;
        setFiles((pre) => [...pre, file]);
      }
    }

    setTotalSize(_totalSize);
  };

  const onTemplateClear = () => {
    setTotalSize(0);
    setFiles([]);
  };

  const headerTemplate = (options) => {
    const { className, chooseButton, uploadButton, cancelButton } = options;
    const value = totalSize / 10000;
    const formatedValue =
      fileUploadRef && fileUploadRef.current
        ? fileUploadRef.current.formatSize(totalSize)
        : '0 B';

    return (
      <div
        className={className}
        style={{
          backgroundColor: 'transparent',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {chooseButton}
        {cancelButton}
        <ProgressBar
          value={value}
          displayValueTemplate={() =>
            `${formatedValue} / ${formatBytes(MAXIMUM_FILE_SIZE)}`
          }
          style={{ width: '300px', height: '20px', marginLeft: 'auto' }}
        ></ProgressBar>
      </div>
    );
  };

  const itemTemplate = (file, props) => {
    return (
      <div className="flex align-items-center flex-wrap">
        <div className="flex align-items-center" style={{ width: '40%' }}>
          <img
            alt={file.name}
            role="presentation"
            src={file.objectURL}
            width={100}
          />
          <span className="flex flex-column text-left ml-3">
            {file.name}
            <small>{new Date().toLocaleString()}</small>
          </span>
        </div>
        <Tag
          value={props.formatSize}
          severity="warning"
          className="px-3 py-2"
        />
        <ButtonPrime
          type="button"
          icon="pi pi-times"
          className="p-button-outlined p-button-rounded p-button-danger ml-auto"
          onClick={() => onTemplateRemove(file, props.onRemove)}
        />
      </div>
    );
  };

  const emptyTemplate = () => {
    return (
      <div className="flex align-items-center flex-column">
        <i
          className="pi pi-image mt-3 p-5"
          style={{
            fontSize: '5em',
            borderRadius: '50%',
            backgroundColor: 'var(--surface-b)',
            color: 'var(--surface-d)',
          }}
        ></i>
        <span
          style={{ fontSize: '1.2em', color: 'var(--text-color-secondary)' }}
          className="my-5"
        >
          Drag and Drop Image Here
        </span>
      </div>
    );
  };

  const chooseOptions = {
    icon: 'pi pi-fw pi-images',
    iconOnly: true,
    className: 'custom-choose-btn p-button-rounded p-button-outlined',
  };

  const uploadOptions = {
    icon: 'pi pi-fw pi-cloud-upload',
    iconOnly: true,
    className:
      'custom-upload-btn p-button-success p-button-rounded p-button-outlined',
  };

  const cancelOptions = {
    icon: 'pi pi-fw pi-times',
    iconOnly: true,
    className:
      'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined',
  };

  const handleSave = () => {
    setIsLoading(true);
    if (!data.htmlContent) setShowWarningMessage(true);
    if (!files.length) {
      insertPost('');
    } else {
      uploadFiles(files[0], 'images')
        .then((res) => {
          insertPost(res);
        })
        .catch((err) => {
          setIsLoading(false);
          toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Sửa thất bại',
            life: 3000,
          });
        });
    }
  };

  const getMenus = () => {
    baseApi.get(
      (res) => {
        let _data = res.map((item) => ({
          ...item,
          key: item?.menuID,
          label: item?.title,
        }));
        _data = listToTree(_data);
        setDataTable(_data);
      },
      (err) => {},
      () => {},
      END_POINT.TOE_GET_MENUS,
      null,
      null
    );
  };

  const insertPost = (_image = '') => {
    let _body = {
      title: data.title,
      slug: data.slug,
      description: data.description,
      content: JSON.stringify(htmlContent),
      image: _image,
      viewCount: 200,
      type: 1,
      menuID: data?.menuID,
      createdDate: new Date(Date.now() + 7 * 60 * 60 * 1000),
      createdBy: getUserName(),
      modifiedDate: new Date(Date.now() + 7 * 60 * 60 * 1000),
      modifiedBy: getUserName(),
      status: isActive,
      isDeleted: false,
      accountID: getUserID(),
    };

    baseApi.post(
      (res) => {
        if (res.data > 0) {
          toast.current.show({
            severity: 'success',
            summary: 'Success',
            detail: 'Thêm mới thành công',
            life: 3000,
          });
          setTimeout(() => {
            window.history.back();
          }, 400);
        }
      },
      (err) => {
        setIsLoading(false);

        let errMessage = err?.response?.data?.data || 'Có lỗi xảy ra';
        toast.current.show({
          severity: 'error',
          summary: 'Thêm mới thất bại',
          detail: errMessage,
          life: 3000,
        });
      },
      () => {},
      END_POINT.TOE_INSERT_POST,
      _body,
      null,
      null
    );
  };

  return (
    <Layout
      title="Thêm mới bài đăng"
      hasBackBtn={true}
      back={() => window.history.back()}
      rightButtons={[
        // <Tooltip title={'Xem trước'}>
        //   <EyeOutlined />
        // </Tooltip>,
        <Tooltip title={'Xóa trắng thông tin của các trường'}>
          <div>
            <Button
              type={BUTTON_TYPE.LEFT_ICON}
              leftIcon={<RetweetOutlined />}
              name={'Làm mới'}
              theme={BUTTON_THEME.THEME_6}
              onClick={() => {
                setData({ ...DEFAULT_DATA });
                forgeRenderKey.current++;
              }}
            />
          </div>
        </Tooltip>,
        <Button
          onClick={handleSave}
          name="Lưu"
          leftIcon={<Spinner show={isLoading} />}
          type={isLoading ? BUTTON_TYPE.LEFT_ICON : BUTTON_TYPE.NORMAL}
          disabled={isLoading}
        />,
      ]}
    >
      <div
        id={id}
        style={style}
        className={buildClass(['toe-admin-create-post-page', className])}
      >
        <Toast ref={toast}></Toast>
        {showWarningMessage && !data.htmlContent ? (
          <div className="toe-admin-create-post-page__row row-warning">
            Vui lòng nhập nội dung của bài đăng
          </div>
        ) : null}

        <TabView
          key={forgeRenderKey.current}
          activeIndex={activeIndex}
          onTabChange={(e) => setActiveIndex(e.index)}
          className="toe-admin-create-post-page__tabview"
        >
          <TabPanel header="Thông tin">
            <div className="toe-admin-create-post-page__row">
              <Input
                label={'Tiêu đề'}
                placeholder="Tiêu đề bài đăng..."
                bottomMessage="Trường bắt buộc nhập"
                valid={true}
                hasRequiredLabel
                defaultValue={data?.title}
                onChange={(value) => {
                  setData((pre) => ({
                    ...pre,
                    title: value,
                    slug: slugify(value),
                  }));
                }}
                maxLength={255}
              />
              <div className="toe-admin-create-post-page__row-slug toe-font-label">
                <Input
                  label={'Alias'}
                  placeholder="Alias..."
                  bottomMessage="Trường bắt buộc nhập"
                  valid={true}
                  value={data.slug}
                  defaultValue={data.slug || TEXT_FALL_BACK.TYPE_1}
                  hasRequiredLabel
                  onChange={(value) =>
                    setData((pre) => ({
                      ...pre,
                      slug: value,
                    }))
                  }
                  controlled
                  maxLength={255}
                />
              </div>
            </div>
            <div className="toe-admin-create-post-page__row">
              <TreeSelect
                hasRequiredLabel
                label="Menu hiển thị"
                placeholder="Nhấp để chọn"
                value={data.menuID}
                options={dataTable}
                onChange={(data) => {
                  setData((pre) => ({
                    ...pre,
                    menuID: data.value,
                  }));
                }}
              />
            </div>
            <div className="toe-admin-create-post-page__row">
              <span className="toe-font-label">
                Tóm tắt<span style={{ color: 'red' }}>*</span>
              </span>
              <TextAreaBase
                value={data.description}
                onChange={(value) => setData({ ...data, description: value })}
                placeholder="Tóm tắt nội dung..."
              />
            </div>
            <div className="toe-admin-create-post-page__row">
              <GroupCheck
                onClick={(e) => {
                  setIsActive((p) => !p);
                }}
                defaultValue={isActive}
                options={[{ label: 'Hoạt động', value: true }]}
              />
            </div>
            <div className="toe-admin-create-post-page__row">
              <span className="toe-font-label">
                Ảnh xem trước<span style={{ color: 'red' }}>*</span>
              </span>
              <FileUpload
                ref={fileUploadRef}
                multiple={false}
                accept="image/*"
                maxFileSize={MAXIMUM_FILE_SIZE}
                customUpload={true}
                onSelect={onTemplateSelect}
                onError={onTemplateClear}
                onClear={onTemplateClear}
                headerTemplate={headerTemplate}
                itemTemplate={itemTemplate}
                emptyTemplate={emptyTemplate}
                chooseOptions={chooseOptions}
                uploadOptions={uploadOptions}
                cancelOptions={cancelOptions}
                headerClassName="toe-font-body"
                className="toe-font-body"
              />
            </div>
          </TabPanel>
          <TabPanel
            header={
              <span>
                Nội dung<span style={{ color: 'red' }}>*</span>
              </span>
            }
          >
            <Editor
              defaultContent={htmlContent}
              onContentChange={(data) => {
                setData((pre) => ({ ...pre, htmlContent: data }));
                setHtmlContent(data);
              }}
            />
          </TabPanel>
        </TabView>
      </div>
    </Layout>
  );
}

export default HtmlContentCreatingPage;
