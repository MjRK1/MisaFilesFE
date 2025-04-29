export interface IFolder {
  id: string;
  name: string;
  parentFolderId: string;
  type: string;
}

export interface IFolderProps {
  folder: IFolder,
  onGoToFolder: (folder: IFolder) => void,
}
