'use client'
import React, { createContext, useContext, useMemo, useRef } from 'react';
import { FavoriteContextType, FavoriteProviderProps } from '@/types/favorite';
import { useAuth } from './AuthContext';
import { useUser } from './UserContext';
import { useApi } from '@/hooks/useApi';
import { useFavoriteStatus } from './favorite/useFavoriteStatus';
import { createLocalStateUpdaters } from '@/utils/favorite/stateUpdaters';
import { createBroadcastUpdate } from '@/utils/favorite/broadcastUtils';
import { useFavoriteData } from './favorite/useFavoriteData';
import { useFavoriteHelpers } from './favorite/useFavoriteHelpers';
import { useFavoriteActions } from './favorite/useFavoriteActions';
import { useFavoritesBroadcast } from './favorite/useFavoritesBroadcast';

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);

export const FavoriteProvider: React.FC<FavoriteProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const { plan } = useUser();
  const api = useApi();
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);
  const isDeletingRef = useRef(false);

  const { rawFolders, folders, loading, error, mutateData, folderTree, mutateFolderTree } = useFavoriteData({
    authUser: user,
    api,
    user,
    isDeletingRef,
  });

  const stateUpdaters = useMemo(() => createLocalStateUpdaters(), []);

  const { checkFavoriteLimit, getSubtreeMaxDepth, checkDepthLimit, getAllFavoritesFromFolder, getAllFolderContentsLocal } =
    useFavoriteHelpers({ folders, plan });

  const { isDocFavorited, getFoldersForDoc } = useFavoriteStatus(folders);

  const broadcastUpdate = useMemo(() => createBroadcastUpdate(broadcastChannelRef, user), [user?.uid]);

  useFavoritesBroadcast({
    authUser: user,
    mutateData,
    mutateFolderTree,
    broadcastChannelRef,
  });

  const favoriteActions = useFavoriteActions({
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
  });

  const value: FavoriteContextType = {
    folders,
    folderTree,
    loading,
    error,
    mutateData,
    mutateFolderTree,
    addFavoriteItem: favoriteActions.addFavoriteItem,
    removeFavoriteItem: favoriteActions.removeFavoriteItem,
    batchRemoveFavoriteItems: favoriteActions.batchRemoveFavoriteItems,
    createFolder: favoriteActions.createFolder,
    deleteFolder: favoriteActions.deleteFolder,
    updateFolderName: favoriteActions.updateFolderName,
    transferFavoriteItems: favoriteActions.transferFavoriteItems,
    transferItems: favoriteActions.transferItems,
    moveFolder: favoriteActions.moveFolder,
    bulkMoveFolders: favoriteActions.bulkMoveFolders,
    copyFolder: favoriteActions.copyFolder,
    getFoldersForDoc,
    isDocFavorited,
    getFolderTree: favoriteActions.getFolderTree,
    getFolderPath: favoriteActions.getFolderPath,
    getAllFolderContents: favoriteActions.getAllFolderContents,
    getAllFavoritesFromFolder,
    getAllFolderContentsLocal,
  };

  return <FavoriteContext.Provider value={value}>{children}</FavoriteContext.Provider>;
};

export const useFavorites = (): FavoriteContextType => {
  const context = useContext(FavoriteContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoriteProvider');
  }
  return context;
};
