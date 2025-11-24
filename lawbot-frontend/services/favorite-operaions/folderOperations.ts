import { 
  CreateFolderRequest, 
  MoveFolderRequest, 
  BulkMoveFoldersRequest } from '@/types/favorite';

type ApiInstance = {
  get: <T = any>(url: string, options?: any) => Promise<T | null>;
  post: <T = any>(url: string, body?: any, options?: any) => Promise<T | null>;
  put: <T = any>(url: string, body?: any, options?: any) => Promise<T | null>;
  delete: <T = any>(url: string, options?: any) => Promise<T | null>;
};

// Create Folder
export const createFolder = async (
  api: ApiInstance,
  folderName: string, 
  parentFolderId?: string | null
): Promise<string> => {
  console.log('[FavoriteContext] createFolder called', { folderName, parentFolderId })

  const requestBody: CreateFolderRequest = {
    folder_name: folderName,
    parent_folder_id: parentFolderId
  };

  console.log('[FavoriteContext] Sending create folder request', { requestBody })
  const result = await api.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/favorites/folders`,
    requestBody
  );
  
  if (!result) {
    throw new Error('Failed to create folder');
  }
  
  console.log('[FavoriteContext] Create folder response', { result })
  
  return result.folder_id;
};

// Delete Folder
export const deleteFolder = async (
  api: ApiInstance,
  folderId: string, 
): Promise<void> => {
  try {
    await api.delete(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/favorites/folders/${folderId}`
    );
  } catch (err: any) {
    let errorMessage = 'Failed to delete folder';
    if (err.status === 409 || err.status === 400) {
      errorMessage = '無法刪除資料夾：請先刪除所有子資料夾後再試';
    } else if (err.info?.message) {
      errorMessage = err.info.message;
    }
    throw new Error(errorMessage);
  }
};

// Update Folder Name
export const updateFolderName = async (
  api: ApiInstance,
  folderId: string, 
  newName: string
): Promise<void> => {
  console.log('[FavoriteContext] updateFolderName called', { folderId, newName })

  console.log('[FavoriteContext] Sending update folder name request')
  const result = await api.put(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/favorites/folders/${folderId}`,
    { folder_name: newName }
  );
  
  if (result === null || result === undefined) {
    // PUT request successful
    console.log('[FavoriteContext] Update folder name response received')
    return;
  }
};

// Move Folder
export const moveFolder = async (
  api: ApiInstance,
  folderId: string, 
  targetParentId?: string | null
): Promise<void> => {
  console.log('[FavoriteContext] moveFolder called', { folderId, targetParentId })

  const requestBody: MoveFolderRequest = {
    target_parent_id: targetParentId
  };

  console.log('[FavoriteContext] Sending move folder request', { requestBody })
  await api.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/favorites/folders/${folderId}/move`,
    requestBody
  );

  console.log('[FavoriteContext] Move folder response received')
};

// Bulk Move Folders
export const bulkMoveFolders = async (
  api: ApiInstance,
  folderIds: string[], 
  targetParentId?: string | null
): Promise<any> => {
  const requestBody: BulkMoveFoldersRequest = {
    folder_ids: folderIds,
    target_parent_id: targetParentId
  };

  const result = await api.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/favorites/folders/bulk-move`,
    requestBody
  );

  if (!result) {
    throw new Error('Failed to bulk move folders');
  }

  return result;
};

// Copy Folder
export const copyFolder = async (
  api: ApiInstance,
  folderId: string,
  targetParentId: string | null,
  newFolderName: string,
  includeSubfolders: boolean = true,
  includeFavorites: boolean = true
): Promise<any> => {
  console.log('[FavoriteContext] copyFolder called', { folderId, targetParentId, newFolderName, includeSubfolders, includeFavorites })

  const requestBody = {
    target_parent_id: targetParentId,
    new_folder_name: newFolderName,
    include_subfolders: includeSubfolders,
    include_favorites: includeFavorites
  };

  console.log('[FavoriteContext] Sending copy folder request', { requestBody })
  const result = await api.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/favorites/folders/${folderId}/copy`,
    requestBody
  );

  if (!result) {
    throw new Error('Failed to copy folder');
  }

  console.log('[FavoriteContext] Copy folder response', { result })
  return result;
};
