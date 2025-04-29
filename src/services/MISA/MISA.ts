import axios from 'axios';
import { MISA_ROOT_URL } from 'utils/services';


export class MISA {
  static getRootFiles({token}) {
    return axios.get(`${MISA_ROOT_URL}/files`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
  }

  static getFolderContents({token, folderId}) {
    return axios.get(`${MISA_ROOT_URL}/folders`, {
      params: {
        folderId
      },
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
  }

  static resolveFolderPath({token, path}) {
    return axios.get(`${MISA_ROOT_URL}/folders/resolve`, {
      params: {
        path
      },
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
  }

  static getImageThumbnail({token, fileId}) {
    return axios.get(`${MISA_ROOT_URL}/files/${fileId}/thumb`, {
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
  }

  static uploadFiles({token, files}) {
    return axios.post(`${MISA_ROOT_URL}/files/upload`, files, {
      headers: {
        Authorization: `Bearer ${token}`,
        ContentType: "multipart/form-data",
      }
    });
  }

  static deleteFile({token, fileId}) {
    return axios.delete(`${MISA_ROOT_URL}/files/${fileId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
  }

  static downloadFile({token, fileId}) {
    return axios.get(`${MISA_ROOT_URL}/files/download/${fileId}`, {
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
  }

  static moveFile({token, fileId, folderId}) {
    return axios.post(`${MISA_ROOT_URL}/files/move`,
      { fileId, folderId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    );
  }

  static moveFolder({token, folderId, newParentFolderId}) {
    return axios.post(`${MISA_ROOT_URL}/folders/move`, {folderId, newParentFolderId}, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
  }

  static createFolder({token, folderName, parentFolderId}) {
    return axios.post(`${MISA_ROOT_URL}/folders/create`,
      { name: folderName, parentFolderId, },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    );
  }

  static renameFolder({token, folderId, newName}) {
    return axios.post(`${MISA_ROOT_URL}/folders/${folderId}/rename`,
      { newName},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    );
  }

  static deleteFolder({token, folderId}) {
    return axios.delete(`${MISA_ROOT_URL}/folders/${folderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
  }
}
