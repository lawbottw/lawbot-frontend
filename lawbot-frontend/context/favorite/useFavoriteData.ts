import { useMemo, RefObject } from 'react';
import useSWR from 'swr';
import { FavoriteFolder, FolderHierarchy, FolderTreeResponse } from '@/types/favorite';
import { processDocumentUrls } from '@/utils/processDocUrls';

type ApiClient = {
  get: <T = any>(url: string, options?: any) => Promise<T | null>;
};

type UseFavoriteDataProps = {
  authUser: any;
  api: ApiClient;
  user: any;
  isDeletingRef: RefObject<boolean>;
};

export const useFavoriteData = ({
  authUser,
  api,
  user,
  isDeletingRef,
}: UseFavoriteDataProps) => {
  const {
    data: rawFolders,
    error,
    mutate: mutateData,
  } = useSWR<FavoriteFolder[]>(
    authUser && !isDeletingRef.current
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/favorites/folders`
      : null,
    async (url: string) => {
      const fetchedFolders = await api.get<FavoriteFolder[]>(url);
      if (!fetchedFolders) return [];

      return fetchedFolders.map((folder) => ({
        ...folder,
        favorites: processDocumentUrls(folder.favorites || []),
      }));
    },
    {
      refreshInterval: 0,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 10000,
      shouldRetryOnError: false,
      errorRetryCount: 2,
      errorRetryInterval: 3000,
      isPaused: () => isDeletingRef.current,
    }
  );

  const { data: folderTree, mutate: mutateFolderTree } = useSWR<FolderTreeResponse>(
    authUser ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/favorites/folders/tree` : null,
    async (url: string) => {
      const fetchedTree = await api.get<FolderTreeResponse>(`${url}?include_favorites=true`);
      if (!fetchedTree) {
        throw new Error('Failed to fetch folder tree');
      }

      const processTreeUrls = (folders: FolderHierarchy[]): FolderHierarchy[] => {
        return folders.map((folder) => ({
          ...folder,
          favorites: processDocumentUrls(folder.favorites || []),
          children: processTreeUrls(folder.children || []),
        }));
      };

      return {
        ...fetchedTree,
        tree: processTreeUrls(fetchedTree.tree),
      };
    },
    {
      refreshInterval: 0,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 10000,
      shouldRetryOnError: false,
      errorRetryCount: 2,
      errorRetryInterval: 3000,
      isPaused: () => isDeletingRef.current,
    }
  );

  const loading = rawFolders === undefined && !error && !!user && !isDeletingRef.current;
  const folders = useMemo(() => rawFolders || [], [rawFolders]);

  return {
    rawFolders,
    folders,
    loading,
    error,
    mutateData,
    folderTree,
    mutateFolderTree,
  };
};
