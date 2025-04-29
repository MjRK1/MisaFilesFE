import React from 'react';
import { IFileProps } from 'types/File/file';
import cn from 'classnames';
import { textSliced } from 'utils/helpers';
import { Tooltip } from 'antd';
import { FilePreviewDrawer } from 'components/FilePreviewDrawer';


export const FileItem = ({ file, onFileDelete, onDownloadFile}: IFileProps) => {
  const [isPreviewOpen, setPreviewOpen] = React.useState(false);

  return (
    <>
      <div
        className="file"
        onDoubleClick={() => setPreviewOpen(true)}
      >
        <div
          className={cn('file-icon', {
            'file-icon--image': file.mimeType.split('/')[0] === 'image',
            'file-icon--other': file.mimeType.split('/')[0] !== 'image',
          })}
        >
          {file.icon}
        </div>
        <Tooltip
          title={file.name.length > 20 ? file.name : null}
          color="var(--color-ecru)"
          placement="bottom"
        >
          <div className="file-name">
            {textSliced(file.name, 20)}
          </div>
        </Tooltip>
      </div>
      <FilePreviewDrawer
        open={isPreviewOpen}
        onClose={() => setPreviewOpen(false)}
        file={file}
        onDelete={onFileDelete}
        onDownloadFile={onDownloadFile}
      />
    </>
  );
};
