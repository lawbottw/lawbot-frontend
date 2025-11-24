import type { KeyedMutator } from 'swr';
import { FavoriteFolder, FavoriteItem, FolderPathResponse, FolderTreeResponse } from '@/types/favorite';
import { processDocumentUrls } from '@/utils/processDocUrls';
import { createLocalStateUpdaters } from '@/utils/favorite/stateUpdaters';

type ApiClient = {
  get: <T = any>(url: string, options?: any) => Promise<T | null>;
  post: <T = any>(url: string, body?: any, options?: any) => Promise<T | null>;
  put: <T = any>(url: string, body?: any, options?: any) => Promise<T | null>;
  delete: <T = any>(url: string, options?: any) => Promise<T | null>;
};

type UseFavoriteActionsProps = {
  api: ApiClient;
  user: any;
  folders: FavoriteFolder[];
  rawFolders?: FavoriteFolder[];
  mutateData: KeyedMutator<FavoriteFolder[]>;
  mutateFolderTree: KeyedMutator<FolderTreeResponse>;
  broadcastUpdate: (payload: any) => void;
  stateUpdaters: ReturnType<typeof createLocalStateUpdaters>;
  checkFavoriteLimit: (additionalCount?: number) => boolean;
  checkDepthLimit: (parentFolderId: string | null, operationType: 'create' | 'move' | 'copy', subtreeDepth?: number) => boolean;
  getSubtreeMaxDepth: (folderId: string) => number;
  isDeletingRef: React.MutableRefObject<boolean>;
};

export const useFavoriteActions = ({
  api,
  user,
  folders,
  rawFolders,
  mutateData,
  mutateFolderTree,
  broadcastUpdate,
  stateUpdaters,
  checkFavoriteLimit,
  checkDepthLimit,
  getSubtreeMaxDepth,
  isDeletingRef,
}: UseFavoriteActionsProps) => {
  const createFolder = async (folderName: string, parentFolderId?: string | null): Promise<string> => {
    if (!checkDepthLimit(parentFolderId ?? null, 'create')) {
      throw new Error('DEPTH_LIMIT_EXCEEDED');
    }

    const response = await api.post<{ folder_id: string }>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/favorites/folders`,
      { folder_name: folderName, parent_folder_id: parentFolderId }
    );

    if (!response) throw new Error('Failed to create folder');
    const folderId = response.folder_id;

    const newFolder: FavoriteFolder = {
      folder_id: folderId,
      user_id: user!.uid,
      folder_name: folderName,
      parent_folder_id: parentFolderId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      favorites: [],
    };

    mutateData((currentFolders?: FavoriteFolder[]) => stateUpdaters.createFolderUpdate(currentFolders ?? [], newFolder), false);

    setTimeout(() => mutateFolderTree(), 100);
    broadcastUpdate({ type: 'createFolder', payload: newFolder });

    return folderId;
  };

  const deleteFolder = async (folderId: string, recursive?: boolean): Promise<void> => {
    try {
      isDeletingRef.current = true;

      const currentFolders = rawFolders || [];
      let foldersToDelete: string[] = [folderId];

      if (recursive) {
        const findAllDescendants = (parentId: string, foldersData: FavoriteFolder[]): string[] => {
          const children = foldersData.filter((f) => f && f.parent_folder_id === parentId);
          const descendants = [parentId];
          children.forEach((child) => {
            if (child && child.folder_id) {
              descendants.push(...findAllDescendants(child.folder_id, foldersData));
            }
          });
          return descendants;
        };
        foldersToDelete = findAllDescendants(folderId, currentFolders);
      }

      mutateData((currentFolders?: FavoriteFolder[]) => {
        return stateUpdaters.deleteFolderUpdate(currentFolders ?? [], folderId, recursive);
      }, false);

      mutateFolderTree((currentTree: any) => {
        if (!currentTree) return currentTree;

        const removeFromTree = (treeFolders: any[]): any[] => {
          return treeFolders
            .filter((folder: any) => !foldersToDelete.includes(folder.folder_id))
            .map((folder: any) => ({
              ...folder,
              children: folder.children ? removeFromTree(folder.children) : [],
            }));
        };

        return {
          ...currentTree,
          tree: removeFromTree(currentTree.tree),
        };
      }, false);

      await api.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/favorites/folders/${folderId}`);

      broadcastUpdate({ type: 'deleteFolder', payload: { folderId, recursive } });
    } catch (error) {
      mutateData();
      mutateFolderTree();
      throw error;
    } finally {
      isDeletingRef.current = false;
    }
  };

  const updateFolderName = async (folderId: string, newName: string): Promise<void> => {
    await api.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/favorites/folders/${folderId}`, {
      folder_name: newName,
    });

    mutateData(
      (currentFolders?: FavoriteFolder[]) =>
        stateUpdaters.updateFolderNameUpdate(currentFolders ?? [], folderId, newName),
      false
    );

    broadcastUpdate({
      type: 'updateFolderName',
      payload: { folderId, newName, updatedAt: new Date().toISOString() },
    });
  };

  const moveFolder = async (folderId: string, targetParentId?: string | null): Promise<void> => {
    const subtreeDepth = getSubtreeMaxDepth(folderId);
    if (!checkDepthLimit(targetParentId ?? null, 'move', subtreeDepth)) {
      return;
    }

    await api.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/favorites/folders/${folderId}/move`, {
      target_parent_id: targetParentId,
    });

    mutateData(
      (currentFolders?: FavoriteFolder[]) =>
        stateUpdaters.moveFolderUpdate(currentFolders ?? [], folderId, targetParentId),
      false
    );

    broadcastUpdate({ type: 'moveFolder', payload: { folderId, targetParentId } });
  };

  const bulkMoveFolders = async (folderIds: string[], targetParentId?: string | null): Promise<void> => {
    for (const folderId of folderIds) {
      const subtreeDepth = getSubtreeMaxDepth(folderId);
      if (!checkDepthLimit(targetParentId ?? null, 'move', subtreeDepth)) {
        return;
      }
    }

    const result = await api.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/favorites/folders/bulk-move`,
      { folder_ids: folderIds, target_parent_id: targetParentId }
    );

    mutateData(
      (currentFolders?: FavoriteFolder[]) =>
        stateUpdaters.bulkMoveFoldersUpdate(currentFolders ?? [], folderIds, targetParentId),
      false
    );

    mutateFolderTree();
    broadcastUpdate({ type: 'bulkMoveFolders', payload: { folderIds, targetParentId, result } });
  };

  const addFavoriteItem = async (
    folderId: string,
    item: Omit<FavoriteItem, 'favorite_id' | 'favorited_at' | 'url'> & { url?: string }
  ): Promise<void> => {
    if (!checkFavoriteLimit(1)) {
      throw new Error('FAVORITE_LIMIT_REACHED');
    }

    const newFavorite = await api.post<any>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/favorites/folders/${folderId}/favorites`,
      item
    );

    if (!newFavorite) throw new Error('Failed to add favorite');

    mutateData(
      (currentFolders?: FavoriteFolder[]) =>
        stateUpdaters.addFavoriteItemUpdate(currentFolders ?? [], folderId, newFavorite, item),
      false
    );

    const expectedNewItem: FavoriteItem = {
      ...item,
      favorite_id: newFavorite.favorite_id,
      favorited_at: newFavorite.favorited_at || new Date().toISOString(),
      url: item.url,
    };
    const [processedExpectedItem] = processDocumentUrls([expectedNewItem]);
    const finalBroadcastItem = { ...expectedNewItem, ...processedExpectedItem };

    mutateFolderTree();
    broadcastUpdate({ type: 'addFavoriteItem', payload: { folderId, newItem: finalBroadcastItem } });
  };

  const removeFavoriteItem = async (folderId: string | null, favoriteId: string): Promise<void> => {
    const endpoint = folderId
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/favorites/folders/${folderId}/favorites/${favoriteId}`
      : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/favorites/${favoriteId}`;

    await api.delete(endpoint);

    mutateData(
      (currentFolders?: FavoriteFolder[]) =>
        stateUpdaters.removeFavoriteItemUpdate(currentFolders ?? [], folderId, favoriteId),
      false
    );

    mutateFolderTree();
    broadcastUpdate({ type: 'removeFavoriteItem', payload: { folderId, favoriteId } });
  };

  const batchRemoveFavoriteItems = async (folderId: string | null, favoriteIds: string[]): Promise<void> => {
    const endpoint = folderId
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/favorites/folders/${folderId}/favorites/batch`
      : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/favorites/batch`;

    await api.delete(endpoint, {
      body: JSON.stringify({ favorite_ids: favoriteIds }),
    });

    mutateData(
      (currentFolders?: FavoriteFolder[]) =>
        stateUpdaters.batchRemoveFavoriteItemsUpdate(currentFolders ?? [], folderId, favoriteIds),
      false
    );

    mutateFolderTree();
    broadcastUpdate({ type: 'batchRemoveFavoriteItems', payload: { folderId, favoriteIds } });
  };

  const transferFavoriteItems = async (
    sourceFolderId: string,
    targetFolderId: string,
    favoriteIds: string[],
    operationType: 'move' | 'copy'
  ): Promise<void> => {
    if (operationType === 'copy' && !checkFavoriteLimit(favoriteIds.length)) {
      throw new Error('FAVORITE_LIMIT_REACHED');
    }

    const result = await api.post<any>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/favorites/folders/${sourceFolderId}/transfer`,
      {
        target_folder_id: targetFolderId,
        favorite_ids: favoriteIds,
        operation_type: operationType,
      }
    );

    if (!result) throw new Error('Failed to transfer favorites');

    mutateData(
      (currentFolders?: FavoriteFolder[]) =>
        stateUpdaters.transferFavoriteItemsUpdate(
          currentFolders ?? [],
          sourceFolderId,
          targetFolderId,
          favoriteIds,
          operationType,
          result
        ),
      false
    );

    mutateFolderTree();
    broadcastUpdate({
      type: 'transferFavoriteItems',
      payload: { sourceFolderId, targetFolderId, favoriteIds, operationType, newMappings: result.new_mappings },
    });
  };

  const copyFolder = async (
    folderId: string,
    targetParentId: string | null,
    newFolderName: string,
    includeSubfolders: boolean = true,
    includeFavorites: boolean = true
  ): Promise<any> => {
    const subtreeDepth = includeSubfolders ? getSubtreeMaxDepth(folderId) : 1;
    if (!checkDepthLimit(targetParentId, 'copy', subtreeDepth)) {
      throw new Error('DEPTH_LIMIT_EXCEEDED');
    }

    if (includeFavorites) {
      const sourceFolder = folders.find((f) => f.folder_id === folderId);
      if (sourceFolder && sourceFolder.favorites && sourceFolder.favorites.length > 0) {
        if (!checkFavoriteLimit(sourceFolder.favorites.length)) {
          throw new Error('FAVORITE_LIMIT_REACHED');
        }
      }
    }

    const result = await api.post<any>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/favorites/folders/${folderId}/copy`,
      {
        target_parent_id: targetParentId,
        new_folder_name: newFolderName,
        include_subfolders: includeSubfolders,
        include_favorites: includeFavorites,
      }
    );

    if (!result) throw new Error('Failed to copy folder');

    mutateData();

    mutateFolderTree();
    broadcastUpdate({ type: 'copyFolder', payload: { folderId, targetParentId, newFolderName, result } });

    return result;
  };

  const transferItems = async (
    sourceFolderId: string,
    targetFolderId: string,
    selectedItems: Set<string>,
    operationType: 'move' | 'copy'
  ): Promise<void> => {
    const folderIds: string[] = [];
    const favoriteIds: string[] = [];

    selectedItems.forEach((id) => {
      if (id.startsWith('folder-')) {
        folderIds.push(id.replace('folder-', ''));
      } else {
        favoriteIds.push(id);
      }
    });

    if (folderIds.length > 0) {
      const targetParentId = targetFolderId === 'root' ? null : targetFolderId;

      for (const folderId of folderIds) {
        const subtreeDepth = getSubtreeMaxDepth(folderId);
        if (!checkDepthLimit(targetParentId, operationType, subtreeDepth)) {
          return;
        }
      }
    }

    if (operationType === 'copy') {
      let totalFavoritesToCopy = favoriteIds.length;

      folderIds.forEach((folderId) => {
        const folder = folders.find((f: FavoriteFolder) => f.folder_id === folderId);
        if (folder && folder.favorites) {
          totalFavoritesToCopy += folder.favorites.length;
        }
      });

      if (totalFavoritesToCopy > 0 && !checkFavoriteLimit(totalFavoritesToCopy)) {
        throw new Error('FAVORITE_LIMIT_REACHED');
      }
    }

    if (favoriteIds.length > 0) {
      await transferFavoriteItems(sourceFolderId, targetFolderId, favoriteIds, operationType);
    }

    if (folderIds.length > 0) {
      const targetParentId = targetFolderId === 'root' ? null : targetFolderId;

      if (operationType === 'move') {
        await bulkMoveFolders(folderIds, targetParentId);
      } else {
        for (const folderId of folderIds) {
          const sourceFolder = folders.find((f: FavoriteFolder) => f.folder_id === folderId);
          if (sourceFolder) {
            await copyFolder(folderId, targetParentId, sourceFolder.folder_name);
          }
        }
      }
    }

    mutateData();
    mutateFolderTree();
  };

  const getFolderTree = async (includeFavorites?: boolean, maxDepth?: number): Promise<FolderTreeResponse> => {
    const params = new URLSearchParams();
    if (includeFavorites !== undefined) params.append('include_favorites', String(includeFavorites));
    if (maxDepth !== undefined) params.append('max_depth', String(maxDepth));

    const result = await api.get<FolderTreeResponse>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/favorites/folders/tree?${params.toString()}`
    );

    if (!result) throw new Error('Failed to get folder tree');
    return result;
  };

  const getFolderPath = async (folderId: string): Promise<FolderPathResponse> => {
    const result = await api.get<FolderPathResponse>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/favorites/folders/${folderId}/path`
    );

    if (!result) throw new Error('Failed to get folder path');
    return result;
  };

  const getAllFolderContents = async (folderId: string, includeSubfolders?: boolean): Promise<any> => {
    const params = new URLSearchParams();
    if (includeSubfolders !== undefined) params.append('include_subfolders', String(includeSubfolders));

    const result = await api.get<any>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/favorites/folders/${folderId}/contents?${params.toString()}`
    );

    if (!result) throw new Error('Failed to get folder contents');
    return result;
  };

  return {
    createFolder,
    deleteFolder,
    updateFolderName,
    moveFolder,
    bulkMoveFolders,
    addFavoriteItem,
    removeFavoriteItem,
    batchRemoveFavoriteItems,
    transferFavoriteItems,
    transferItems,
    copyFolder,
    getFolderTree,
    getFolderPath,
    getAllFolderContents,
  };
};
