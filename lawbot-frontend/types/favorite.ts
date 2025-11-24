import React from 'react';

// Constants
export const MAX_FOLDER_DEPTH = 5;

// --- Types based on PostgreSQL structure ---
export interface FavoriteItem {
  favorite_id: string; // PostgreSQL BIGSERIAL
  doc_id: string; // 文件唯一ID
  source_table: string; // 來源表名
  title: string; // 新增：書籤項目的標題
  url?: string; // Add optional url field
  favorited_at: string; // 書籤時間戳 (ISO 格式字符串)
}

// 階層資料夾模型
export interface FolderHierarchy {
  folder_id: string;
  user_id: string;
  folder_name: string;
  parent_folder_id?: string | null;
  created_at: string;
  updated_at: string;
  depth: number;
  path: string;
  children: FolderHierarchy[];
  favorites: FavoriteItem[];
}

export interface FavoriteFolder {
  folder_id: string; // PostgreSQL BIGSERIAL
  user_id: string; // Firebase UID
  folder_name: string; // 資料夾名稱
  parent_folder_id?: string | null; // 父資料夾ID，支援階層結構
  created_at: string; // 建立時間 (ISO 格式字符串)
  updated_at: string; // 更新時間 (ISO 格式字符串)
  favorites: FavoriteItem[]; // 書籤項目
}

// 新增請求模型
export interface CreateFolderRequest {
  folder_name: string;
  parent_folder_id?: string | null;
}

export interface MoveFolderRequest {
  target_parent_id?: string | null;
}

export interface BulkMoveFoldersRequest {
  folder_ids: string[];
  target_parent_id?: string | null;
}

export interface CopyFolderRequest {
  target_parent_id?: string | null;
  new_folder_name: string;
  include_subfolders: boolean;
  include_favorites: boolean;
}

// 階層結構回應模型
export interface FolderTreeResponse {
  tree: FolderHierarchy[];
  total_folders: number;
  max_depth: number;
}

export interface FolderPathResponse {
  path: Array<{ folder_id: string; folder_name: string }>;
  full_path: string;
}

// --- Context State and Actions ---
export interface FavoriteContextType {
  folders: FavoriteFolder[];
  folderTree?: FolderTreeResponse; // 新增：階層樹狀結構
  loading: boolean;
  error: Error | null;
  mutateData: () => void;
  mutateFolderTree: () => void; // 新增：更新樹狀結構
  addFavoriteItem: (
    folderId: string,
    // Allow url to be optional when adding
    item: Omit<FavoriteItem, 'favorite_id' | 'favorited_at' | 'url'> & { url?: string } 
  ) => Promise<void>;
  removeFavoriteItem: (folderId: string | null, favoriteId: string) => Promise<void>; // 修改參數類型
  batchRemoveFavoriteItems: (folderId: string | null, favoriteIds: string[]) => Promise<void>; // 修改參數類型
  createFolder: (folderName: string, parentFolderId?: string | null) => Promise<string>; // 支援父資料夾
  deleteFolder: (folderId: string) => Promise<void>; // 支援遞歸刪除
  updateFolderName: (folderId: string, newName: string) => Promise<void>;
  moveFolder: (folderId: string, targetParentId?: string | null) => Promise<void>; // 新增：移動資料夾
  bulkMoveFolders: (folderIds: string[], targetParentId?: string | null) => Promise<void>; // 新增：批量移動資料夾
  copyFolder: (folderId: string, targetParentId: string | null, newFolderName: string, includeSubfolders?: boolean, includeFavorites?: boolean) => Promise<any>; // 新增：複製資料夾
  transferFavoriteItems: (sourceFolderId: string, targetFolderId: string, favoriteIds: string[], operationType: 'move' | 'copy') => Promise<void>; // 新增批量移轉/複製
  transferItems: (sourceFolderId: string, targetFolderId: string, selectedItems: Set<string>, operationType: 'move' | 'copy') => Promise<void>; // 新增：轉移項目（支援資料夾和書籤）
  getFoldersForDoc: (docId: string, source_table: string) => string[];
  isDocFavorited: (docId: string, source_table: string) => boolean; // Add new function type
  getFolderTree: (includeFavorites?: boolean, maxDepth?: number) => Promise<FolderTreeResponse>; // 新增：獲取樹狀結構
  getFolderPath: (folderId: string) => Promise<FolderPathResponse>; // 新增：獲取資料夾路徑
  getAllFolderContents: (folderId: string, includeSubfolders?: boolean) => Promise<any>; // 新增：獲取所有內容
  getAllFavoritesFromFolder: (folderId: string) => FavoriteItem[]; // Add this new function
  getAllFolderContentsLocal: (folderId: string, includeSubfolders?: boolean) => {
    folder_id: string;
    favorites: FavoriteItem[];
    subfolders: FavoriteFolder[];
  }; // Add this new function
}

// --- Provider Component Props ---
export interface FavoriteProviderProps {
  children: React.ReactNode;
}

export interface ActionBarProps {
  selectedItems: Set<string>
  activeFolder: string | null
  searchScope: 'all' | 'current'
  folders: FolderHierarchy[]
  onClearSelection: () => void
  filteredItems?: any[] // 新增：用於檢查選中的項目類型
}


export interface HierarchicalFolderTreeProps {
  activeFolder: string | null
  setActiveFolder: (folderId: string) => void
  setSearchScope: (scope: 'all' | 'current') => void
}

export interface FolderNodeProps {
  folder: FolderHierarchy
  activeFolder: string | null
  expandedFolders: Set<string>
  depth: number
  onToggleExpand: (folderId: string) => void
  onSelectFolder: (folderId: string) => void
  onCreateSubFolder: (parentId: string) => void
  onRenameFolder: (folderId: string, currentName: string) => void
  onDeleteFolder: (folderId: string, folderName: string) => void
  onMoveFolder: (folderId: string, folderName: string) => void
  onTransferFolder: (folderId: string, folderName: string) => void
}


export interface TransferItemsDialogProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  sourceFolderId: string
  selectedItems: Set<string>
  folders: FolderHierarchy[]
  onSuccess: () => void
  allowFolderTransfer?: boolean // 新增：是否允許資料夾轉移
}

export interface CopyFolderDialogProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  folderId: string
  folderName: string
}
