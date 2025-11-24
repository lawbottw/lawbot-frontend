import { FavoriteFolder, FavoriteItem } from '@/types/favorite';
import { processDocumentUrls } from '../processDocUrls';

// Local state update utilities
export const createLocalStateUpdaters = () => {
  // Create folder local update
  const createFolderUpdate = (
    currentFolders: FavoriteFolder[] = [],
    newFolder: FavoriteFolder
  ): FavoriteFolder[] => {
    if (!Array.isArray(currentFolders)) {
      console.warn('currentFolders is not an array in createFolder:', currentFolders);
      return [newFolder];
    }
    
    if (currentFolders.some(f => f && f.folder_id === newFolder.folder_id)) {
      return currentFolders;
    }
    
    return [...currentFolders, newFolder];
  };

  // Delete folder local update
  const deleteFolderUpdate = (
    currentFolders: FavoriteFolder[] = [],
    folderId: string,
    recursive?: boolean
  ): FavoriteFolder[] => {
    if (!Array.isArray(currentFolders)) {
      console.warn('currentFolders is not an array in deleteFolder:', currentFolders);
      return [];
    }
    
    if (recursive) {
      const findAllDescendants = (parentId: string, folders: FavoriteFolder[]): string[] => {
        try {
          const children = folders.filter(f => f && f.parent_folder_id === parentId);
          const descendants = [parentId];
          children.forEach(child => {
            if (child && child.folder_id) {
              descendants.push(...findAllDescendants(child.folder_id, folders));
            }
          });
          return descendants;
        } catch (error) {
          console.error('Error in findAllDescendants:', error);
          return [parentId];
        }
      };
      
      const idsToRemove = findAllDescendants(folderId, currentFolders);
      return currentFolders.filter(folder => folder && !idsToRemove.includes(folder.folder_id));
    } else {
      return currentFolders.filter(folder => folder && folder.folder_id !== folderId);
    }
  };

  // Update folder name local update
  const updateFolderNameUpdate = (
    currentFolders: FavoriteFolder[] = [],
    folderId: string,
    newName: string
  ): FavoriteFolder[] => {
    if (!Array.isArray(currentFolders)) {
      console.warn('currentFolders is not an array in updateFolderName:', currentFolders);
      return [];
    }
    
    return currentFolders.map(folder => {
      if (folder && folder.folder_id === folderId) {
        return {
          ...folder,
          folder_name: newName,
          updated_at: new Date().toISOString()
        };
      }
      return folder;
    });
  };

  // Move folder local update
  const moveFolderUpdate = (
    currentFolders: FavoriteFolder[] = [],
    folderId: string,
    targetParentId?: string | null
  ): FavoriteFolder[] => {
    if (!Array.isArray(currentFolders)) {
      console.warn('currentFolders is not an array in moveFolder:', currentFolders);
      return [];
    }
    
    return currentFolders.map(folder => {
      if (folder && folder.folder_id === folderId) {
        return {
          ...folder,
          parent_folder_id: targetParentId,
          updated_at: new Date().toISOString()
        };
      }
      return folder;
    });
  };

  // Bulk move folders local update
  const bulkMoveFoldersUpdate = (
    currentFolders: FavoriteFolder[] = [],
    folderIds: string[],
    targetParentId?: string | null
  ): FavoriteFolder[] => {
    if (!Array.isArray(currentFolders)) {
      console.warn('currentFolders is not an array in bulkMoveFolders:', currentFolders);
      return [];
    }
    
    if (!Array.isArray(folderIds)) {
      console.warn('folderIds is not an array in bulkMoveFolders:', folderIds);
      return currentFolders;
    }
    
    const folderIdSet = new Set(folderIds);
    return currentFolders.map(folder => {
      if (folder && folderIdSet.has(folder.folder_id)) {
        return {
          ...folder,
          parent_folder_id: targetParentId,
          updated_at: new Date().toISOString()
        };
      }
      return folder;
    });
  };

  // Add favorite item local update
  const addFavoriteItemUpdate = (
    currentFolders: FavoriteFolder[] = [],
    folderId: string,
    newFavorite: any,
    item: any
  ): FavoriteFolder[] => {
    return currentFolders.map(folder => {
      if (folder.folder_id === folderId) {
        const newItemWithTimestamp: FavoriteItem = {
          ...item,
          favorite_id: newFavorite.favorite_id,
          favorited_at: newFavorite.favorited_at || new Date().toISOString(),
          url: item.url,
        };

        const [processedNewItem] = processDocumentUrls([newItemWithTimestamp]);
        const finalNewItem: FavoriteItem = {
          ...newItemWithTimestamp,
          ...processedNewItem,
        };

        return {
          ...folder,
          favorites: [...(folder.favorites || []), finalNewItem]
        };
      }
      return folder;
    });
  };

  // Remove favorite item local update
  const removeFavoriteItemUpdate = (
    currentFolders: FavoriteFolder[] = [],
    folderId: string | null,
    favoriteId: string
  ): FavoriteFolder[] => {
    return currentFolders.map(folder => {
      if (folderId && folder.folder_id === folderId) {
        return {
          ...folder,
          favorites: folder.favorites.filter(fav => fav.favorite_id !== favoriteId)
        };
      } else if (!folderId) {
        return {
          ...folder,
          favorites: folder.favorites.filter(fav => fav.favorite_id !== favoriteId)
        };
      }
      return folder;
    });
  };

  // Batch remove favorite items local update
  const batchRemoveFavoriteItemsUpdate = (
    currentFolders: FavoriteFolder[] = [],
    folderId: string | null,
    favoriteIds: string[]
  ): FavoriteFolder[] => {
    const favoriteIdSet = new Set(favoriteIds);
    
    return currentFolders.map(folder => {
      if (folderId && folder.folder_id === folderId) {
        return {
          ...folder,
          favorites: folder.favorites.filter(fav => !favoriteIdSet.has(fav.favorite_id))
        };
      } else if (!folderId) {
        return {
          ...folder,
          favorites: folder.favorites.filter(fav => !favoriteIdSet.has(fav.favorite_id))
        };
      }
      return folder;
    });
  };

  // Transfer favorite items local update
  const transferFavoriteItemsUpdate = (
    currentFolders: FavoriteFolder[] = [],
    sourceFolderId: string,
    targetFolderId: string,
    favoriteIds: string[],
    operationType: 'move' | 'copy',
    result: any
  ): FavoriteFolder[] => {
    const favoriteIdSet = new Set(favoriteIds);

    return currentFolders.map(folder => {
      if (folder.folder_id === targetFolderId) {
        const sourceFolder = currentFolders.find(f => f.folder_id === sourceFolderId);
        if (!sourceFolder) return folder;
        
        const itemsToTransfer = sourceFolder.favorites.filter(fav =>
          favoriteIdSet.has(fav.favorite_id)
        );

        if (operationType === 'copy') {
          if (result.new_mappings) {
            const copiedItems = itemsToTransfer.map(item => {
              const newId = result.new_mappings[item.favorite_id];
              return {
                ...item,
                favorite_id: newId || item.favorite_id,
                favorited_at: new Date().toISOString(),
              };
            });
            const processedCopiedItems = processDocumentUrls(copiedItems);

            return {
              ...folder,
              favorites: [...(folder.favorites || []), ...processedCopiedItems]
            };
          } else {
            return {
              ...folder,
              favorites: [...(folder.favorites || []), ...itemsToTransfer]
            };
          }
        } else {
          return {
            ...folder,
            favorites: [...(folder.favorites || []), ...itemsToTransfer]
          };
        }
      }

      if (folder.folder_id === sourceFolderId && operationType === 'move') {
        return {
          ...folder,
          favorites: folder.favorites.filter(fav => !favoriteIdSet.has(fav.favorite_id))
        };
      }
      
      return folder;
    });
  };

  // Copy folder local update
  const copyFolderUpdate = (
    currentFolders: FavoriteFolder[] = [],
    result: any
  ): FavoriteFolder[] => {
    if (!Array.isArray(currentFolders)) {
      console.warn('currentFolders is not an array in copyFolder:', currentFolders);
      return [];
    }
    
    return currentFolders;
  };

  return {
    createFolderUpdate,
    deleteFolderUpdate,
    updateFolderNameUpdate,
    moveFolderUpdate,
    bulkMoveFoldersUpdate,
    addFavoriteItemUpdate,
    removeFavoriteItemUpdate,
    batchRemoveFavoriteItemsUpdate,
    transferFavoriteItemsUpdate,
    copyFolderUpdate
  };
};
