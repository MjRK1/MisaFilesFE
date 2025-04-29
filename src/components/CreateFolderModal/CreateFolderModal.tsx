import React, { useState } from 'react';
import { Modal } from 'commonComponents/Modal';
import { InputText } from 'commonComponents/Input/inputText';
import { IFolderInstrumentsModalProps } from 'types/FilesHomePage/FilesHomePage';
import { useAuth } from 'hooks/AuthProvider';
import { MISA } from 'services/MISA/MISA';


export const CreateFolderModal = (props: IFolderInstrumentsModalProps) => {
  const {
    isOpen,
    setLoading,
    setOpen,
    getFolderContents,
    currentFolderId,
  } = props;

  const [name, setName] = useState(null);
  const [error, setError] = useState(null);
  const [isModalLoading, setModalLoading] = useState(false);

  const { accessToken } = useAuth();

  const handleCreateFolder = () => {
    setModalLoading(true);
    if (!name?.length || name === null) {
      setError("Пожалуйста введите название");
      setModalLoading(false);
      return;
    }
    MISA.createFolder({
      token: accessToken,
      folderName: name,
      parentFolderId: currentFolderId ?? null,
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
      title="Создать папку"
      withCross
      withSuccess
      successText="Создать"
      onClose={() => setOpen(false)}
      successLoading={isModalLoading}
      onSuccess={() => handleCreateFolder()}
      width={600}
    >
      <div className="create-folder-modal">
        <div className="create-field">
          <div className="create-field__create-field-title">
            Наименование папки
          </div>
          <div className="create-field__create-field-input">
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
        <div className="create-folder-modal__error-text">
          {error}
        </div>
      </div>
    </Modal>
  );
};
