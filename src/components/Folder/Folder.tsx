import React from 'react';
import { FolderFilled } from '@ant-design/icons';
import { IFolderProps } from 'types/Folder/folder';

export const Folder = ({folder, onGoToFolder }: IFolderProps) => {
  return (
    <div
      className="folder"
      onClick={() => onGoToFolder(folder)}
    >
      <div className="folder-icon">
        <FolderFilled style={{fontSize: 70}}/>
      </div>
      <div className="folder-title">
        {folder.name}
      </div>
    </div>
  );
};
