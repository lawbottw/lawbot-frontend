import { FavoriteItem } from '@/types/favorite';

type ApiInstance = {
  get: <T = any>(url: string, options?: any) => Promise<T | null>;
  post: <T = any>(url: string, body?: any, options?: any) => Promise<T | null>;
  put: <T = any>(url: string, body?: any, options?: any) => Promise<T | null>;
  delete: <T = any>(url: string, options?: any) => Promise<T | null>;
};

// Add Favorite Item
export const addFavoriteItem = async (
  api: ApiInstance,
  folderId: string,
  item: Omit<FavoriteItem, 'favorite_id' | 'favorited_at' | 'url'> & { url?: string }
): Promise<any> => {
  const result = await api.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/favorites/folders/${folderId}/favorites`,
    item
  );
  
  if (!result) {
    throw new Error('Failed to add favorite item');
  }
  
  return result;
};

// Remove Favorite Item
export const removeFavoriteItem = async (
  api: ApiInstance,
  folderId: string | null, 
  favoriteId: string
): Promise<void> => {
  let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/favorites/favorites?favorite_id=${favoriteId}`;
  if (folderId) {
    url += `&folder_id=${folderId}`;
  }

  const result = await api.delete(url);

  if (result === null) {
    // DELETE request successful (no content)
    return;
  }
};

// Batch Remove Favorite Items
export const batchRemoveFavoriteItems = async (
  api: ApiInstance,
  folderId: string | null, 
  favoriteIds: string[]
): Promise<void> => {
  if (favoriteIds.length === 0) {
    return;
  }

  let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/favorites/favorites`;
  if (folderId) {
    url += `?folder_id=${folderId}`;
  }

  const result = await api.delete(url, {
    body: JSON.stringify({ favorite_ids: favoriteIds }),
  });

  if (result === null) {
    // DELETE request successful (no content)
    return;
  }
};

// Transfer Favorite Items
export const transferFavoriteItems = async (
  api: ApiInstance,
  sourceFolderId: string, 
  targetFolderId: string, 
  favoriteIds: string[], 
  operationType: 'move' | 'copy'
): Promise<any> => {
  if (favoriteIds.length === 0) {
    return;
  }

  const result = await api.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/favorites/folders/${sourceFolderId}/transfer-to/${targetFolderId}`,
    {
      favorite_ids: favoriteIds,
      operation_type: operationType
    }
  );
  
  if (!result) {
    throw new Error(`Failed to ${operationType} favorite items`);
  }
  
  return result;
};
