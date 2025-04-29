export interface IFolderInstrumentsModalProps {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  getFolderContents: (folderId: string) => void;
  folderName?: string;
  folderId?: string;
  currentFolderId: string | null;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
