import React from 'react';
import { IFilePreviewDrawerProps } from 'types/File/file';
import { Button, Drawer } from 'antd';
import cn from 'classnames';
import { formatFileSize } from 'utils/helpers';
import dayjs from 'dayjs';
import { DeleteOutlined, DownloadOutlined } from '@ant-design/icons';
require('dayjs/locale/ru');


export const FilePreviewDrawer = (props: IFilePreviewDrawerProps) => {
  const {
    open,
    onClose,
    file,
    onDelete,
    onDownloadFile
  } = props;

  const fileType = file.mimeType.split('/')[0];

  return (
    <Drawer
      title="Просмотр файла"
      open={open}
      onClose={onClose}
      width={480}
    >
      <div className="file-preview-drawer">
        <div
          className={cn("file-preview-drawer__file-preview", {
            "file-preview-drawer__file-preview--image": fileType === 'image',
            "file-preview-drawer__file-preview--other": fileType !== 'image',
          })}
        >
          {file.icon}
        </div>
        <div className="file-preview-drawer__file-title">
          {file.name}
        </div>
        <div className="file-preview-drawer__preview-actions">
          <Button
            onClick={() => onDownloadFile(file.id, file.name)}
            style={{marginBottom: 20}}
          >
            <div className="preview-actions__download-button">
              <div className="download-button__title">Скачать файл</div>
              <div className="download-button__icon">
                <DownloadOutlined />
              </div>
            </div>
          </Button>
          <Button
            danger
            style={{
              backgroundColor: 'var(--color-red1)',
              color: 'var(--color-white)',
              border: '1px var(--color-red1)',
              marginBottom: 30
            }}
            onClick={() => onDelete(file.id)}
          >

            <div className="preview-actions__delete-button">
              <div className="delete-button__title">Удалить файл</div>
              <div className="delete-button__icon">
                <DeleteOutlined />
              </div>
            </div>
          </Button>
        </div>
        <div className="file-preview-drawer__preview-file-info">
          <div className="preview-file-info__file-field">
            <div className="file-field__field-title">
              Тип файла
            </div>
            <div className="file-field__field-value">
              {file.mimeType}
            </div>
          </div>
          <div className="preview-file-info__file-field">
            <div className="file-field__field-title">
              Размер
            </div>
            <div className="file-field__field-value">
              {formatFileSize(file.size)}
            </div>
          </div>
          <div className="preview-file-info__file-field">
            <div className="file-field__field-title">
              Дата создания
            </div>
            <div className="file-field__field-value">
              {dayjs(file.createdAt).locale('ru').format('DD.MM.YYYY HH:mm:ss')}
            </div>
          </div>
        </div>
      </div>
    </Drawer>
);
};
