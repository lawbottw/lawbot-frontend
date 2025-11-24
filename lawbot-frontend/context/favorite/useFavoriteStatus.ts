import { useMemo, useCallback } from 'react';
import { FavoriteFolder } from '@/types/favorite';

// Optimized hooks for favorite status checking
export const useFavoriteStatus = (folders: FavoriteFolder[]) => {
  // Pre-compute favorite status lookup map
  const docFavoriteStatusMap = useMemo(() => {
    const map = new Map<string, Set<string>>();
    
    try {
      if (folders && Array.isArray(folders)) {
        folders.forEach((folder) => {
          if (folder && folder.favorites && Array.isArray(folder.favorites)) {
            folder.favorites.forEach((fav) => {
              if (fav && fav.doc_id && fav.source_table) {
                const key = `${fav.doc_id}:${fav.source_table}`;
                if (!map.has(key)) {
                  map.set(key, new Set());
                }
                map.get(key)!.add(folder.folder_id);
              }
            });
          }
        });
      }
    } catch (error) {
      console.error('Error creating docFavoriteStatusMap:', error);
    }
    
    return map;
  }, [folders]);

  // Optimized function to check if a doc is favorited
  const isDocFavorited = useCallback((docId: string, source_table: string): boolean => {
    if (!docId || !source_table) return false;
    const key = `${docId}:${source_table}`;
    return docFavoriteStatusMap.has(key) && docFavoriteStatusMap.get(key)!.size > 0;
  }, [docFavoriteStatusMap]);

  // Optimized getFoldersForDoc using the map
  const getFoldersForDoc = useCallback((docId: string, source_table: string): string[] => {
    if (!docId || !source_table) return [];
    const key = `${docId}:${source_table}`;
    const folderSet = docFavoriteStatusMap.get(key);
    return folderSet ? Array.from(folderSet) : [];
  }, [docFavoriteStatusMap]);

  return {
    isDocFavorited,
    getFoldersForDoc
  };
};
