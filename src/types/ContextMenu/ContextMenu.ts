import React from 'react';

export interface IContextMenu {
  x: number;
  y: number;
  type: 'folder' | 'file' | null,
  id: string | null,
  name: string | null,
}

export interface IContextMenuProps {
  contextMenu: IContextMenu;
  contextRef: React.RefObject<HTMLDivElement>;
  onOpenCreateFolder: () => void;
  onOpenRenameFolder: (id: string, name: string) => void;
  onDeleteFolder: (folderId: string) => void;
  onDownloadFile: (fileId: string, fileName: string) => void;
  onDeleteFile: (fileId: string) => void;
  setContextMenu: React.Dispatch<React.SetStateAction<IContextMenu>>;
}
