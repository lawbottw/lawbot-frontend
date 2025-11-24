import { useCallback } from 'react';
import { toast } from 'sonner';
import { FavoriteFolder, FavoriteItem } from '@/types/favorite';

type UseFavoriteHelpersProps = {
  folders: FavoriteFolder[];
  plan: any;
};

export const useFavoriteHelpers = ({ folders, plan }: UseFavoriteHelpersProps) => {
  const getTotalFavoritesCount = useCallback((): number => {
    return folders.reduce((total, folder) => {
      return total + (folder.favorites?.length || 0);
    }, 0);
  }, [folders]);

  const checkFavoriteLimit = useCallback(
    (additionalCount: number = 1): boolean => {
      const currentCount = getTotalFavoritesCount();
      const limit = plan === 'free' ? 200 : 1000;

      if (currentCount + additionalCount > limit) {
        if (plan === 'free') {
          toast.error("已經達到免費用戶書籤筆數上限", {
            description: `您已經到達 ${limit} 筆書籤數量，無法再新增書籤。`,
          });
        } else {
          toast.error("已經達到書籤筆數上限", {
            description: `您已經到達 ${limit} 筆書籤數量，如需要更高額度歡迎聯絡客服。`,
          });
        }
        return false;
      }
      return true;
    },
    [getTotalFavoritesCount, plan]
  );

  const calculateFolderDepth = useCallback(
    (parentFolderId: string | null): number => {
      if (!parentFolderId) return 1;

      let depth = 1;
      let currentParentId: string | null = parentFolderId;

      while (currentParentId) {
        depth++;
        const parentFolder = folders.find((f) => f.folder_id === currentParentId);
        currentParentId = parentFolder?.parent_folder_id || null;

        if (depth > 10) break;
      }

      return depth;
    },
    [folders]
  );

  const getSubtreeMaxDepth = useCallback(
    (folderId: string): number => {
      const getDepthRecursive = (currentFolderId: string, currentDepth: number = 1): number => {
        const childFolders = folders.filter((f) => f.parent_folder_id === currentFolderId);

        if (childFolders.length === 0) {
          return currentDepth;
        }

        let maxChildDepth = currentDepth;
        childFolders.forEach((child) => {
          const childDepth = getDepthRecursive(child.folder_id, currentDepth + 1);
          maxChildDepth = Math.max(maxChildDepth, childDepth);
        });

        return maxChildDepth;
      };

      return getDepthRecursive(folderId);
    },
    [folders]
  );

  const checkDepthLimit = useCallback(
    (parentFolderId: string | null, operationType: 'create' | 'move' | 'copy', subtreeDepth: number = 1): boolean => {
      const MAX_DEPTH = 5;
      const targetDepth = calculateFolderDepth(parentFolderId);
      const finalDepth = targetDepth + subtreeDepth - 1;

      if (finalDepth > MAX_DEPTH) {
        const operationText = {
          create: '新增子資料夾',
          move: '移動資料夾',
          copy: '複製資料夾',
        }[operationType];

        toast.error(`無法${operationText}`, {
          description: `資料夾階層深度不能超過 ${MAX_DEPTH} 層。`,
        });
        return false;
      }

      return true;
    },
    [calculateFolderDepth]
  );

  const getAllFavoritesFromFolder = useCallback(
    (folderId: string): FavoriteItem[] => {
      const allFavorites: FavoriteItem[] = [];

      const collectFavorites = (currentFolderId: string, visited: Set<string> = new Set()): void => {
        if (visited.has(currentFolderId)) {
          return;
        }
        visited.add(currentFolderId);

        const currentFolder = folders.find((f) => f.folder_id === currentFolderId);
        if (currentFolder) {
          if (currentFolder.favorites && currentFolder.favorites.length > 0) {
            allFavorites.push(...currentFolder.favorites);
          }

          const childFolders = folders.filter((f) => f.parent_folder_id === currentFolderId);
          childFolders.forEach((childFolder) => {
            collectFavorites(childFolder.folder_id, visited);
          });
        }
      };

      collectFavorites(folderId);
      return allFavorites;
    },
    [folders]
  );

  const getAllFolderContentsLocal = useCallback(
    (folderId: string, includeSubfolders: boolean = true) => {
      const result = {
        folder_id: folderId,
        favorites: [] as FavoriteItem[],
        subfolders: [] as FavoriteFolder[],
      };

      const targetFolder = folders.find((f) => f.folder_id === folderId);
      if (!targetFolder) {
        return result;
      }

      if (includeSubfolders) {
        result.favorites = getAllFavoritesFromFolder(folderId);

        const collectSubfolders = (
          parentId: string,
          visited: Set<string> = new Set()
        ): FavoriteFolder[] => {
          if (visited.has(parentId)) {
            return [];
          }
          visited.add(parentId);

          const directChildren = folders.filter((f) => f.parent_folder_id === parentId);
          const allSubfolders: FavoriteFolder[] = [...directChildren];

          directChildren.forEach((child) => {
            allSubfolders.push(...collectSubfolders(child.folder_id, visited));
          });

          return allSubfolders;
        };

        result.subfolders = collectSubfolders(folderId);
      } else {
        result.favorites = targetFolder.favorites || [];
        result.subfolders = folders.filter((f) => f.parent_folder_id === folderId);
      }

      return result;
    },
    [folders, getAllFavoritesFromFolder]
  );

  return {
    getTotalFavoritesCount,
    checkFavoriteLimit,
    calculateFolderDepth,
    getSubtreeMaxDepth,
    checkDepthLimit,
    getAllFavoritesFromFolder,
    getAllFolderContentsLocal,
  };
};
