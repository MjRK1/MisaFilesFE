import React, { Ref } from 'react';

export interface IFile {
  id: string,
  name: string,
  size: number,
  mimeType: string,
  icon: React.ReactNode,
  type: string,
  createdAt: Date,
}


export interface IFileProps {
  file: IFile,
  onFileDelete: (fileId: string) => void,
  onDownloadFile: (fileId: string, fileName: string) => void,
}

export interface IFilesUploadButtonProps {
  onUpload: () => void,
  onManualUpload: (e: React.ChangeEvent<HTMLInputElement>) => void,
  inputRef: Ref<HTMLInputElement>
}

export interface IFilePreviewDrawerProps {
  open: boolean;
  onClose: () => void;
  file: IFile,
  onDelete: (fileId: string) => void;
  onDownloadFile: (fileId: string, fileName: string) => void;
}
