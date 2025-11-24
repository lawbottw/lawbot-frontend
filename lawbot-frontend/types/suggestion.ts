import { FavoriteItem, FavoriteFolder } from "./favorite";
import { FuseResult } from "fuse.js";

export interface Suggestion {
  type: 'folder' | 'item';
  id: string; // folder_id or favorite_id
  name: string; // folder_name or title
  displayName?: string; // Original name with spaces for display
  path?: string; // Folder path for hint display
  item?: FavoriteItem; // Include the full item for single files
  folder?: FavoriteFolder; // Include the full folder for folders
}

export interface UseAutocompleteSuggestionProps {
  maxSuggestions?: number;
  isDeepResearchMode?: boolean;
  filesPresent?: boolean;
  websearchEnabled?: boolean;
}

export interface AutocompletePopoverProps {
  show: boolean;
  suggestions: FuseResult<Suggestion>[];
  maxSuggestions: number;
  isComposing: boolean;
  // 修改: onSuggestionSelect 支援 context 物件
  onSuggestionSelect: (suggestion: Suggestion, context?: any) => void;
  onClose: () => void;
}