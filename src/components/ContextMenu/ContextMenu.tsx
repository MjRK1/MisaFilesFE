import React from 'react';
import { IContextMenuProps } from 'types/ContextMenu/ContextMenu';
import { motion } from 'motion/react';


export const ContextMenu = (props: IContextMenuProps) => {
  const {
    contextMenu,
    contextRef,
    onOpenCreateFolder,
    onOpenRenameFolder,
    onDeleteFolder,
    onDeleteFile,
    onDownloadFile,
    setContextMenu,
  } = props;

  if (!contextMenu) return;

  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.95,
        top: contextMenu.y - 25,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        top: contextMenu.y
      }}
      exit={{
        opacity: 0,
        scale: 0.95,
        top: contextMenu.y - 25
      }}
      transition={{ duration: 0.15 }}
      className='context-menu'
      style={{
        position: 'fixed',
        top: contextMenu.y,
        left: contextMenu.x,
      }}
      ref={contextRef}
    >
      {contextMenu.type === null && (
        <div
          onClick={() => {
            onOpenCreateFolder();
          }}
          className="menu-item"
        >
          📁 Создать папку
        </div>
      )}
      {contextMenu.type === 'folder' && (
        <>
          <div
            onClick={() => onOpenRenameFolder(contextMenu.id, contextMenu.name)}
            className="menu-item">
            ✏️ Переименовать папку
          </div>
          <div className="menu-item-separator" />
          <div
            onClick={() => onDeleteFolder(contextMenu.id)}
            className="menu-item">
            🗑️ Удалить папку
          </div>
        </>
      )}
      {contextMenu.type === 'file' && (
        <>
          <div
            onClick={() => {
              onDownloadFile(contextMenu.id, contextMenu.name);
              setContextMenu(null);
            }}
            className="menu-item"
          >
            ⬇️ Скачать файл
          </div>
          <div className="menu-item-separator" />
          <div
            onClick={() => {
              onDeleteFile(contextMenu.id);
              setContextMenu(null);
            }}
            className="menu-item"
          >
            🗑️ Удалить файл
          </div>
        </>
      )}
    </motion.div>
  );
};
