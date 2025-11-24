import { 
  FolderTreeResponse, 
  FolderPathResponse, 
  FolderHierarchy 
} from '@/types/favorite';
import { processDocumentUrls } from '@/utils/processDocUrls';

type ApiInstance = {
  get: <T = any>(url: string, options?: any) => Promise<T | null>;
  post: <T = any>(url: string, body?: any, options?: any) => Promise<T | null>;
  put: <T = any>(url: string, body?: any, options?: any) => Promise<T | null>;
  delete: <T = any>(url: string, options?: any) => Promise<T | null>;
};

// Get Folder Tree
export const getFolderTree = async (
  api: ApiInstance,
  includeFavorites: boolean = true, 
  maxDepth?: number
): Promise<FolderTreeResponse> => {
  const queryParams = new URLSearchParams({
    include_favorites: includeFavorites.toString(),
    ...(maxDepth && { max_depth: maxDepth.toString() })
  });

  const fetchedTree = await api.get<FolderTreeResponse>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/favorites/folders/tree?${queryParams}`
  );

  if (!fetchedTree) {
    throw new Error('Failed to fetch folder tree');
  }

  // Process URLs for favorites in the tree
  const processTreeUrls = (folders: FolderHierarchy[]): FolderHierarchy[] => {
    return folders.map(folder => ({
      ...folder,
      favorites: processDocumentUrls(folder.favorites || []),
      children: processTreeUrls(folder.children || [])
    }));
  };

  return {
    ...fetchedTree,
    tree: processTreeUrls(fetchedTree.tree)
  };
};

// Get Folder Path
export const getFolderPath = async (
  api: ApiInstance,
  folderId: string
): Promise<FolderPathResponse> => {
  const result = await api.get<FolderPathResponse>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/favorites/folders/${folderId}/path`
  );

  if (!result) {
    throw new Error('Failed to fetch folder path');
  }

  return result;
};

// Get All Folder Contents
export const getAllFolderContents = async (
  api: ApiInstance,
  folderId: string, 
  includeSubfolders: boolean = true
): Promise<any> => {
  const queryParams = new URLSearchParams({
    include_subfolders: includeSubfolders.toString()
  });

  const result = await api.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/favorites/folders/${folderId}/contents/all?${queryParams}`
  );

  if (!result) {
    throw new Error('Failed to fetch folder contents');
  }

  return result;
};
