import { useEffect } from 'react';
import type { KeyedMutator } from 'swr';
import { FavoriteFolder, FavoriteItem, FolderTreeResponse } from '@/types/favorite';
import { processDocumentUrls } from '@/utils/processDocUrls';

type BroadcastProps = {
  authUser: any;
  mutateData: KeyedMutator<FavoriteFolder[]>;
  mutateFolderTree: KeyedMutator<FolderTreeResponse>;
  broadcastChannelRef: React.RefObject<BroadcastChannel | null>;
};

export const FAVORITES_CHANNEL_NAME = 'favorites_update_channel';

const createMessageHandler = ({
  authUser,
  mutateData,
  mutateFolderTree,
}: Omit<BroadcastProps, 'broadcastChannelRef'>) => {
  return (event: MessageEvent) => {
    try {
      if (!event.data || !event.data.type) {
        return;
      }

      const { type, payload } = event.data;

      if (!payload) {
        console.warn('Received broadcast message without payload:', event.data);
        return;
      }

      if (payload.senderId === authUser?.uid) {
        return;
      }

      mutateData((currentFolders?: FavoriteFolder[]) => {
        const safeFolders = Array.isArray(currentFolders) ? currentFolders : [];
        if (!Array.isArray(currentFolders)) {
          console.warn('currentFolders is not an array:', currentFolders);
        }

        try {
          switch (type) {
            case 'createFolder': {
              if (safeFolders.some((f) => f && f.folder_id === payload.folder_id)) {
                return safeFolders;
              }
              return [...safeFolders, payload];
            }
            case 'deleteFolder': {
              if (payload.recursive) {
                const findAllDescendants = (
                  parentId: string,
                  folders: FavoriteFolder[]
                ): string[] => {
                  try {
                    const children = folders.filter((f) => f && f.parent_folder_id === parentId);
                    const descendants = [parentId];
                    children.forEach((child) => {
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

                const idsToRemove = findAllDescendants(payload.folderId, safeFolders);
                const updatedFolders = safeFolders.filter((f) => f && !idsToRemove.includes(f.folder_id));
                return updatedFolders.length === 0 ? [] : updatedFolders;
              }

              const updatedFolders = safeFolders.filter((f) => f && f.folder_id !== payload.folderId);
              return updatedFolders.length === 0 ? [] : updatedFolders;
            }
            case 'updateFolderName': {
              return safeFolders.map((f) =>
                f && f.folder_id === payload.folderId
                  ? { ...f, folder_name: payload.newName, updated_at: payload.updatedAt }
                  : f
              );
            }
            case 'moveFolder': {
              return safeFolders.map((f) =>
                f && f.folder_id === payload.folderId
                  ? { ...f, parent_folder_id: payload.targetParentId, updated_at: new Date().toISOString() }
                  : f
              );
            }
            case 'bulkMoveFolders': {
              if (!Array.isArray(payload.folderIds)) {
                console.warn('payload.folderIds is not an array:', payload.folderIds);
                return safeFolders;
              }
              const folderIdSet = new Set(payload.folderIds);
              return safeFolders.map((f) =>
                f && folderIdSet.has(f.folder_id)
                  ? { ...f, parent_folder_id: payload.targetParentId, updated_at: new Date().toISOString() }
                  : f
              );
            }
            case 'addFavoriteItem': {
              return safeFolders.map((f) => {
                if (f && f.folder_id === payload.folderId) {
                  if (f.favorites?.some((fav) => fav && fav.favorite_id === payload.newItem?.favorite_id)) {
                    return f;
                  }
                  return { ...f, favorites: [...(f.favorites || []), payload.newItem] };
                }
                return f;
              });
            }
            case 'removeFavoriteItem': {
              return safeFolders.map((f) => {
                if (!f) return f;
                if (payload.folderId && f.folder_id === payload.folderId) {
                  return {
                    ...f,
                    favorites: f.favorites?.filter((fav) => fav && fav.favorite_id !== payload.favoriteId) || [],
                  };
                }
                if (!payload.folderId) {
                  return {
                    ...f,
                    favorites: f.favorites?.filter((fav) => fav && fav.favorite_id !== payload.favoriteId) || [],
                  };
                }
                return f;
              });
            }
            case 'batchRemoveFavoriteItems': {
              if (!Array.isArray(payload.favoriteIds)) {
                console.warn('payload.favoriteIds is not an array:', payload.favoriteIds);
                return safeFolders;
              }
              const favoriteIdSet = new Set(payload.favoriteIds);
              return safeFolders.map((f) => {
                if (!f) return f;
                if (payload.folderId && f.folder_id === payload.folderId) {
                  return {
                    ...f,
                    favorites: f.favorites?.filter((fav) => fav && !favoriteIdSet.has(fav.favorite_id)) || [],
                  };
                }
                if (!payload.folderId) {
                  return {
                    ...f,
                    favorites: f.favorites?.filter((fav) => fav && !favoriteIdSet.has(fav.favorite_id)) || [],
                  };
                }
                return f;
              });
            }
            case 'transferFavoriteItems': {
              const { sourceFolderId, targetFolderId, favoriteIds, operationType, newMappings } = payload;

              if (!Array.isArray(favoriteIds)) {
                console.warn('payload.favoriteIds is not an array:', favoriteIds);
                return safeFolders;
              }

              const favoriteIdSet = new Set(favoriteIds);

              let itemsToTransfer: FavoriteItem[] = [];
              const sourceFolder = safeFolders.find((f) => f && f.folder_id === sourceFolderId);
              if (sourceFolder?.favorites) {
                itemsToTransfer = sourceFolder.favorites.filter((fav) => fav && favoriteIdSet.has(fav.favorite_id));
              }

              return safeFolders.map((folder) => {
                if (!folder) return folder;

                if (folder.folder_id === targetFolderId) {
                  let processedItemsToAdd: FavoriteItem[] = [];
                  if (operationType === 'copy' && newMappings) {
                    const copiedItems = itemsToTransfer.map((item) => ({
                      ...item,
                      favorite_id: newMappings[item.favorite_id] || item.favorite_id,
                      favorited_at: new Date().toISOString(),
                    }));
                    processedItemsToAdd = processDocumentUrls(copiedItems);
                  } else {
                    processedItemsToAdd = itemsToTransfer;
                  }
                  const existingTargetIds = new Set(
                    folder.favorites?.map((f) => f && f.favorite_id).filter(Boolean)
                  );
                  const uniqueItemsToAdd = processedItemsToAdd.filter(
                    (item) => item && !existingTargetIds.has(item.favorite_id)
                  );

                  return { ...folder, favorites: [...(folder.favorites || []), ...uniqueItemsToAdd] };
                }

                if (folder.folder_id === sourceFolderId && operationType === 'move') {
                  return {
                    ...folder,
                    favorites: folder.favorites?.filter((fav) => fav && !favoriteIdSet.has(fav.favorite_id)) || [],
                  };
                }

                return folder;
              });
            }
            default:
              return safeFolders;
          }
        } catch (switchError) {
          console.error('Error in broadcast message switch:', switchError);
          return safeFolders;
        }
      }, false);

      if (
        [
          'createFolder',
          'deleteFolder',
          'moveFolder',
          'bulkMoveFolders',
          'copyFolder',
          'updateFolderName',
          'addFavoriteItem',
          'removeFavoriteItem',
          'batchRemoveFavoriteItems',
          'transferFavoriteItems',
        ].includes(type)
      ) {
        try {
          setTimeout(() => {
            mutateFolderTree();
          }, 100);
        } catch (treeError) {
          console.error('Error updating folder tree:', treeError);
        }
      }
    } catch (messageError) {
      console.error('Error handling broadcast message:', messageError);
    }
  };
};

export const useFavoritesBroadcast = ({
  authUser,
  mutateData,
  mutateFolderTree,
  broadcastChannelRef,
}: BroadcastProps) => {
  useEffect(() => {
    if (typeof window === 'undefined' || !authUser || broadcastChannelRef.current) {
      return;
    }

    try {
      broadcastChannelRef.current = new BroadcastChannel(FAVORITES_CHANNEL_NAME);
    } catch (channelError) {
      console.error('Error creating broadcast channel:', channelError);
      return;
    }

    const handleMessage = createMessageHandler({ authUser, mutateData, mutateFolderTree });

    broadcastChannelRef.current.addEventListener('message', handleMessage);

    return () => {
      if (broadcastChannelRef.current) {
        try {
          broadcastChannelRef.current.removeEventListener('message', handleMessage);
          broadcastChannelRef.current.close();
        } catch (cleanupError) {
          console.error('Error cleaning up broadcast channel:', cleanupError);
        } finally {
          broadcastChannelRef.current = null;
        }
      }
    };
  }, [authUser, mutateData, mutateFolderTree, broadcastChannelRef]);
};
