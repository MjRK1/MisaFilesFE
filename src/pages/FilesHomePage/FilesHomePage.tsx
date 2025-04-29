import React, { useEffect, useRef, useState } from 'react';
import { IFolder } from 'types/Folder/folder';
import { IFile } from 'types/File/file';
import { message, Spin } from 'antd';
import { MISA } from 'services/MISA/MISA';
import { useAuth } from 'hooks/AuthProvider';
import { Folder } from 'components/Folder';
import { FileItem } from 'components/FileItem';
import { useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { PathBreadCrumbs } from 'components/PathBreadcrumbs';
import {
  ArrowLeftOutlined,
  FileFilled,
  FileTextFilled,
  FileUnknownFilled,
  FileZipFilled,
} from '@ant-design/icons';
import { FilesDrag } from 'components/FilesDrag';
import { FilesUploadButton } from 'components/FilesUploadButton';
import { IContextMenu } from 'types/ContextMenu/ContextMenu';
import { ContextMenu } from 'components/ContextMenu';
import { createPortal } from 'react-dom';
import { CreateFolderModal } from 'components/CreateFolderModal';
import { RenameFolderModal } from 'components/RenameFolderModal';

const FILE_ICONS_ENUM = {
  text: <FileTextFilled />,
  video: <FileFilled />,
  audio: <FileFilled />,
  application: <FileZipFilled />
};


export const FilesHomePage = () => {
  const [isInternalDragging, setInternalDragging] = useState<boolean>(false);
  const [content, setContent] = useState<(IFile | IFolder)[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [isDragging, setDragging] = useState(false);
  const [currentFolder, setCurrentFolder] = React.useState<IFolder | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const {'*': pathParam} = useParams();
  const { accessToken } = useAuth();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const dragZoneRef = useRef(null);
  const prevFolder = useRef(null);
  const contextRef = useRef(null);
  const currentPath = pathParam || null;
  const [contextMenu, setContextMenu] = useState<IContextMenu | null>(null);
  const [renamedFolder, setRenamedFolder] = React.useState(null);
  const [isCreateFolderOpen, setCreateFolderOpen] = React.useState(false);
  const [isRenameFolderOpen, setRenameFolderOpen] = React.useState(false);

  const getFolderContents = (folderId: string | null) => {
    MISA.getFolderContents({token: accessToken, folderId })
      .then(async (data) => {
        let contents = data.data;
        let newFolders = contents.folders.map(item => ({
          ...item,
          type: 'folder'
        }));
        let newFiles = await Promise.all(
          contents.files.map(async (item) => {
            if (item?.mimeType.split('/')[0] === 'image') {
              let thumbResponse = await MISA.getImageThumbnail({
                token: accessToken,
                fileId: item.id
              });
              let thumbImage = URL.createObjectURL(thumbResponse.data);
              return {
                ...item,
                type: 'file',
                icon: <img src={thumbImage} alt={`${item.name}-image`} draggable={false} />
              };
            }
            return {
              ...item,
              type: 'file',
              icon: FILE_ICONS_ENUM[item?.mimeType.split('/')[0]] ?? <FileUnknownFilled />
            };
          })
        );
        setContent([...newFolders, ...newFiles]);
        setIsLoading(false);
      })
      .catch(() => {
        messageApi.open({
          type: 'error',
          content: 'Ошибка загрузки файлов'
        });
        setIsLoading(false);
      });
  };

  useEffect(() => {
    setIsLoading(true);
    if (currentPath) {
      MISA.resolveFolderPath({token: accessToken, path: currentPath})
        .then((data) => {
         let folderId = data.data.id;
          getFolderContents(folderId);
          setCurrentFolder({ ...data.data });
        })
        .catch((e) => {
          messageApi.open({
            type: 'error',
            content: e?.response?.data?.message
          });
          navigate(`/core/modules/MisaFiles`,);
        });
    } else {
      getFolderContents(null);
    }
  }, [accessToken, currentPath]);

  useEffect(() => {
    if (currentPath === null) setCurrentFolder(null);
  }, [currentPath]);

  const handleDragOver = (e: React.DragEvent) => {
    if (isInternalDragging) return;
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    if (isInternalDragging) return;

    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    if (isInternalDragging) return;


    e.preventDefault();
    e.stopPropagation();
    setDragging(false);

    const files = [...e.dataTransfer.files];
    if (files.length === 0) return;

    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('files', file);
    });
    if (currentPath !== null) {
      // @ts-ignore
      formData.append('folderId', currentFolder.id);
    }
    messageApi.open({
      type: 'loading',
      key: 'files_loading',
      content: "Загрузка файлов"
    });

    MISA.uploadFiles({token: accessToken, files: formData})
      .then(() => {
        setTimeout(() => messageApi.destroy("files_loading"), 0);
        messageApi.open({
          type: 'success',
          content: 'Файлы загружены'
        });
        getFolderContents(currentFolder?.id ?? null);
      })
      .catch((e) => {
        setTimeout(() => messageApi.destroy("files_loading"), 0);
        messageApi.open({
          type: 'error',
          content: e?.response?.data?.message
        });
      });
  };

  const handleGoToFolder = (folder) => {
    if (isInternalDragging) return;
    setCurrentFolder(folder);
    navigate(`${folder.name}`);
  };

  const handleUpload = () => {
    // @ts-ignore
    inputRef.current.click();
  };

  const handleManualUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {files} = e.target;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('files', file);
    });
    if (currentPath !== null) {
      // @ts-ignore
      formData.append('folderId', currentFolder.id);
    }
    messageApi.open({
      type: 'loading',
      key: 'files_loading',
      content: "Загрузка файлов"
    });

    MISA.uploadFiles({token: accessToken, files: formData})
      .then(() => {
        setTimeout(() => messageApi.destroy("files_loading"), 0);
        messageApi.open({
          type: 'success',
          content: 'Файлы загружены'
        });
        getFolderContents(currentFolder?.id ?? null);
      })
      .catch((e) => {
        setTimeout(() => messageApi.destroy("files_loading"), 0);
        messageApi.open({
          type: 'error',
          content: e?.response?.data?.message
        });
      });
  };

  const handleDeleteFile = (fileId: string) => {
    // setIsLoading(true);
    messageApi.open({
      type: 'loading',
      key: 'file_delete',
      content: "Удаление файла"
    });
    MISA.deleteFile({token: accessToken, fileId})
      .then((data) => {
        setTimeout(() => messageApi.destroy("file_delete"), 0);
        messageApi.open({
          type: 'success',
          content: data.data.message
        });
        getFolderContents(currentFolder?.id ?? null);
      })
      .catch((e) => {
        setTimeout(() => messageApi.destroy("file_delete"), 0);
        messageApi.open({
          type: 'error',
          content: e?.response?.data?.message
        });
        setIsLoading(false);
      });
  };

  const handleDownloadFile = (fileId: string, fileName: string) => {
    MISA.downloadFile({token: accessToken, fileId: fileId})
      .then((data) => {
        const url = window.URL.createObjectURL(data.data);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute(
          'download',
          `${fileName}`,
        );

        // Append to html link element page
        document.body.appendChild(link);

        // Start download
        link.click();

        // Clean up and remove the link
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch((e) => {
        messageApi.open({
          type: 'error',
          content: e?.response?.data?.message
        });
      });
  };

  const findFolderUnderPoint = (point) => {
    if (prevFolder !== null && prevFolder.current !== null) {
      // @ts-ignore
      const backRect = prevFolder.current.getBoundingClientRect();
      if (
        point.x >= backRect.left &&
        point.x <= backRect.right &&
        point.y >= backRect.top &&
        point.y <= backRect.bottom
      ) {
        if (currentFolder !== null) {
          return { id: currentFolder.parentFolderId ?? null };
        }
      }
    }
    const folders = document.querySelectorAll('.draggable-folder');
    for (const folder of folders) {
      const rect = folder.getBoundingClientRect();
      if (
        point.x >= rect.left &&
        point.x <= rect.right &&
        point.y >= rect.top &&
        point.y <= rect.bottom
      ) {
        // @ts-ignore
        return JSON.parse(folder.dataset.folder); // В data-folder лежит info о папке
      }
    }

    return null;
  };

  const handleMoveItem = async (item, point) => {
    const targetFolder = findFolderUnderPoint(point);
    if (!targetFolder) {
      messageApi.open({
        type: 'info',
        content: 'Перемещение отменено: папка не выбрана',
      });
      return;
    }
    if (item.type === 'file') {
      // setIsLoading(true);
      MISA.moveFile({token: accessToken, fileId: item.id, folderId: targetFolder.id ?? null})
        .then(() => {
          getFolderContents(currentFolder?.id ?? null);
        })
        .catch((e) => {
          messageApi.open({
            type: 'error',
            content: e?.response?.data?.message
          });
          setIsLoading(false);
        });
    } else {
      // setIsLoading(true);
      MISA.moveFolder({token: accessToken, folderId: item.id, newParentFolderId: targetFolder.id})
        .then(() => {
          getFolderContents(currentFolder?.id ?? null);
        })
        .catch((e) => {
          messageApi.open({
            type: 'error',
            content: e?.response?.data?.message
          });
          setIsLoading(false);
        });
    }
  };

  const handleGoToPreviousFolder = () => {
    if (currentPath !== null) {
      const folderPath = currentPath.split('/').filter(Boolean);
      if (folderPath?.length > 1) {
        const folderIndex = folderPath.indexOf(currentFolder.name);
        const link = `/core/modules/MisaFiles/home/${folderPath.slice(0, folderIndex - 1).join('/')}`;
        navigate(link);
      } else {
        navigate("/core/modules/MisaFiles/home");
      }
    } else {
      navigate("/core/modules/MisaFiles/home");
    }
  };

  const handleContextMenu = (
    e: React.MouseEvent,
    type: 'folder' | 'file' | null = null,
    id: string | null = null,
    name: string | null = null
  ) => {
    e.stopPropagation();
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      type,
      id,
      name
    });
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (contextRef.current && !contextRef.current.contains(e.target as Node)) {
        setContextMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOpenCreateFolder = () => {
    setCreateFolderOpen(true);
    setContextMenu(null);
  };

  const handleOpenRenameFolder = (id: string, name: string) => {
    setRenameFolderOpen(true);
    setRenamedFolder({id, name});
    setContextMenu(null);
  };

  const handleDeleteFolder = (folderId: string) => {
    // setIsLoading(true);
    setContextMenu(null);
    messageApi.open({
      type: 'loading',
      key: 'folder_delete',
      content: "Удаление файла"
    });
    MISA.deleteFolder({token: accessToken, folderId})
      .then((data) => {
        setTimeout(() => messageApi.destroy("folder_delete"), 0);
        messageApi.open({
          type: 'success',
          content: data.data.message
        });
        getFolderContents(currentFolder?.id ?? null);
      })
      .catch((e) => {
        setTimeout(() => messageApi.destroy("folder_delete"), 0);
        messageApi.open({
          type: 'error',
          content: e?.response?.data?.message ?? 'Ошибка удаления'
        });
      });
  };

  const renderFilesList = () => {
    if (isLoading) {
      return <Spin size="large" />;
    }
    return (
      <div
        className="files-home-page"
        onContextMenu={(e) => {
          handleContextMenu(e, null, null, null);
        }}
      >
        {currentFolder && (
          <div
            className="files-home-page__current-folder-name"
          >
            <div
              className="current-folder-name__back-icon"
              ref={prevFolder}
              onClick={() => handleGoToPreviousFolder()}
              style={{
                backgroundColor: isInternalDragging ? 'rgba(255,255,255,0.2)' : undefined
              }}
            >
              <ArrowLeftOutlined />
            </div>
            <div className="current-folder-name__title">
              {currentFolder.name}
            </div>
          </div>
        )}
        <div className="files-home-page__content-list">
          {content.map((item) => {
            if (item.type === 'folder') return (
              <motion.div
                key={item.id}
                className="draggable-folder"
                drag
                dragSnapToOrigin
                dragConstraints={dragZoneRef}
                onDragStart={() => setInternalDragging(true)}
                onDragEnd={(_, info) => {
                  setInternalDragging(false);
                  handleMoveItem(item, info.point);
                }}
                onContextMenu={
                (e) => {
                  handleContextMenu(e, item.type as 'folder' | 'file', item.id, item.name);
                }}
                data-folder={JSON.stringify(item)}
              >
                <Folder
                  folder={item as IFolder}
                  onGoToFolder={handleGoToFolder}
                />
              </motion.div>
            );
            return (
              <motion.div
                key={item.id}
                className="draggable-file"
                drag
                dragSnapToOrigin
                dragConstraints={dragZoneRef}
                onDragStart={() => setInternalDragging(true)}
                onDragEnd={(_, info) => {
                  setInternalDragging(false);
                  handleMoveItem(item, info.point);
                }}
                onContextMenu={
                  (e) => {
                    handleContextMenu(e, item.type as 'folder' | 'file', item.id, item.name);
                  }}
              >
                <FileItem
                  file={item as IFile}
                  onFileDelete={handleDeleteFile}
                  onDownloadFile={handleDownloadFile}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };


  return (
    <>
      <div
        className="files-home-page-wrapper"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        ref={dragZoneRef}
      >
        <AnimatePresence>
          <ContextMenu
            contextMenu={contextMenu}
            contextRef={contextRef}
            onOpenCreateFolder={handleOpenCreateFolder}
            onOpenRenameFolder={handleOpenRenameFolder}
            onDeleteFolder={handleDeleteFolder}
            onDownloadFile={handleDownloadFile}
            onDeleteFile={handleDeleteFile}
            setContextMenu={setContextMenu}
          />
        </AnimatePresence>
        {isDragging && (
          <FilesDrag />
        )}
        {contextHolder}
        <div className="files-home-page__header">
          <PathBreadCrumbs />
          <FilesUploadButton
            onUpload={handleUpload}
            onManualUpload={handleManualUpload}
            inputRef={inputRef}
          />
        </div>
        {renderFilesList()}
      </div>
      {createPortal(
        <CreateFolderModal
          isOpen={isCreateFolderOpen}
          setOpen={setCreateFolderOpen}
          getFolderContents={getFolderContents}
          currentFolderId={currentFolder?.id ?? null}
          setLoading={setIsLoading}
        />,
        document.body
      )}
      {createPortal(
        <RenameFolderModal
          isOpen={isRenameFolderOpen}
          setOpen={setRenameFolderOpen}
          getFolderContents={getFolderContents}
          currentFolderId={currentFolder?.id ?? null}
          setLoading={setIsLoading}
          folderName={renamedFolder?.name ?? null}
          folderId={renamedFolder?.id}
        />,
        document.body
      )}
    </>
  );
};
