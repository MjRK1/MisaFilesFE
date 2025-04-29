import React, { useEffect, useState } from 'react';
import { Modal } from 'commonComponents/Modal';
import { InputText } from 'commonComponents/Input/inputText';
import { IFolderInstrumentsModalProps } from 'types/FilesHomePage/FilesHomePage';
import { useAuth } from 'hooks/AuthProvider';
import { MISA } from 'services/MISA/MISA';


export const RenameFolderModal = (props: IFolderInstrumentsModalProps) => {
  const {
    isOpen,
    setLoading,
    setOpen,
    getFolderContents,
    currentFolderId,
    folderId,
    folderName,
  } = props;

  const [name, setName] = useState(folderName);
  const [error, setError] = useState(null);
  const [isModalLoading, setModalLoading] = useState(false);
  useEffect(() => {
    setName(folderName);
  }, [folderName]);
  const { accessToken } = useAuth();

  const handleRenameFolder = () => {
    setModalLoading(true);
    if (!name?.length || name === null) {
      setError("Пожалуйста введите название");
      setModalLoading(false);
      return;
    }
    MISA.renameFolder({
      token: accessToken,
      newName: name,
      folderId: folderId,
    })
      .then(() => {
        setLoading(true);
        setModalLoading(false);
        getFolderContents(currentFolderId);
        setOpen(false);
      })
      .catch((e) => {
        setError(e.response?.data?.message);
        setModalLoading(false);
      });
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Переименовать папку"
      withCross
      withSuccess
      successText="Переименовать"
      onClose={() => setOpen(false)}
      successLoading={isModalLoading}
      onSuccess={() => handleRenameFolder()}
      width={600}
    >
      <div className="rename-folder-modal">
        <div className="rename-field">
          <div className="rename-field__rename-field-title">
            Наименование папки
          </div>
          <div className="rename-field__rename-field-input">
            <InputText
              placeholder="Введите название папки"
              value={name}
              status={error ? 'error' : null}
              onChange={(e) => {
                setError(null);
                setName(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="rename-folder-modal__error-text">
          {error}
        </div>
      </div>
    </Modal>
  );
};
