import React from 'react';
import { InboxOutlined } from '@ant-design/icons';


export const FilesDrag = () => {
  return (
    <div className="drag-overlay">
      <div className="drag-overlay__drag-info">
        <div className="drag-overlay__icon">
          <InboxOutlined />
        </div>
        <div className="drag-overlay__title">
          Кидайте файлы сюда :)
        </div>
      </div>
    </div>
  );
};
