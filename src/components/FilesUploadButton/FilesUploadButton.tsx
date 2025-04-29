import React from 'react';
import { Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { IFilesUploadButtonProps } from 'types/File/file';


export const FilesUploadButton = (props: IFilesUploadButtonProps) => {
  const {
    onUpload,
    onManualUpload,
    inputRef
  } = props;
  return (
    <>
      <Button icon={<UploadOutlined />} onClick={onUpload}>
        Upload Files
      </Button>
      <input
        type="file"
        multiple
        ref={inputRef}
        style={{ display: 'none' }}
        onChange={onManualUpload}
      />
    </>
  );
};
